/**
 * GET /api/creator/invoices
 * Returns all invoices for the currently authenticated creator.
 * Supports optional ?month=&year= filters.
 */
import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/auth";

export async function GET(request) {
  try {
    const session = await getSession(request);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Resolve creator profile linked to this auth user
    const profiles = await sql`
      SELECT id FROM creator_profiles
      WHERE user_id = ${session.user.id}
      LIMIT 1
    `;

    if (profiles.length === 0) {
      return Response.json(
        { error: "Creator profile not found" },
        { status: 404 },
      );
    }

    const creatorId = profiles[0].id;

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month")
      ? parseInt(searchParams.get("month"))
      : null;
    const year = searchParams.get("year")
      ? parseInt(searchParams.get("year"))
      : null;

    // Build query using tagged-template form, branching on optional filters
    let invoices;
    if (month && year) {
      invoices = await sql`
        SELECT
          i.id,
          i.invoice_number,
          i.month,
          i.year,
          i.total_amount,
          i.withholding_tax,
          i.net_amount,
          i.status,
          i.email_sent,
          i.email_sent_at,
          i.earnings_breakdown,
          i.created_at,
          i.updated_at
        FROM invoices i
        WHERE i.creator_id = ${creatorId}
          AND i.month = ${month}
          AND i.year = ${year}
        ORDER BY i.year DESC, i.month DESC
      `;
    } else if (month) {
      invoices = await sql`
        SELECT
          i.id,
          i.invoice_number,
          i.month,
          i.year,
          i.total_amount,
          i.withholding_tax,
          i.net_amount,
          i.status,
          i.email_sent,
          i.email_sent_at,
          i.earnings_breakdown,
          i.created_at,
          i.updated_at
        FROM invoices i
        WHERE i.creator_id = ${creatorId}
          AND i.month = ${month}
        ORDER BY i.year DESC, i.month DESC
      `;
    } else if (year) {
      invoices = await sql`
        SELECT
          i.id,
          i.invoice_number,
          i.month,
          i.year,
          i.total_amount,
          i.withholding_tax,
          i.net_amount,
          i.status,
          i.email_sent,
          i.email_sent_at,
          i.earnings_breakdown,
          i.created_at,
          i.updated_at
        FROM invoices i
        WHERE i.creator_id = ${creatorId}
          AND i.year = ${year}
        ORDER BY i.year DESC, i.month DESC
      `;
    } else {
      invoices = await sql`
        SELECT
          i.id,
          i.invoice_number,
          i.month,
          i.year,
          i.total_amount,
          i.withholding_tax,
          i.net_amount,
          i.status,
          i.email_sent,
          i.email_sent_at,
          i.earnings_breakdown,
          i.created_at,
          i.updated_at
        FROM invoices i
        WHERE i.creator_id = ${creatorId}
        ORDER BY i.year DESC, i.month DESC
      `;
    }

    // Compute summary totals
    const totalGross = invoices.reduce(
      (s, i) => s + parseFloat(i.total_amount || 0),
      0,
    );
    const totalNet = invoices.reduce(
      (s, i) => s + parseFloat(i.net_amount || 0),
      0,
    );

    return Response.json({
      success: true,
      invoices,
      summary: {
        count: invoices.length,
        totalGross,
        totalNet,
      },
    });
  } catch (err) {
    console.error("GET /api/creator/invoices error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
