import sql from "@/app/api/utils/sql";
import { sendPasswordResetEmail } from "@/app/api/utils/email";
import crypto from "crypto";

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
      WHERE email = ${email}
      LIMIT 1
    `;

    // Always return success to prevent email enumeration
    // This prevents attackers from knowing which emails are registered
    if (users.length === 0) {
      console.log(`Password reset requested for non-existent email: ${email}`);
      return Response.json({
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    const user = users[0];

    // Generate a secure random token
    const token = crypto.randomBytes(32).toString("hex");

    // Token expires in 1 hour
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Store the reset token
    await sql`
      INSERT INTO password_reset_tokens (user_id, token, expires_at)
      VALUES (${user.id}, ${token}, ${expiresAt.toISOString()})
    `;

    // Send password reset email
    const emailResult = await sendPasswordResetEmail(user.email, token);

    // Log email sending status
    if (!emailResult.success) {
      console.error(
        `Failed to send password reset email to ${user.email}:`,
        emailResult.error,
      );
      console.error(
        "Please ensure RESEND_API_KEY and FROM_EMAIL are configured in environment variables",
      );
    } else {
      console.log(`Password reset email sent successfully to ${user.email}`);
    }

    return Response.json({
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
