/**
 * POST /api/admin/invoices/[id]/resend
 * Re-send the invoice email to the creator (generates a fresh PDF on demand).
 */
import sql from "@/app/api/utils/sql";
import { getSession, getAdminSession } from "@/app/api/utils/auth";
import {
  generateInvoiceHTML,
  generateInvoicePDF,
  pdfToBase64,
} from "@/app/api/utils/invoice-generator";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL =
  process.env.FROM_EMAIL ||
  "Falcus Media Agency <noreply@falcusmediaagency.com>";

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

    if (!inv.creator_email) {
      return Response.json(
        { error: "No email address on record for this creator" },
        { status: 400 },
      );
    }

    // Re-generate HTML + PDF
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

    let pdfBase64 = null;
    try {
      const pdfBuffer = await generateInvoicePDF(html);
      pdfBase64 = pdfToBase64(pdfBuffer);
    } catch (pdfErr) {
      console.error("PDF generation failed on resend:", pdfErr);
    }

    const { monthName } = await import("@/app/api/utils/invoice-generator");
    const period = `${monthName(inv.month)} ${inv.year}`;

    const emailBody = {
      from: FROM_EMAIL,
      to: [inv.creator_email],
      subject: `Your Earnings Invoice for ${period} — ${inv.invoice_number}`,
      html: `<p>Hello <strong>${inv.creator_name}</strong>,</p>
             <p>Please find your earnings invoice for <strong>${period}</strong> attached.</p>
             <p><strong>Invoice #:</strong> ${inv.invoice_number}<br/>
                <strong>Net Payable:</strong> $${parseFloat(inv.net_amount).toFixed(2)}</p>
             <p>— Falcus Media Agency</p>`,
      text: `Hello ${inv.creator_name},\n\nPlease find your earnings invoice for ${period} attached.\nInvoice #: ${inv.invoice_number}\nNet Payable: $${parseFloat(inv.net_amount).toFixed(2)}\n\n— Falcus Media Agency`,
    };

    if (pdfBase64) {
      emailBody.attachments = [
        {
          filename: `${inv.invoice_number}.pdf`,
          content: pdfBase64,
        },
      ];
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailBody),
    });

    const resData = await res.json();

    if (!res.ok) {
      await sql`
        UPDATE invoices SET email_error = ${resData.message || "Resend failed"}, updated_at = NOW()
        WHERE id = ${parseInt(id)}
      `;
      return Response.json(
        { error: resData.message || "Failed to send email" },
        { status: 500 },
      );
    }

    // Mark as sent
    await sql`
      UPDATE invoices
      SET email_sent = true, email_sent_at = NOW(), email_error = NULL, updated_at = NOW()
      WHERE id = ${parseInt(id)}
    `;

    console.log(
      `✅ Invoice ${inv.invoice_number} resent to ${inv.creator_email}`,
    );

    return Response.json({
      success: true,
      message: `Invoice resent to ${inv.creator_email}`,
      emailId: resData.id,
    });
  } catch (err) {
    console.error(`POST /api/admin/invoices/${params?.id}/resend error:`, err);
    if (err.message === "Unauthorized") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    return Response.json({ error: err.message }, { status: 500 });
  }
}
