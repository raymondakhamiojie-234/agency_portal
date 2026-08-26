import sql from "@/app/api/utils/sql";
import { hash } from "argon2";

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return Response.json(
        { error: "Token and password are required" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return Response.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 },
      );
    }

    // Find valid token
    const tokens = await sql`
      SELECT prt.*, au.id as user_id, au.email
      FROM password_reset_tokens prt
      JOIN auth_users au ON prt.user_id = au.id
      WHERE prt.token = ${token}
        AND prt.used = false
        AND prt.expires_at > now()
      LIMIT 1
    `;

    if (tokens.length === 0) {
      return Response.json(
        { error: "Invalid or expired reset token" },
        { status: 400 },
      );
    }

    const resetToken = tokens[0];

    // Hash the new password
    const hashedPassword = await hash(password);

    // Update password and mark token as used in a transaction
    await sql.transaction([
      sql`
        UPDATE auth_accounts
        SET password = ${hashedPassword}
        WHERE "userId" = ${resetToken.user_id} AND provider = 'credentials'
      `,
      sql`
        UPDATE password_reset_tokens
        SET used = true
        WHERE token = ${token}
      `,
      sql`
        UPDATE auth_users
        SET failed_login_count = 0, locked_until = NULL
        WHERE id = ${resetToken.user_id}
      `,
    ]);

    // Invalidate all existing sessions for security
    await sql`
      DELETE FROM auth_sessions
      WHERE "userId" = ${resetToken.user_id}
    `;

    return Response.json({
      message:
        "Password reset successfully. Please sign in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
