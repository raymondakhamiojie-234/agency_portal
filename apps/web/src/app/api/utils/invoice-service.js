/**
 * Invoice Service — Falcus Media Agency
 *
 * Core orchestration layer:
 *  - Detects which creator+month combos need invoices
 *  - Generates HTML → PDF
 *  - Sends email with PDF attachment
 *  - Persists invoice records with duplication prevention
 */

import sql from "@/app/api/utils/sql";
import {
  buildInvoiceNumber,
  generateInvoiceHTML,
  generateInvoicePDF,
  pdfToBase64,
  monthName,
} from "@/app/api/utils/invoice-generator";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL =
  process.env.FROM_EMAIL ||
  "Falcus Media Agency <noreply@falcusmediaagency.com>";

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Called after a CSV upload or manual DB update.
 * For each creator × month/year pair, generate + send an invoice
 * (skipping pairs that already have an invoice unless force=true).
 *
 * @param {Array<{ creatorId: number, month: number, year: number }>} targets
 * @param {boolean} force  – if true, regenerate even if invoice already exists
 * @returns {Array<{ creatorId, month, year, status, invoiceId?, error? }>}
 */
export async function processInvoicesForTargets(targets, force = false) {
  const results = [];

  for (const { creatorId, month, year } of targets) {
    try {
      const result = await generateAndSendInvoice(
        creatorId,
        month,
        year,
        force,
      );
      results.push({ creatorId, month, year, ...result });
    } catch (err) {
      console.error(
        `Invoice error for creator ${creatorId} (${month}/${year}):`,
        err,
      );
      results.push({
        creatorId,
        month,
        year,
        status: "error",
        error: err.message,
      });
    }
  }

  return results;
}

/**
 * Build the list of { creatorId, month, year } targets from a set of
 * newly created earnings records, grouped by creator × month/year.
 *
 * @param {Map<number, Set<string>>} creatorEarningDates
 *   Map of creatorId → Set of "YYYY-MM-DD" strings
 */
export function buildTargetsFromEarnings(creatorEarningDates) {
  const targets = [];
  for (const [creatorId, dates] of creatorEarningDates) {
    const combos = new Set();
    for (const dateStr of dates) {
      const d = new Date(dateStr);
      const key = `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}`;
      if (!combos.has(key)) {
        combos.add(key);
        targets.push({
          creatorId,
          month: d.getUTCMonth() + 1,
          year: d.getUTCFullYear(),
        });
      }
    }
  }
  return targets;
}

/**
 * Generate and optionally send an invoice for a single creator + month/year.
 *
 * @returns {{ status, invoiceId?, skipped?, alreadyExists? }}
 */
export async function generateAndSendInvoice(
  creatorId,
  month,
  year,
  force = false,
) {
  // 1. Check duplication
  const existing = await sql`
    SELECT id, email_sent FROM invoices
    WHERE creator_id = ${creatorId}
      AND month = ${month}
      AND year = ${year}
    LIMIT 1
  `;

  if (existing.length > 0 && !force) {
    console.log(
      `Invoice already exists for creator ${creatorId} (${month}/${year}) — skipping`,
    );
    return {
      status: "skipped",
      invoiceId: existing[0].id,
      alreadyExists: true,
    };
  }

  // 2. Load creator data
  const creators = await sql`
    SELECT cp.id, cp.full_name, cp.page_name, COALESCE(au.email, cp.bank_name) as bank_check, au.email
    FROM creator_profiles cp
    LEFT JOIN auth_users au ON cp.user_id = au.id
    WHERE cp.id = ${creatorId}
    LIMIT 1
  `;

  if (creators.length === 0) {
    throw new Error(
      `Creator #${creatorId} has no profile record in the system`,
    );
  }

  const creator = creators[0];

  if (!creator.email) {
    throw new Error(
      `Creator #${creatorId} (${creator.full_name || "Unknown"}) has no email address — they may have been imported without an account`,
    );
  }

  // 3. Load earnings for that month/year
  const earnings = await sql`
    SELECT id, platform, amount, earning_date, withholding_tax, payout_status
    FROM earnings
    WHERE creator_id = ${creatorId}
      AND EXTRACT(MONTH FROM earning_date) = ${month}
      AND EXTRACT(YEAR FROM earning_date) = ${year}
    ORDER BY earning_date ASC
  `;

  if (earnings.length === 0) {
    throw new Error(
      `No earnings found for creator ${creatorId} in ${month}/${year}`,
    );
  }

  // 4. Calculate totals
  const totalAmount = earnings.reduce(
    (s, e) => s + parseFloat(e.amount || 0),
    0,
  );
  const withholdingTax = earnings.reduce(
    (s, e) => s + parseFloat(e.withholding_tax || 0),
    0,
  );
  const netAmount = totalAmount - withholdingTax;

  const invoiceNumber = buildInvoiceNumber(creatorId, month, year);
  const now = new Date().toISOString();

  // 5. Generate HTML
  const html = generateInvoiceHTML({
    invoiceNumber,
    creatorName: creator.full_name,
    creatorEmail: creator.email,
    month,
    year,
    totalAmount,
    withholdingTax,
    netAmount,
    status: "Pending",
    earningsBreakdown: earnings,
    generatedAt: now,
  });

  // 6. Generate PDF
  let pdfBuffer;
  try {
    pdfBuffer = await generateInvoicePDF(html);
  } catch (pdfErr) {
    console.error("PDF generation failed:", pdfErr);
    // Still create the invoice record, just without PDF attached to email
    pdfBuffer = null;
  }

  const pdfBase64 = pdfBuffer ? pdfToBase64(pdfBuffer) : null;

  // 7. Upsert invoice record
  let invoiceId;
  if (existing.length > 0 && force) {
    // Overwrite existing
    const updated = await sql`
      UPDATE invoices SET
        invoice_number = ${invoiceNumber},
        creator_name   = ${creator.full_name},
        creator_email  = ${creator.email},
        total_amount   = ${totalAmount},
        withholding_tax = ${withholdingTax},
        net_amount     = ${netAmount},
        status         = 'Pending',
        email_sent     = false,
        email_sent_at  = NULL,
        email_error    = NULL,
        earnings_breakdown = ${JSON.stringify(earnings)},
        updated_at     = NOW()
      WHERE creator_id = ${creatorId}
        AND month = ${month}
        AND year  = ${year}
      RETURNING id
    `;
    invoiceId = updated[0].id;
  } else {
    const inserted = await sql`
      INSERT INTO invoices (
        invoice_number, creator_id, creator_name, creator_email,
        month, year, total_amount, withholding_tax, net_amount,
        status, email_sent, earnings_breakdown, created_at, updated_at
      ) VALUES (
        ${invoiceNumber}, ${creatorId}, ${creator.full_name}, ${creator.email},
        ${month}, ${year}, ${totalAmount}, ${withholdingTax}, ${netAmount},
        'Pending', false, ${JSON.stringify(earnings)}, NOW(), NOW()
      )
      RETURNING id
    `;
    invoiceId = inserted[0].id;
  }

  // 8. Send email with PDF attachment
  const emailResult = await sendInvoiceEmail({
    to: creator.email,
    creatorName: creator.full_name,
    invoiceNumber,
    month,
    year,
    totalAmount,
    withholdingTax,
    netAmount,
    pdfBase64,
    invoiceId,
  });

  // 9. Update email status on invoice
  if (emailResult.success) {
    await sql`
      UPDATE invoices
      SET email_sent = true, email_sent_at = NOW(), email_error = NULL, updated_at = NOW()
      WHERE id = ${invoiceId}
    `;
  } else {
    await sql`
      UPDATE invoices
      SET email_error = ${emailResult.error}, updated_at = NOW()
      WHERE id = ${invoiceId}
    `;
  }

  return {
    status: emailResult.success ? "sent" : "generated_not_sent",
    invoiceId,
    emailSent: emailResult.success,
    emailError: emailResult.error || null,
    totalAmount,
    netAmount,
  };
}

// ---------------------------------------------------------------------------
// Email sender (internal)
// ---------------------------------------------------------------------------

async function sendInvoiceEmail({
  to,
  creatorName,
  invoiceNumber,
  month,
  year,
  totalAmount,
  withholdingTax,
  netAmount,
  pdfBase64,
  invoiceId,
}) {
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY not set — invoice email not sent");
    return { success: false, error: "Email service not configured" };
  }

  const period = `${monthName(month)} ${year}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background: #f9fafb; }
    .wrapper { max-width: 600px; margin: 0 auto; background: #fff; }
    .header { background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); color: #fff; padding: 36px 32px; text-align: center; }
    .header h1 { margin: 0 0 6px; font-size: 24px; font-weight: 800; }
    .header p { margin: 0; opacity: 0.85; font-size: 14px; }
    .content { padding: 36px 32px; }
    .summary { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px 24px; margin: 24px 0; }
    .summary-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; color: #374151; }
    .summary-row.total { font-weight: 700; font-size: 16px; color: #7c3aed; border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 6px; }
    .cta { text-align: center; margin: 28px 0; }
    .footer { background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 24px 32px; text-align: center; font-size: 13px; color: #6b7280; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>📄 Your Earnings Invoice</h1>
      <p>For the period: <strong>${period}</strong></p>
    </div>
    <div class="content">
      <p style="font-size:16px; margin-bottom: 6px;">Hello <strong>${creatorName}</strong>,</p>
      <p>Your earnings for <strong>${period}</strong> have been processed. Please find your invoice attached to this email.</p>
      <div class="summary">
        <div class="summary-row"><span>Invoice Number</span><span style="font-family: monospace;">${invoiceNumber}</span></div>
        <div class="summary-row"><span>Earnings Period</span><span>${period}</span></div>
        <div class="summary-row"><span>Gross Earnings</span><span>$${parseFloat(totalAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span></div>
        <div class="summary-row"><span>Withholding Tax</span><span style="color:#dc2626;">-$${parseFloat(withholdingTax).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span></div>
        <div class="summary-row total"><span>Net Payable</span><span>$${parseFloat(netAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span></div>
      </div>
      <p style="font-size: 14px; color: #6b7280;">
        Payment is typically processed between the <strong>25th–30th</strong> of each month.
        If you have any questions, please reach out to our support team.
      </p>
    </div>
    <div class="footer">
      <p style="margin: 0 0 6px;"><strong>Falcus Media Agency</strong></p>
      <p style="margin: 0;">support@falcusmediaagency.com</p>
      <p style="margin: 12px 0 0; font-size: 12px;">© ${year} Falcus Media Agency · All rights reserved</p>
    </div>
  </div>
</body>
</html>`;

  const text = `Hello ${creatorName},

Your earnings for ${period} have been processed.

Invoice: ${invoiceNumber}
Period: ${period}
Gross Earnings: $${parseFloat(totalAmount).toFixed(2)}
Withholding Tax: -$${parseFloat(withholdingTax).toFixed(2)}
Net Payable: $${parseFloat(netAmount).toFixed(2)}

Payment is typically processed between the 25th-30th of each month.

— Falcus Media Agency
support@falcusmediaagency.com`;

  const body = {
    from: FROM_EMAIL,
    to: [to],
    subject: `Your Earnings Invoice for ${period} — ${invoiceNumber}`,
    html,
    text,
  };

  // Attach PDF if available
  if (pdfBase64) {
    body.attachments = [
      {
        filename: `${invoiceNumber}.pdf`,
        content: pdfBase64,
      },
    ];
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend error sending invoice:", data);
      return {
        success: false,
        error: data.message || "Email delivery failed",
      };
    }

    console.log(`✅ Invoice email sent to ${to} (invoice #${invoiceNumber})`);
    return { success: true, emailId: data.id };
  } catch (err) {
    console.error("Invoice email send exception:", err);
    return { success: false, error: err.message };
  }
}
