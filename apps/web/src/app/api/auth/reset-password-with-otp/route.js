import sql from "@/app/api/utils/sql";
import argon2 from "argon2";

export async function POST(request) {
  try {
    const { email, otp, newPassword } = await request.json();

    if (!email || !otp || !newPassword) {
      return Response.json(
        { error: "Email, OTP, and new password are required" },
        { status: 400 },
      );
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return Response.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 },
      );
    }

    // Find user by email
    const users = await sql`
      SELECT id 
      FROM auth_users 
      WHERE LOWER(email) = LOWER(${email})
      LIMIT 1
    `;

    if (users.length === 0) {
      return Response.json({ error: "Invalid reset request" }, { status: 400 });
    }

    const user = users[0];

    // Verify OTP is valid and verified
    const otpRecords = await sql`
      SELECT * 
      FROM password_reset_otp 
      WHERE user_id = ${user.id}
        AND otp_code = ${otp}
        AND expires_at > NOW()
        AND verified = true
      ORDER BY created_at DESC
      LIMIT 1
    `;

    if (otpRecords.length === 0) {
      return Response.json(
        { error: "Invalid or expired OTP. Please request a new one." },
        { status: 400 },
      );
    }

    // Hash the new password
    const hashedPassword = await argon2.hash(newPassword);

    // Update password in auth_accounts table
    const updateResult = await sql`
      UPDATE auth_accounts
      SET password = ${hashedPassword}
      WHERE "userId" = ${user.id}
        AND type = 'credentials'
        AND provider = 'credentials'
      RETURNING id
    `;

    if (updateResult.length === 0) {
      return Response.json(
        { error: "Failed to update password. Please contact support." },
        { status: 500 },
      );
    }

    // Delete the used OTP
    await sql`
      DELETE FROM password_reset_otp 
      WHERE id = ${otpRecords[0].id}
    `;

    // Delete all other OTPs for this user
    await sql`
      DELETE FROM password_reset_otp 
      WHERE user_id = ${user.id}
    `;

    return Response.json({
      success: true,
      message:
        "Password reset successfully. You can now sign in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return Response.json(
      { error: "An error occurred. Please try again." },
      { status: 500 },
    );
  }
}
