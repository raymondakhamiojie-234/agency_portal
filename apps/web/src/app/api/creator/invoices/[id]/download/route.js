/**
 * GET /api/creator/invoices/[id]/download
 * Streams the PDF for an invoice that belongs to the authenticated creator.
 * Ensures a creator can ONLY download their own invoices.
 */
import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/auth";
import {
  generateInvoiceHTML,
  generateInvoicePDF,
} from "@/app/api/utils/invoice-generator";

export async function GET(request, { params }) {
  try {
    const session = await getSession(request);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Resolve creator profile for this user
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
    const { id } = params;

    // Fetch invoice — verify ownership
    const rows = await sql`
      SELECT * FROM invoices
      WHERE id = ${parseInt(id)}
        AND creator_id = ${creatorId}
      LIMIT 1
    `;

    if (rows.length === 0) {
      return Response.json(
        { error: "Invoice not found or access denied" },
        { status: 404 },
      );
    }

    const inv = rows[0];

    // Regenerate HTML → PDF on the fly (PDFs are not stored in the DB)
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
    console.error(
      `GET /api/creator/invoices/${params?.id}/download error:`,
      err,
    );
    return Response.json(
      { error: `Failed to generate PDF: ${err.message}` },
      { status: 500 },
    );
  }
}
