import sql from "@/app/api/utils/sql";
import { sendVerificationEmail } from "@/app/api/utils/email";
import crypto from "crypto";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user exists
    const users = await sql`
      SELECT id, email, name, "emailVerified"
      FROM auth_users
      WHERE email = ${email}
      LIMIT 1
    `;

    // Always return success to prevent email enumeration
    if (users.length === 0) {
      return Response.json({
        message:
          "If an account exists with this email and is not verified, a verification email has been sent.",
      });
    }

    const user = users[0];

    // Check if already verified
    if (user.emailVerified) {
      return Response.json({
        message: "Email is already verified",
      });
    }

    // Delete any existing verification tokens for this email
    await sql`
      DELETE FROM auth_verification_token
      WHERE identifier = ${user.email}
    `;

    // Generate new verification token
    const token = crypto.randomBytes(32).toString("hex");

    // Token expires in 24 hours
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Store verification token
    await sql`
      INSERT INTO auth_verification_token (identifier, token, expires)
      VALUES (${user.email}, ${token}, ${expiresAt.toISOString()})
    `;

    // Send verification email
    await sendVerificationEmail(user.email, token);

    return Response.json({
      message:
        "If an account exists with this email and is not verified, a verification email has been sent.",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
