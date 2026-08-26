import {
  sendEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "@/app/api/utils/email";

/**
 * Test Email Endpoint
 *
 * This endpoint allows you to test your email configuration.
 *
 * Usage:
 * POST /api/test-email
 * Body: {
 *   "to": "recipient@example.com",
 *   "type": "test" | "password-reset" | "verification" | "welcome"
 * }
 */

export async function POST(request) {
  try {
    const { to, type = "test" } = await request.json();

    if (!to) {
      return Response.json(
        { error: "Recipient email address is required" },
        { status: 400 },
      );
    }

    // Check if RESEND_API_KEY is configured
    if (!process.env.RESEND_API_KEY) {
      return Response.json(
        {
          error: "RESEND_API_KEY environment variable is not configured",
          setup: {
            step1: "Sign up at https://resend.com",
            step2: "Get your API key from the dashboard",
            step3: "Add RESEND_API_KEY to your environment variables",
            step4:
              "Add FROM_EMAIL (e.g., noreply@yourdomain.com) to your environment variables",
          },
        },
        { status: 500 },
      );
    }

    let result;

    switch (type) {
      case "password-reset":
        result = await sendPasswordResetEmail(to, "test-token-123");
        break;

      case "verification":
        result = await sendVerificationEmail(to, "test-token-456");
        break;

      case "welcome":
        result = await sendWelcomeEmail(to, "Test User");
        break;

      case "test":
      default:
        result = await sendEmail({
          to,
          subject: "✅ Test Email from Falcus Media Agency",
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; }
                  .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; }
                  .success-badge { background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin: 20px 0; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1 style="margin: 0;">🎉 Email Test Successful!</h1>
                  </div>
                  <div class="content">
                    <div class="success-badge">✅ Your email service is working!</div>
                    <h2>Congratulations!</h2>
                    <p>Your Resend integration is properly configured and working perfectly.</p>
                    <p><strong>Configuration Details:</strong></p>
                    <ul>
                      <li>✅ RESEND_API_KEY: Configured</li>
                      <li>✅ FROM_EMAIL: ${process.env.FROM_EMAIL || process.env.EMAIL_FROM || "noreply@falcusmediaagency.com"}</li>
                      <li>✅ Email Delivery: Working</li>
                    </ul>
                    <p style="color: #10b981; font-weight: bold;">You can now send emails to your users!</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
                    <p style="font-size: 14px; color: #6b7280;">
                      <strong>Test Details:</strong><br/>
                      Sent: ${new Date().toLocaleString()}<br/>
                      Environment: ${process.env.NODE_ENV || "development"}
                    </p>
                  </div>
                </div>
              </body>
            </html>
          `,
          text: `
Email Test Successful!

Congratulations! Your Resend integration is properly configured and working perfectly.

Configuration Details:
- RESEND_API_KEY: Configured
- FROM_EMAIL: ${process.env.FROM_EMAIL || process.env.EMAIL_FROM || "noreply@falcusmediaagency.com"}
- Email Delivery: Working

You can now send emails to your users!

Test Details:
Sent: ${new Date().toLocaleString()}
Environment: ${process.env.NODE_ENV || "development"}
          `,
        });
        break;
    }

    if (result.success) {
      return Response.json({
        success: true,
        message: `Test email sent successfully to ${to}`,
        emailId: result.data?.id,
        type,
        config: {
          apiKey: process.env.RESEND_API_KEY
            ? "✅ Configured"
            : "❌ Not configured",
          fromEmail:
            process.env.FROM_EMAIL ||
            process.env.EMAIL_FROM ||
            "noreply@falcusmediaagency.com",
        },
      });
    } else {
      return Response.json(
        {
          error: "Failed to send test email",
          details: result.error,
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Test email error:", error);
    return Response.json(
      {
        error: "Failed to send test email",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  // Return configuration status
  const hasApiKey = !!process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.FROM_EMAIL ||
    process.env.EMAIL_FROM ||
    "noreply@falcusmediaagency.com";

  return Response.json({
    configured: hasApiKey,
    config: {
      apiKey: hasApiKey ? "✅ Configured" : "❌ Not configured",
      fromEmail: hasApiKey ? fromEmail : "Not configured",
    },
    instructions: hasApiKey
      ? null
      : {
          step1: "Sign up at https://resend.com",
          step2: "Get your API key from the dashboard",
          step3: "Add RESEND_API_KEY to your environment variables",
          step4:
            "Add FROM_EMAIL (e.g., noreply@yourdomain.com) to your environment variables",
          step5: "Restart your application",
          step6:
            'Test by sending a POST request to this endpoint with { "to": "your@email.com" }',
        },
  });
}
