/**
 * GET /api/admin/invoices/[id]/download
 * Stream the PDF for the given invoice directly to the browser.
 */
import sql from "@/app/api/utils/sql";
import { getSession, getAdminSession } from "@/app/api/utils/auth";
import {
  generateInvoiceHTML,
  generateInvoicePDF,
} from "@/app/api/utils/invoice-generator";

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
      SELECT * FROM invoices WHERE id = ${parseInt(id)} LIMIT 1
    `;

    if (rows.length === 0) {
      return Response.json({ error: "Invoice not found" }, { status: 404 });
    }

    const inv = rows[0];

    // Re-generate the HTML on the fly (we don't store the PDF binary in DB)
    const html = generateInvoiceHTML({
      invoiceNumber: inv.invoice_number,
      creatorName: inv.creator_name,
      creatorEmail: inv.creator_email,
      month: inv.month,
      year: inv.year,
      totalAmount: inv.total_amount,
      withholdingTax: inv.withholding_tax,
      netAmount: inv.net_amount,
      status: inv.status,
      earningsBreakdown: Array.isArray(inv.earnings_breakdown)
        ? inv.earnings_breakdown
        : [],
      generatedAt: inv.created_at,
    });

    const pdfBuffer = await generateInvoicePDF(html);

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${inv.invoice_number}.pdf"`,
        "Content-Length": String(pdfBuffer.byteLength),
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error(`GET /api/admin/invoices/${params?.id}/download error:`, err);
    if (err.message === "Unauthorized") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    return Response.json(
      { error: `Failed to generate PDF: ${err.message}` },
      { status: 500 },
    );
  }
}
