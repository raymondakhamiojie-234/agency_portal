/**
 * POST /api/admin/invoices/[id]/regenerate
 * Force-regenerate and re-send an invoice, overwriting the existing record.
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

export async function POST(request, { params }) {
  try {
    await requireAdmin(request);

    const { id } = params;

    const rows = await sql`
      SELECT * FROM invoices WHERE id = ${parseInt(id)} LIMIT 1
    `;

    if (rows.length === 0) {
      return Response.json({ error: "Invoice not found" }, { status: 404 });
    }

    const inv = rows[0];

    // Re-run with force=true so it overwrites the existing record
    const result = await generateAndSendInvoice(
      inv.creator_id,
      inv.month,
      inv.year,
      true, // force
    );

    return Response.json({
      success: true,
      message: `Invoice regenerated and ${result.emailSent ? "sent" : "saved (email failed)"}`,
      ...result,
    });
  } catch (err) {
    console.error(
      `POST /api/admin/invoices/${params?.id}/regenerate error:`,
      err,
    );
    if (err.message === "Unauthorized") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    return Response.json({ error: err.message }, { status: 500 });
  }
}
