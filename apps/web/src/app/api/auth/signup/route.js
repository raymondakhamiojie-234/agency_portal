import sql from "@/app/api/utils/sql";
import { hash } from "argon2";
import crypto from "crypto";
import { sendVerificationEmail } from "@/app/api/utils/email";
import { validateReferralCode } from "@/app/api/utils/partner-auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, name, referralCode } = body;

    console.log("📝 Signup request for:", email);
    if (referralCode) {
      console.log("🔗 Referral code provided:", referralCode);
    }

    // Validate required fields
    if (!email || !password) {
      console.log("❌ Missing email or password");
      return Response.json(
        { error: "Email and password are required" },
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

    // Check if user already exists
    const existingUsers = await sql`
      SELECT id FROM auth_users WHERE email = ${email} LIMIT 1
    `;

    if (existingUsers.length > 0) {
      console.log("❌ Email already exists");
      return Response.json(
        { error: "This email is already registered. Try signing in instead." },
        { status: 400 },
      );
    }

    console.log("✅ Email available, creating user...");

    // Validate referral code if provided
    let referringPartner = null;
    if (referralCode) {
      referringPartner = await validateReferralCode(referralCode);
      if (!referringPartner) {
        console.log("⚠️ Invalid referral code:", referralCode);
        // Don't fail signup for invalid referral code, just warn
        console.log("⚠️ Proceeding with signup without referral tracking");
      } else {
        console.log(
          "✅ Valid referral code from partner:",
          referringPartner.name,
        );
      }
    }

    // Hash the password
    const hashedPassword = await hash(password);

    // Create the user in auth_users table
    const newUsers = await sql`
      INSERT INTO auth_users (email, name, "emailVerified")
      VALUES (${email}, ${name || email}, NULL)
      RETURNING id, email, name, image
    `;

    const newUser = newUsers[0];
    console.log("✅ User created with ID:", newUser.id);

    // Create the credentials account entry
    await sql`
      INSERT INTO auth_accounts (
        "userId", 
        type, 
        provider, 
        "providerAccountId", 
        password
      )
      VALUES (
        ${newUser.id},
        'credentials',
        'credentials',
        ${newUser.id},
        ${hashedPassword}
      )
    `;

    console.log("✅ Credentials account created");

    // Track referral if valid referral code was used
    if (referringPartner) {
      try {
        await sql`
          INSERT INTO partner_referrals (
            partner_id,
            referred_user_email,
            referred_user_name,
            signup_date
          )
          VALUES (
            ${referringPartner.id},
            ${email},
            ${name || email},
            NOW()
          )
        `;

        // Update partner's total referrals count
        await sql`
          UPDATE partners
          SET total_referrals = total_referrals + 1
          WHERE id = ${referringPartner.id}
        `;

        console.log("✅ Referral tracked for partner:", referringPartner.name);
      } catch (referralError) {
        // Log but don't fail signup
        console.error("⚠️ Failed to track referral:", referralError);
      }
    }

    // Try to send verification email (optional - don't fail if it doesn't work)
    try {
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Store verification token
      await sql`
        INSERT INTO auth_verification_token (identifier, token, expires)
        VALUES (${newUser.email}, ${verificationToken}, ${tokenExpires.toISOString()})
      `;

      // Send verification email
      const emailResult = await sendVerificationEmail(
        newUser.email,
        verificationToken,
      );

      if (emailResult.success) {
        console.log("✅ Verification email sent");
      } else {
        console.log(
          "⚠️ Verification email not sent (email service not configured)",
        );
      }
    } catch (emailError) {
      // Log but don't fail signup
      console.log("⚠️ Email verification setup failed:", emailError.message);
    }

    // Create session for the new user
    const sessionToken = crypto.randomUUID();
    const expires = new Date();
    expires.setDate(expires.getDate() + 30); // 30 days from now

    await sql`
      INSERT INTO auth_sessions ("userId", expires, "sessionToken")
      VALUES (${newUser.id}, ${expires}, ${sessionToken})
    `;

    console.log("✅ Session created");

    // Return response with session cookie
    const response = Response.json({
      success: true,
      user: newUser,
      message: "Account created successfully!",
    });

    // Set the session cookie
    const cookieValue = `authjs.session-token=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Expires=${expires.toUTCString()}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
    response.headers.set("Set-Cookie", cookieValue);

    console.log("✅ Signup completed successfully");
    return response;
  } catch (error) {
    console.error("❌ Sign up error:", error);
    console.error("Error stack:", error.stack);

    // Provide more specific error messages
    if (error.message?.includes("duplicate key")) {
      return Response.json(
        { error: "This email is already registered. Try signing in instead." },
        { status: 400 },
      );
    }

    if (error.message?.includes("invalid input")) {
      return Response.json(
        {
          error: "Invalid input. Please check your information and try again.",
        },
        { status: 400 },
      );
    }

    return Response.json(
      { error: "Failed to create account. Please try again later." },
      { status: 500 },
    );
  }
}
