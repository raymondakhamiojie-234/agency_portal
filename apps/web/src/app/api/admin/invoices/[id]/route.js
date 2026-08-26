/**
 * GET /api/admin/invoices/[id] — fetch a single invoice with its breakdown
 */
import sql from "@/app/api/utils/sql";
import { getSession, getAdminSession } from "@/app/api/utils/auth";

async function requireAdmin(request) {
  const session = await getSession(request);
  const adminSession = await getAdminSession(request);
  const ok = session?.user?.isAdmin === true || !!adminSession?.admin?.id;
  if (!ok) throw new Error("Unauthorized");
}

export async function GET(request, { params }) {
  try {
    await requireAdmin(request);

    const { id } = params;

    const rows = await sql`
      SELECT 
        i.*,
        cp.page_name,
        cp.primary_platform,
        cp.profile_image_url
      FROM invoices i
      LEFT JOIN creator_profiles cp ON i.creator_id = cp.id
      WHERE i.id = ${parseInt(id)}
      LIMIT 1
    `;

    if (rows.length === 0) {
      return Response.json({ error: "Invoice not found" }, { status: 404 });
    }

    return Response.json({ success: true, invoice: rows[0] });
  } catch (err) {
    console.error(`GET /api/admin/invoices/${params?.id} error:`, err);
    if (err.message === "Unauthorized") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    return Response.json({ error: err.message }, { status: 500 });
  }
}
