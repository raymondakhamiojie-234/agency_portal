import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { phoneNumber, otpCode } = await request.json();

    if (!phoneNumber || !otpCode) {
      return Response.json(
        { error: "Phone number and OTP are required" },
        { status: 400 },
      );
    }

    // Normalize phone number
    const normalizedPhone = phoneNumber.replace(/[\s\-\(\)]/g, "");

    // Find the OTP record
    const [otpRecord] = await sql`
      SELECT * FROM password_reset_otp
      WHERE phone_number = ${normalizedPhone}
      AND otp_code = ${otpCode}
      AND verified = false
      AND expires_at > now()
      ORDER BY created_at DESC
      LIMIT 1
    `;

    if (!otpRecord) {
      return Response.json(
        { error: "Invalid or expired OTP" },
        { status: 400 },
      );
    }

    // Mark OTP as verified
    await sql`
      UPDATE password_reset_otp
      SET verified = true
      WHERE id = ${otpRecord.id}
    `;

    return Response.json(
      {
        message: "OTP verified successfully",
        verified: true,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return Response.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
}
