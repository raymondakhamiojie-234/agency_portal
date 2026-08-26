import sql from "@/app/api/utils/sql";
import argon2 from "argon2";

export async function POST(request) {
  try {
    const { phoneNumber, otpCode, newPassword } = await request.json();

    if (!phoneNumber || !otpCode || !newPassword) {
      return Response.json(
        {
          error: "Phone number, OTP, and new password are required",
        },
        { status: 400 },
      );
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return Response.json(
        {
          error: "Password must be at least 8 characters long",
        },
        { status: 400 },
      );
    }

    // Normalize phone number
    const normalizedPhone = phoneNumber.replace(/[\s\-\(\)]/g, "");

    // Verify OTP is valid and verified
    const [otpRecord] = await sql`
      SELECT * FROM password_reset_otp
      WHERE phone_number = ${normalizedPhone}
      AND otp_code = ${otpCode}
      AND verified = true
      AND expires_at > now()
      ORDER BY created_at DESC
      LIMIT 1
    `;

    if (!otpRecord) {
      return Response.json(
        {
          error: "Invalid or expired OTP. Please request a new one.",
        },
        { status: 400 },
      );
    }

    // Hash the new password
    const hashedPassword = await argon2.hash(newPassword);

    // Update password in auth_accounts table
    const result = await sql`
      UPDATE auth_accounts
      SET password = ${hashedPassword}
      WHERE "userId" = ${otpRecord.user_id}
      AND type = 'credentials'
      AND provider = 'credentials'
    `;

    if (result.length === 0) {
      return Response.json(
        {
          error: "Unable to update password. Please contact support.",
        },
        { status: 400 },
      );
    }

    // Delete all OTPs for this phone number
    await sql`
      DELETE FROM password_reset_otp 
      WHERE phone_number = ${normalizedPhone}
    `;

    // Delete all existing sessions to force re-login
    await sql`
      DELETE FROM auth_sessions
      WHERE "userId" = ${otpRecord.user_id}
    `;

    return Response.json(
      {
        message:
          "Password reset successfully. Please log in with your new password.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    return Response.json(
      { error: "Failed to reset password" },
      { status: 500 },
    );
  }
}
