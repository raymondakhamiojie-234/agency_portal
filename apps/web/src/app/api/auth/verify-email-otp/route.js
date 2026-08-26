import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return Response.json(
        { error: "Email and OTP are required" },
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
      return Response.json({ error: "Invalid OTP" }, { status: 400 });
    }

    const user = users[0];

    // Verify OTP
    const otpRecords = await sql`
      SELECT * 
      FROM password_reset_otp 
      WHERE user_id = ${user.id}
        AND otp_code = ${otp}
        AND expires_at > NOW()
        AND verified = false
      ORDER BY created_at DESC
      LIMIT 1
    `;

    if (otpRecords.length === 0) {
      return Response.json(
        { error: "Invalid or expired OTP" },
        { status: 400 },
      );
    }

    // Mark OTP as verified
    await sql`
      UPDATE password_reset_otp
      SET verified = true
      WHERE id = ${otpRecords[0].id}
    `;

    return Response.json({
      success: true,
      message: "OTP verified successfully. You can now reset your password.",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return Response.json(
      { error: "An error occurred. Please try again." },
      { status: 500 },
    );
  }
}
