/**
 * Email Utility for Falcus Media Agency
 *
 * This uses the Resend integration for sending emails.
 * Required environment variables:
 * - RESEND_API_KEY: Your Resend API key
 * - FROM_EMAIL: The email address to send from (e.g., noreply@falcusmediaagency.com)
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL =
  process.env.FROM_EMAIL ||
  process.env.EMAIL_FROM ||
  "Falcus Media Agency <noreply@falcusmediaagency.com>";
const APP_URL =
  process.env.APP_URL ||
  process.env.NEXT_PUBLIC_CREATE_APP_URL ||
  "http://localhost:3000";

/**
 * Send an email using Resend
 */
export async function sendEmail({ to, subject, html, text }) {
  try {
    if (!RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY not configured. Email not sent.");
      console.log("\n=== EMAIL SERVICE NOT CONFIGURED ===");
      console.log("To send emails, you need to:");
      console.log("1. Sign up at https://resend.com");
      console.log("2. Get your API key from the dashboard");
      console.log("3. Add these environment variables:");
      console.log("   - RESEND_API_KEY=re_xxxxxxxxxxxx");
      console.log("   - FROM_EMAIL=noreply@yourdomain.com");
      console.log("====================================\n");

      // In development, log the email content
      console.log("📧 Email would be sent to:", to);
      console.log("Subject:", subject);
      return { success: false, error: "Email service not configured" };
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Failed to send email:", data);
      return { success: false, error: data.message || "Failed to send email" };
    }

    console.log("✅ Email sent successfully to:", to);
    return { success: true, data };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Common email styles for Falcus Media Agency
 */
const EMAIL_STYLES = `
  body { 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6; 
    color: #1f2937;
    margin: 0;
    padding: 0;
    background-color: #f9fafb;
  }
  .email-wrapper {
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
  }
  .header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 40px 30px;
    text-align: center;
  }
  .header h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
  }
  .content {
    padding: 40px 30px;
  }
  .button {
    display: inline-block;
    padding: 14px 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #ffffff !important;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    margin: 24px 0;
    box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
  }
  .button:hover {
    box-shadow: 0 6px 8px rgba(102, 126, 234, 0.4);
  }
  .footer {
    background-color: #f9fafb;
    padding: 30px;
    text-align: center;
    font-size: 14px;
    color: #6b7280;
    border-top: 1px solid #e5e7eb;
  }
  .info-box {
    background-color: #f0f9ff;
    border-left: 4px solid #667eea;
    padding: 16px;
    margin: 20px 0;
    border-radius: 4px;
  }
  .warning-box {
    background-color: #fef3c7;
    border-left: 4px solid #f59e0b;
    padding: 16px;
    margin: 20px 0;
    border-radius: 4px;
  }
`;

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email, token) {
  const resetUrl = `${APP_URL}/account/reset-password?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${EMAIL_STYLES}</style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="header">
            <h1>🔐 Password Reset</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Falcus Media Agency</p>
          </div>
          <div class="content">
            <p style="font-size: 16px; margin-bottom: 24px;">Hello,</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset My Password</a>
            </div>
            <div class="info-box">
              <p style="margin: 0; font-size: 14px;"><strong>Or copy this link:</strong></p>
              <p style="margin: 8px 0 0 0; word-break: break-all; font-size: 13px; color: #667eea;">${resetUrl}</p>
            </div>
            <div class="warning-box">
              <p style="margin: 0; font-size: 14px;"><strong>⚠️ Security Notice:</strong></p>
              <p style="margin: 8px 0 0 0; font-size: 14px;">This link will expire in <strong>1 hour</strong>. If you didn't request this, you can safely ignore this email.</p>
            </div>
          </div>
          <div class="footer">
            <p style="margin: 0 0 8px 0;"><strong>Falcus Media Agency</strong></p>
            <p style="margin: 0;">© ${new Date().getFullYear()} All rights reserved.</p>
            <p style="margin: 16px 0 0 0; font-size: 12px;">This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Password Reset Request - Falcus Media Agency

Hello,

We received a request to reset your password. Click the link below to create a new password:

${resetUrl}

This link will expire in 1 hour.

If you didn't request this, you can safely ignore this email.

---
Falcus Media Agency
© ${new Date().getFullYear()} All rights reserved.
  `;

  return sendEmail({
    to: email,
    subject: "Reset Your Password - Falcus Media Agency",
    html,
    text,
  });
}

/**
 * Send email verification email
 */
export async function sendVerificationEmail(email, token) {
  const verifyUrl = `${APP_URL}/account/verify-email?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${EMAIL_STYLES}</style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="header">
            <h1>✉️ Verify Your Email</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Falcus Media Agency</p>
          </div>
          <div class="content">
            <p style="font-size: 16px; margin-bottom: 24px;">Welcome!</p>
            <p>Thank you for signing up with Falcus Media Agency. Please verify your email address by clicking the button below:</p>
            <div style="text-align: center;">
              <a href="${verifyUrl}" class="button">Verify My Email</a>
            </div>
            <div class="info-box">
              <p style="margin: 0; font-size: 14px;"><strong>Or copy this link:</strong></p>
              <p style="margin: 8px 0 0 0; word-break: break-all; font-size: 13px; color: #667eea;">${verifyUrl}</p>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">This link will expire in <strong>24 hours</strong>.</p>
          </div>
          <div class="footer">
            <p style="margin: 0 0 8px 0;"><strong>Falcus Media Agency</strong></p>
            <p style="margin: 0;">© ${new Date().getFullYear()} All rights reserved.</p>
            <p style="margin: 16px 0 0 0; font-size: 12px;">This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Verify Your Email Address - Falcus Media Agency

Welcome!

Thank you for signing up with Falcus Media Agency. Please verify your email address by clicking the link below:

${verifyUrl}

This link will expire in 24 hours.

---
Falcus Media Agency
© ${new Date().getFullYear()} All rights reserved.
  `;

  return sendEmail({
    to: email,
    subject: "Verify Your Email - Falcus Media Agency",
    html,
    text,
  });
}

/**
 * Send welcome email after verification
 */
export async function sendWelcomeEmail(email, name) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${EMAIL_STYLES}</style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="header">
            <h1>🎉 Welcome to Falcus!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your account is ready</p>
          </div>
          <div class="content">
            <p style="font-size: 16px; margin-bottom: 24px;">Hello ${name || "Creator"}!</p>
            <p>Your email has been verified successfully. Welcome to Falcus Media Agency!</p>
            <p>You can now access all features of your creator portal:</p>
            <ul style="line-height: 2; color: #374151;">
              <li>📊 Track your earnings and analytics</li>
              <li>💰 Request advance payouts</li>
              <li>📝 Manage your contracts</li>
              <li>🎯 Access exclusive services</li>
            </ul>
            <div style="text-align: center;">
              <a href="${APP_URL}/portal/dashboard" class="button">Go to Dashboard</a>
            </div>
          </div>
          <div class="footer">
            <p style="margin: 0 0 8px 0;"><strong>Falcus Media Agency</strong></p>
            <p style="margin: 0;">© ${new Date().getFullYear()} All rights reserved.</p>
            <p style="margin: 16px 0 0 0; font-size: 12px;">Need help? Contact us at support@falcusmediaagency.com</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Welcome to Falcus Media Agency!

Hello ${name || "Creator"}!

Your email has been verified successfully. Welcome to Falcus Media Agency!

You can now access all features of your creator portal:
- Track your earnings and analytics
- Request advance payouts
- Manage your contracts
- Access exclusive services

Visit your dashboard: ${APP_URL}/portal/dashboard

---
Falcus Media Agency
© ${new Date().getFullYear()} All rights reserved.
Need help? Contact us at support@falcusmediaagency.com
  `;

  return sendEmail({
    to: email,
    subject: "Welcome to Falcus Media Agency! 🎉",
    html,
    text,
  });
}

/**
 * Send earnings notification email to a creator when new earnings are posted
 * @param {string} email - Creator's email address
 * @param {string} name - Creator's full name
 * @param {Array} earnings - Array of { platform, amount, earning_date, withholding_tax }
 */
export async function sendEarningsNotificationEmail(email, name, earnings) {
  try {
    const totalAmount = earnings.reduce(
      (sum, e) => sum + parseFloat(e.amount || 0),
      0,
    );
    const totalTax = earnings.reduce(
      (sum, e) => sum + parseFloat(e.withholding_tax || 0),
      0,
    );
    const netAmount = totalAmount - totalTax;

    const tableRows = earnings
      .map(
        (e) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#374151;">${e.platform || "N/A"}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#374151;">
            ${new Date(e.earning_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right;color:#059669;font-weight:600;">
            $${parseFloat(e.amount || 0).toFixed(2)}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right;color:#dc2626;">
            $${parseFloat(e.withholding_tax || 0).toFixed(2)}
          </td>
        </tr>`,
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${EMAIL_STYLES}</style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="header">
              <h1>💰 Earnings Updated</h1>
              <p style="margin:10px 0 0 0;opacity:0.9;">Falcus Media Agency</p>
            </div>
            <div class="content">
              <p style="font-size:16px;margin-bottom:8px;">Hello ${name || "Creator"},</p>
              <p style="color:#374151;margin-bottom:24px;">
                Great news! Your latest earnings have been posted to your account. Here's a breakdown:
              </p>

              <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:24px;">
                <thead>
                  <tr style="background-color:#f9fafb;">
                    <th style="padding:12px;text-align:left;font-size:13px;color:#6b7280;font-weight:600;border-bottom:1px solid #e5e7eb;">Platform</th>
                    <th style="padding:12px;text-align:left;font-size:13px;color:#6b7280;font-weight:600;border-bottom:1px solid #e5e7eb;">Earning Date</th>
                    <th style="padding:12px;text-align:right;font-size:13px;color:#6b7280;font-weight:600;border-bottom:1px solid #e5e7eb;">Amount</th>
                    <th style="padding:12px;text-align:right;font-size:13px;color:#6b7280;font-weight:600;border-bottom:1px solid #e5e7eb;">Tax Withheld</th>
                  </tr>
                </thead>
                <tbody>${tableRows}</tbody>
              </table>

              <div style="background:linear-gradient(135deg,#f0f9ff 0%,#e8f5e9 100%);border:1px solid #bbdefb;border-radius:10px;padding:20px;margin-bottom:24px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
                  <span style="color:#374151;font-weight:500;">Gross Earnings</span>
                  <span style="color:#059669;font-weight:700;font-size:16px;">$${totalAmount.toFixed(2)}</span>
                </div>
                <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
                  <span style="color:#374151;font-weight:500;">Withholding Tax</span>
                  <span style="color:#dc2626;font-weight:600;">-$${totalTax.toFixed(2)}</span>
                </div>
                <div style="border-top:1px solid #bbdefb;padding-top:10px;display:flex;justify-content:space-between;">
                  <span style="color:#1f2937;font-weight:700;font-size:16px;">Net Earnings</span>
                  <span style="color:#059669;font-weight:700;font-size:20px;">$${netAmount.toFixed(2)}</span>
                </div>
              </div>

              <div class="info-box">
                <p style="margin:0;font-size:14px;color:#374151;">
                  💡 <strong>What's next?</strong> Log in to your portal to view your full earnings history, check payout status, or request an advance.
                </p>
              </div>

              <div style="text-align:center;margin-top:24px;">
                <a href="${APP_URL}/portal/finance" class="button">View My Earnings</a>
              </div>
            </div>
            <div class="footer">
              <p style="margin:0 0 8px 0;"><strong>Falcus Media Agency</strong></p>
              <p style="margin:0;">© ${new Date().getFullYear()} All rights reserved.</p>
              <p style="margin:16px 0 0 0;font-size:12px;">Need help? Contact us at support@falcusmediaagency.com</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
Earnings Updated - Falcus Media Agency

Hello ${name || "Creator"},

Your latest earnings have been posted to your account.

  Gross Earnings:   $${totalAmount.toFixed(2)}
  Withholding Tax:  -$${totalTax.toFixed(2)}
  Net Earnings:     $${netAmount.toFixed(2)}

Log in to view your full earnings history: ${APP_URL}/portal/finance

---
Falcus Media Agency © ${new Date().getFullYear()} All rights reserved.
    `;

    return sendEmail({
      to: email,
      subject: `💰 Your Earnings Have Been Posted - Falcus Media Agency`,
      html,
      text,
    });
  } catch (error) {
    console.error("❌ Error sending earnings notification email:", error);
    return { success: false, error: error.message };
  }
}
