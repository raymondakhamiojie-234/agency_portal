import sql from "@/app/api/utils/sql";
import { verify } from "argon2";
import crypto from "crypto";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log("🔐 Partner login attempt for:", email);

    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Get partner from database
    const partners = await sql`
      SELECT *
      FROM partners
      WHERE email = ${email}
      LIMIT 1
    `;

    if (partners.length === 0) {
      console.log("❌ Partner not found");
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const partner = partners[0];

    // Verify password
    const isValid = await verify(partner.password, password);
    if (!isValid) {
      console.log("❌ Invalid password");
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    console.log("✅ Password verified");

    // Create session
    const sessionToken = crypto.randomUUID();
    const expires = new Date();
    expires.setDate(expires.getDate() + 30); // 30 days from now

    await sql`
      INSERT INTO partner_sessions (partner_id, session_token, expires)
      VALUES (${partner.id}, ${sessionToken}, ${expires})
    `;

    console.log("✅ Session created");

    // Remove password from response
    delete partner.password;

    // Return response with session cookie
    const response = Response.json({
      success: true,
      partner: partner,
    });

    // Set the session cookie
    const cookieValue = `partner.session-token=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Expires=${expires.toUTCString()}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
    response.headers.set("Set-Cookie", cookieValue);

    console.log("✅ Partner login successful");
    return response;
  } catch (error) {
    console.error("❌ Partner login error:", error);
    return Response.json(
      { error: "Invalid email or password" },
      { status: 500 },
    );
  }
}
