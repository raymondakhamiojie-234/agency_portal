import sql from "@/app/api/utils/sql";
import { sendWelcomeEmail } from "@/app/api/utils/email";

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return Response.json(
        { error: "Verification token is required" },
        { status: 400 },
      );
    }

    // Find valid verification token
    const tokens = await sql`
      SELECT vt.*, au.id as user_id, au.email, au.name, au."emailVerified"
      FROM auth_verification_token vt
      JOIN auth_users au ON vt.identifier = au.email
      WHERE vt.token = ${token}
        AND vt.expires > now()
      LIMIT 1
    `;

    if (tokens.length === 0) {
      return Response.json(
        { error: "Invalid or expired verification token" },
        { status: 400 },
      );
    }

    const verificationToken = tokens[0];

    // Check if already verified
    if (verificationToken.emailVerified) {
      return Response.json({
        message: "Email is already verified",
      });
    }

    // Mark email as verified and delete the token
    await sql.transaction([
      sql`
        UPDATE auth_users
        SET "emailVerified" = now()
        WHERE email = ${verificationToken.identifier}
      `,
      sql`
        DELETE FROM auth_verification_token
        WHERE token = ${token}
      `,
    ]);

    // Send welcome email
    await sendWelcomeEmail(verificationToken.email, verificationToken.name);

    return Response.json({
      message: "Email verified successfully! Welcome aboard.",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
