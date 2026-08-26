import sql from "@/app/api/utils/sql";
import { getSession, getAdminSession } from "@/app/api/utils/auth";

export async function GET(request) {
  try {
    const session = await getSession(request);
    const adminSession = await getAdminSession(request);

    const isAuthorized =
      session?.user?.isAdmin === true || adminSession?.admin?.id;

    if (!isAuthorized) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return the last 10 upload batches from earnings_uploads
    const uploads = await sql`
      SELECT
        id,
        filename,
        records_count,
        total_amount,
        withholding_tax_total,
        creators_affected,
        errors_count,
        uploaded_by,
        created_at AS uploaded_at
      FROM earnings_uploads
      ORDER BY created_at DESC
      LIMIT 10
    `;

    return Response.json({ success: true, uploads });
  } catch (err) {
    console.error("GET /api/admin/earnings/recent error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
