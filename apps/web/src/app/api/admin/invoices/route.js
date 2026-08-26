/**
 * GET  /api/admin/invoices  — list all invoices (with filters)
 * POST /api/admin/invoices  — manually generate invoice(s)
 */
import sql from "@/app/api/utils/sql";
import { getSession, getAdminSession } from "@/app/api/utils/auth";
import { generateAndSendInvoice } from "@/app/api/utils/invoice-service";

async function requireAdmin(request) {
  const session = await getSession(request);
  const adminSession = await getAdminSession(request);
  const ok = session?.user?.isAdmin === true || !!adminSession?.admin?.id;
  if (!ok) throw new Error("Unauthorized");
}

// ─── GET /api/admin/invoices ────────────────────────────────────────────────
export async function GET(request) {
  try {
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const creatorId = searchParams.get("creator_id");
    const emailSent = searchParams.get("email_sent");
    const search = searchParams.get("search");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "50"));
    const offset = (page - 1) * limit;

    // Build dynamic WHERE clauses
    const conditions = [];
    const values = [];
    let idx = 1;

    if (month) {
      conditions.push(`i.month = $${idx++}`);
      values.push(parseInt(month));
    }
    if (year) {
      conditions.push(`i.year = $${idx++}`);
      values.push(parseInt(year));
    }
    if (creatorId) {
      conditions.push(`i.creator_id = $${idx++}`);
      values.push(parseInt(creatorId));
    }
    if (emailSent !== null && emailSent !== undefined && emailSent !== "") {
      conditions.push(`i.email_sent = $${idx++}`);
      values.push(emailSent === "true");
    }
    if (search) {
      conditions.push(
        `(LOWER(i.creator_name) LIKE LOWER($${idx}) OR LOWER(i.creator_email) LIKE LOWER($${idx}) OR LOWER(i.invoice_number) LIKE LOWER($${idx}))`,
      );
      values.push(`%${search}%`);
      idx++;
    }

    const where =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const invoices = await sql(
      `SELECT 
         i.id,
         i.invoice_number,
         i.creator_id,
         i.creator_name,
         i.creator_email,
         i.month,
         i.year,
         i.total_amount,
         i.withholding_tax,
         i.net_amount,
         i.status,
         i.email_sent,
         i.email_sent_at,
         i.email_error,
         i.created_at,
         i.updated_at,
         cp.page_name
       FROM invoices i
       LEFT JOIN creator_profiles cp ON i.creator_id = cp.id
       ${where}
       ORDER BY i.created_at DESC
       LIMIT $${idx++} OFFSET $${idx++}`,
      [...values, limit, offset],
    );

    const countResult = await sql(
      `SELECT COUNT(*) as total FROM invoices i ${where}`,
      values,
    );

    return Response.json({
      success: true,
      invoices,
      pagination: {
        page,
        limit,
        total: parseInt(countResult[0].total),
        pages: Math.ceil(parseInt(countResult[0].total) / limit),
      },
    });
  } catch (err) {
    console.error("GET /api/admin/invoices error:", err);
    if (err.message === "Unauthorized") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// ─── POST /api/admin/invoices ───────────────────────────────────────────────
// Body: { creator_id, month, year, force? }
//   OR: { creator_ids: [...], month, year, force? }  (bulk)
export async function POST(request) {
  try {
    await requireAdmin(request);

    const body = await request.json();
    const { month, year, force = false } = body;

    if (!month || !year) {
      return Response.json(
        { error: "month and year are required" },
        { status: 400 },
      );
    }

    // Resolve creator list
    let creatorIds = [];
    if (body.creator_ids && Array.isArray(body.creator_ids)) {
      creatorIds = body.creator_ids;
    } else if (body.creator_id) {
      creatorIds = [body.creator_id];
    } else {
      // No specific creator — generate for ALL creators who have earnings that month
      const affected = await sql`
        SELECT DISTINCT creator_id
        FROM earnings
        WHERE EXTRACT(MONTH FROM earning_date) = ${parseInt(month)}
          AND EXTRACT(YEAR  FROM earning_date) = ${parseInt(year)}
      `;
      creatorIds = affected.map((r) => r.creator_id);

      if (creatorIds.length === 0) {
        return Response.json(
          { error: `No earnings found for ${month}/${year}` },
          { status: 404 },
        );
      }
    }

    const results = [];
    for (const creatorId of creatorIds) {
      try {
        const result = await generateAndSendInvoice(
          creatorId,
          parseInt(month),
          parseInt(year),
          force,
        );
        results.push({ creatorId, ...result });
      } catch (err) {
        results.push({ creatorId, status: "error", error: err.message });
      }
    }

    const sent = results.filter((r) => r.status === "sent").length;
    const skipped = results.filter((r) => r.status === "skipped").length;
    const errors = results.filter((r) => r.status === "error").length;

    return Response.json({
      success: true,
      summary: { total: results.length, sent, skipped, errors },
      results,
    });
  } catch (err) {
    console.error("POST /api/admin/invoices error:", err);
    if (err.message === "Unauthorized") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    return Response.json({ error: err.message }, { status: 500 });
  }
}
