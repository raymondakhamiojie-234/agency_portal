/**
 * Invoice Generator — Falcus Media Agency
 *
 * Generates professional HTML invoices and converts them to PDF
 * via the /integrations/pdf-generation/pdf endpoint.
 */

const APP_URL =
  process.env.NEXT_PUBLIC_CREATE_APP_URL || "http://localhost:3000";

/**
 * Build a unique invoice number
 * Format: INV-YYYY-MM-CREATORID
 */
export function buildInvoiceNumber(creatorId, month, year) {
  const mm = String(month).padStart(2, "0");
  const cid = String(creatorId).padStart(4, "0");
  return `INV-${year}-${mm}-${cid}`;
}

/**
 * Return a full month name from a 1-based month integer
 */
export function monthName(month) {
  return new Date(2000, month - 1, 1).toLocaleString("en-US", {
    month: "long",
  });
}

/**
 * Format a number as USD currency
 */
function usd(amount) {
  return parseFloat(amount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Generate the HTML for a professional invoice.
 *
 * @param {Object} opts
 * @param {string} opts.invoiceNumber
 * @param {string} opts.creatorName
 * @param {string} opts.creatorEmail
 * @param {number} opts.month           1-based month
 * @param {number} opts.year
 * @param {number} opts.totalAmount
 * @param {number} opts.withholdingTax
 * @param {number} opts.netAmount
 * @param {string} opts.status          "Pending" | "Paid"
 * @param {Array}  opts.earningsBreakdown  array of earning records
 * @param {string} opts.generatedAt     ISO date string
 */
export function generateInvoiceHTML({
  invoiceNumber,
  creatorName,
  creatorEmail,
  month,
  year,
  totalAmount,
  withholdingTax,
  netAmount,
  status = "Pending",
  earningsBreakdown = [],
  generatedAt,
}) {
  const period = `${monthName(month)} ${year}`;
  const dateGenerated = generatedAt
    ? new Date(generatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  const statusColor = status === "Paid" ? "#16a34a" : "#d97706";
  const statusBg = status === "Paid" ? "#dcfce7" : "#fef3c7";

  // Build earnings breakdown rows
  const breakdownRows =
    earningsBreakdown.length > 0
      ? earningsBreakdown
          .map((e) => {
            const date = e.earning_date
              ? new Date(e.earning_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "—";
            return `
          <tr>
            <td style="padding: 10px 16px; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #374151;">${date}</td>
            <td style="padding: 10px 16px; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #374151;">${e.platform || "—"}</td>
            <td style="padding: 10px 16px; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #374151; text-align: right;">$${usd(e.amount)}</td>
            <td style="padding: 10px 16px; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #6b7280; text-align: right;">$${usd(e.withholding_tax)}</td>
          </tr>`;
          })
          .join("")
      : `<tr>
          <td colspan="4" style="padding: 20px 16px; text-align: center; color: #9ca3af; font-size: 13px;">
            No earnings breakdown available
          </td>
         </tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invoice ${invoiceNumber} — Falcus Media Agency</title>
</head>
<body style="margin: 0; padding: 0; background: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">

  <div style="max-width: 800px; margin: 0 auto; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">

    <!-- ===== HEADER ===== -->
    <div style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); padding: 40px 48px; border-radius: 0;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <div style="font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
            FALCUS MEDIA
          </div>
          <div style="font-size: 13px; color: rgba(255,255,255,0.75); margin-top: 4px; letter-spacing: 2px; text-transform: uppercase;">
            Agency
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 24px; font-weight: 700; color: #ffffff;">INVOICE</div>
          <div style="font-size: 14px; color: rgba(255,255,255,0.85); margin-top: 4px; font-family: 'Courier New', monospace;">${invoiceNumber}</div>
        </div>
      </div>
    </div>

    <!-- ===== META ROW ===== -->
    <div style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 20px 48px; display: flex; gap: 48px; flex-wrap: wrap;">
      <div>
        <div style="font-size: 10px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 4px;">Date Generated</div>
        <div style="font-size: 14px; font-weight: 500; color: #1e293b;">${dateGenerated}</div>
      </div>
      <div>
        <div style="font-size: 10px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 4px;">Earnings Period</div>
        <div style="font-size: 14px; font-weight: 500; color: #1e293b;">${period}</div>
      </div>
      <div>
        <div style="font-size: 10px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 4px;">Payment Status</div>
        <div style="display: inline-block; padding: 3px 12px; background: ${statusBg}; color: ${statusColor}; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
          ${status}
        </div>
      </div>
    </div>

    <!-- ===== BILL TO / FROM ===== -->
    <div style="padding: 36px 48px; display: flex; gap: 48px; flex-wrap: wrap; border-bottom: 1px solid #e2e8f0;">
      <!-- From -->
      <div style="flex: 1; min-width: 200px;">
        <div style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px;">From</div>
        <div style="font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">Falcus Media Agency</div>
        <div style="font-size: 13px; color: #64748b; line-height: 1.6;">
          No 2 Ekezue Street<br />
          Off Eziopkor Road, Obiaruku<br />
          Delta State, Nigeria<br />
          support@falcusmediaagency.com
        </div>
      </div>
      <!-- To -->
      <div style="flex: 1; min-width: 200px;">
        <div style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px;">Bill To</div>
        <div style="font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">${creatorName}</div>
        <div style="font-size: 13px; color: #64748b; line-height: 1.6;">
          ${creatorEmail}
        </div>
      </div>
    </div>

    <!-- ===== EARNINGS BREAKDOWN TABLE ===== -->
    <div style="padding: 36px 48px; border-bottom: 1px solid #e2e8f0;">
      <div style="font-size: 13px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 16px;">
        Earnings Breakdown — ${period}
      </div>

      <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <thead>
          <tr style="background: #f1f5f9;">
            <th style="padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Date</th>
            <th style="padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Platform</th>
            <th style="padding: 12px 16px; text-align: right; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Earnings</th>
            <th style="padding: 12px 16px; text-align: right; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Withholding Tax</th>
          </tr>
        </thead>
        <tbody>
          ${breakdownRows}
        </tbody>
      </table>
    </div>

    <!-- ===== TOTALS ===== -->
    <div style="padding: 28px 48px; border-bottom: 1px solid #e2e8f0;">
      <div style="max-width: 320px; margin-left: auto;">
        <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; color: #64748b;">
          <span>Gross Earnings</span>
          <span style="font-weight: 500; color: #1e293b;">$${usd(totalAmount)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; color: #64748b; border-bottom: 1px solid #e2e8f0; margin-bottom: 8px;">
          <span>Withholding Tax</span>
          <span style="font-weight: 500; color: #dc2626;">-$${usd(withholdingTax)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 12px 16px; background: #7c3aed; border-radius: 8px; margin-top: 8px;">
          <span style="font-size: 14px; font-weight: 700; color: #ffffff;">Net Payable</span>
          <span style="font-size: 18px; font-weight: 800; color: #ffffff;">$${usd(netAmount)}</span>
        </div>
      </div>
    </div>

    <!-- ===== FOOTER ===== -->
    <div style="padding: 28px 48px; background: #f8fafc; border-top: 1px solid #e2e8f0;">
      <p style="font-size: 12px; color: #94a3b8; margin: 0 0 6px 0; line-height: 1.6;">
        This invoice was automatically generated by Falcus Media Agency for the earnings period of <strong>${period}</strong>.
        Payments are processed between the 25th–30th of each month.
      </p>
      <p style="font-size: 12px; color: #94a3b8; margin: 0; line-height: 1.6;">
        Questions? Contact us at <strong>support@falcusmediaagency.com</strong>
      </p>
      <div style="margin-top: 16px; border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center; font-size: 11px; color: #cbd5e1;">
        © ${year} Falcus Media Agency · All rights reserved · Invoice ${invoiceNumber}
      </div>
    </div>

  </div>
</body>
</html>`;
}

/**
 * Convert the HTML invoice to a PDF binary via the platform integration.
 * Returns an ArrayBuffer of the PDF bytes.
 */
export async function generateInvoicePDF(html) {
  const response = await fetch(`${APP_URL}/integrations/pdf-generation/pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source: { html },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`PDF generation failed (${response.status}): ${errText}`);
  }

  return response.arrayBuffer();
}

/**
 * Convert a PDF ArrayBuffer to a base64 string (for email attachments).
 */
export function pdfToBase64(arrayBuffer) {
  return Buffer.from(arrayBuffer).toString("base64");
}
