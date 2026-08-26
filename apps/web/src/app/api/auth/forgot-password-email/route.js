import sql from "@/app/api/utils/sql";
import { sendEmail } from "@/app/api/utils/send-email";

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user exists
    const users = await sql`
      SELECT id, email, name 
      FROM auth_users 
      WHERE LOWER(email) = LOWER(${email})
      LIMIT 1
    `;

    if (users.length === 0) {
      // For security, don't reveal if email exists
      return Response.json({
        success: true,
        message:
          "If an account exists with this email, you will receive an OTP shortly.",
      });
    }

    const user = users[0];

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing OTP for this user
    await sql`
      DELETE FROM password_reset_otp 
      WHERE user_id = ${user.id}
    `;

    // Store OTP in database
    await sql`
      INSERT INTO password_reset_otp (
        user_id,
        phone_number,
        otp_code,
        expires_at,
        verified
      ) VALUES (
        ${user.id},
        ${email},
        ${otp},
        ${expiresAt},
        false
      )
    `;

    // Send OTP via email
    try {
      // Check if RESEND_API_KEY is configured
      if (!process.env.RESEND_API_KEY) {
        console.error("❌ RESEND_API_KEY not configured!");
        console.log("\n=== EMAIL SERVICE NOT CONFIGURED ===");
        console.log("To send emails, you need to:");
        console.log("1. Sign up at https://resend.com");
        console.log("2. Get your API key from the dashboard");
        console.log("3. Add RESEND_API_KEY to your environment variables");
        console.log("====================================\n");

        return Response.json(
          {
            error: "Email service is not configured. Please contact support.",
            hint: "Administrator: Add RESEND_API_KEY environment variable",
          },
          { status: 500 },
        );
      }

      await sendEmail({
        to: email,
        from: process.env.EMAIL_FROM || "noreply@falcusmediaagency.com",
        subject: "Password Reset OTP - Falcus Media Agency",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                .otp-box { background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
                .otp-code { font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace; }
                .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
                .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0;">🔐 Password Reset Request</h1>
                </div>
                <div class="content">
                  <p>Hello ${user.name || "User"},</p>
                  
                  <p>We received a request to reset your password. Use the OTP code below to continue:</p>
                  
                  <div class="otp-box">
                    <p style="margin: 0; font-size: 14px; color: #6b7280;">Your OTP Code</p>
                    <div class="otp-code">${otp}</div>
                    <p style="margin: 10px 0 0 0; font-size: 12px; color: #6b7280;">Valid for 10 minutes</p>
                  </div>
                  
                  <div class="warning">
                    <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
                  </div>
                  
                  <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
                    This code will expire in <strong>10 minutes</strong>. If you need a new code, you can request another one from the password reset page.
                  </p>
                </div>
                <div class="footer">
                  <p>© ${new Date().getFullYear()} Falcus Media Agency. All rights reserved.</p>
                  <p>This is an automated email. Please do not reply to this message.</p>
                </div>
              </div>
            </body>
          </html>
        `,
        text: `
Password Reset Request

Hello ${user.name || "User"},

We received a request to reset your password. Use the OTP code below to continue:

Your OTP Code: ${otp}

This code is valid for 10 minutes.

If you didn't request this password reset, please ignore this email. Your password will remain unchanged.

© ${new Date().getFullYear()} Falcus Media Agency. All rights reserved.
        `,
      });

      console.log("✅ Password reset OTP sent successfully to:", email);
    } catch (emailError) {
      console.error("❌ Failed to send email:", emailError.message);

      return Response.json(
        {
          error:
            "Failed to send OTP email. Please try again later or contact support.",
        },
        { status: 500 },
      );
    }

    // Production mode - never return OTP in response
    return Response.json({
      success: true,
      message:
        "OTP has been sent to your email address. Please check your inbox.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return Response.json(
      { error: "An error occurred. Please try again." },
      { status: 500 },
    );
  }
}
