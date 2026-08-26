import sql from "@/app/api/utils/sql";

// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to send SMS via Twilio
async function sendSMS(phoneNumber, message) {
  // Check if Twilio credentials are configured
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !twilioPhoneNumber) {
    console.warn(
      "Twilio credentials not configured. OTP will only be logged to console.",
    );
    console.log(`SMS to ${phoneNumber}: ${message}`);
    return true;
  }

  try {
    // Send SMS via Twilio API
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: phoneNumber,
          From: twilioPhoneNumber,
          Body: message,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Twilio API error:", error);
      throw new Error("Failed to send SMS via Twilio");
    }

    const data = await response.json();
    console.log("SMS sent successfully via Twilio:", data.sid);
    return true;
  } catch (error) {
    console.error("Error sending SMS:", error);
    // Fallback to console log in development
    if (process.env.NODE_ENV === "development") {
      console.log(`SMS to ${phoneNumber}: ${message}`);
      return true;
    }
    throw error;
  }
}

export async function POST(request) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return Response.json(
        { error: "Phone number is required" },
        { status: 400 },
      );
    }

    // Normalize phone number (remove spaces, dashes, etc.)
    const normalizedPhone = phoneNumber.replace(/[\s\-\(\)]/g, "");

    // Find user by phone number through creator_profiles
    const [profile] = await sql`
      SELECT cp.*, au.id as user_id, au.email
      FROM creator_profiles cp
      JOIN auth_users au ON cp.user_id = au.id
      WHERE cp.phone_number = ${normalizedPhone}
      LIMIT 1
    `;

    if (!profile) {
      // Don't reveal if phone number exists or not for security
      return Response.json(
        {
          message:
            "If this phone number is registered, you will receive an OTP shortly.",
        },
        { status: 200 },
      );
    }

    // Delete any existing OTPs for this phone number
    await sql`
      DELETE FROM password_reset_otp 
      WHERE phone_number = ${normalizedPhone}
    `;

    // Generate OTP
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
    await sql`
      INSERT INTO password_reset_otp (phone_number, otp_code, user_id, expires_at)
      VALUES (${normalizedPhone}, ${otpCode}, ${profile.user_id}, ${expiresAt})
    `;

    // Send OTP via SMS
    const message = `Your password reset OTP is: ${otpCode}. Valid for 10 minutes.`;
    await sendSMS(normalizedPhone, message);

    return Response.json(
      {
        message: "OTP sent successfully to your phone number.",
        // In development, return the OTP for testing (remove in production!)
        ...(process.env.NODE_ENV === "development" && { otp: otpCode }),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sending OTP:", error);
    return Response.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
