import sql from "@/app/api/utils/sql";
import { hash } from "argon2";
import crypto from "crypto";
import {
  generateReferralCode,
  generateReferralLink,
} from "@/app/api/utils/partner-auth";
import { notifyNewPartner } from "@/app/api/utils/admin-notifications";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    console.log("👥 Partner signup request for:", email);

    // Validate required fields
    if (!name || !email || !password) {
      console.log("❌ Missing required fields");
      return Response.json(
        { error: "Name, email, and password are required" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("❌ Invalid email format");
      return Response.json(
        { error: "Please enter a valid email address" },
        { status: 400 },
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return Response.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 },
      );
    }

    // Check if partner already exists
    const existingPartners = await sql`
      SELECT id FROM partners WHERE email = ${email} LIMIT 1
    `;

    if (existingPartners.length > 0) {
      console.log("❌ Email already exists");
      return Response.json(
        { error: "This email is already registered as a partner" },
        { status: 400 },
      );
    }

    console.log("✅ Email available, creating partner...");

    // Generate referral code and link
    let referralCode = generateReferralCode(name);

    // Check if referral code already exists (rare case)
    let codeExists = await sql`
      SELECT id FROM partners WHERE referral_code = ${referralCode} LIMIT 1
    `;

    // If code exists, append a number
    let counter = 1;
    while (codeExists.length > 0) {
      referralCode = `${generateReferralCode(name)}${counter}`;
      codeExists = await sql`
        SELECT id FROM partners WHERE referral_code = ${referralCode} LIMIT 1
      `;
      counter++;
    }

    const referralLink = generateReferralLink(referralCode);

    // Hash the password
    const hashedPassword = await hash(password);

    // Create the partner
    const newPartners = await sql`
      INSERT INTO partners (
        name, 
        email, 
        password, 
        referral_code, 
        referral_link,
        created_at,
        updated_at
      )
      VALUES (
        ${name},
        ${email},
        ${hashedPassword},
        ${referralCode},
        ${referralLink},
        NOW(),
        NOW()
      )
      RETURNING id, name, email, referral_code, referral_link, total_referrals, created_at
    `;

    const newPartner = newPartners[0];
    console.log("✅ Partner created with ID:", newPartner.id);
    console.log("🔗 Referral code:", newPartner.referral_code);

    // Send admin notification about new partner
    try {
      await notifyNewPartner(newPartner.id, name, email);
    } catch (notifError) {
      console.error("Failed to send admin notification:", notifError);
      // Don't fail the request if notification fails
    }

    // Create session for the new partner
    const sessionToken = crypto.randomUUID();
    const expires = new Date();
    expires.setDate(expires.getDate() + 30); // 30 days from now

    await sql`
      INSERT INTO partner_sessions (partner_id, session_token, expires)
      VALUES (${newPartner.id}, ${sessionToken}, ${expires})
    `;

    console.log("✅ Session created");

    // Return response with session cookie
    const response = Response.json({
      success: true,
      partner: newPartner,
      message: "Partner account created successfully!",
    });

    // Set the session cookie
    const cookieValue = `partner.session-token=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Expires=${expires.toUTCString()}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
    response.headers.set("Set-Cookie", cookieValue);

    console.log("✅ Partner signup completed successfully");
    return response;
  } catch (error) {
    console.error("❌ Partner signup error:", error);
    console.error("Error stack:", error.stack);

    // Provide specific error messages
    if (error.message?.includes("duplicate key")) {
      return Response.json(
        { error: "This email is already registered as a partner" },
        { status: 400 },
      );
    }

    return Response.json(
      { error: "Failed to create partner account. Please try again later." },
      { status: 500 },
    );
  }
}
