import sql from "@/app/api/utils/sql";
import argon2 from "argon2";
import crypto from "crypto";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    console.log("🔐 Blog Admin Login Attempt:", username);

    if (!username || !password) {
      console.log("❌ Missing credentials");
      return Response.json(
        { error: "Username and password are required" },
        { status: 400 },
      );
    }

    // Find admin user by username or email
    const users = await sql`
      SELECT * FROM admin_users 
      WHERE (username = ${username} OR email = ${username})
      AND is_active = true
    `;

    if (users.length === 0) {
      console.log("❌ No admin user found for:", username);
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const user = users[0];
    console.log("✅ Admin user found:", user.username, "| ID:", user.id);

    // Verify password
    try {
      const validPassword = await argon2.verify(user.password, password);

      if (!validPassword) {
        console.log("❌ Invalid password for:", user.username);
        return Response.json({ error: "Invalid credentials" }, { status: 401 });
      }
    } catch (err) {
      console.error("❌ Password verification error:", err);
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    console.log("✅ Password verified for:", user.username);

    // Delete old sessions for this user
    await sql`
      DELETE FROM admin_sessions 
      WHERE admin_id = ${user.id}
    `;
    console.log("🗑️ Cleared old sessions for:", user.username);

    // Create new session
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await sql`
      INSERT INTO admin_sessions (admin_id, session_token, expires_at, created_at)
      VALUES (${user.id}, ${sessionToken}, ${expiresAt.toISOString()}, NOW())
    `;

    console.log("✅ Session created:", sessionToken.substring(0, 10) + "...");

    // Update last login
    await sql`
      UPDATE admin_users 
      SET last_login = NOW() 
      WHERE id = ${user.id}
    `;

    // Set cookie
    const cookieAttributes = [
      `blog_admin_session=${sessionToken}`,
      "Path=/",
      "HttpOnly",
      "SameSite=Lax",
      `Max-Age=${7 * 24 * 60 * 60}`, // 7 days in seconds
    ];

    // Only add Secure in production HTTPS
    const isSecure =
      process.env.NODE_ENV === "production" &&
      process.env.APP_URL?.startsWith("https://");

    if (isSecure) {
      cookieAttributes.push("Secure");
    }

    const cookieString = cookieAttributes.join("; ");
    console.log("🍪 Setting cookie:", cookieString.substring(0, 50) + "...");

    const response = Response.json({
      success: true,
      admin: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
      },
      sessionToken: sessionToken.substring(0, 10) + "...", // For debugging
    });

    response.headers.set("Set-Cookie", cookieString);

    console.log(
      "🎉 Login successful for:",
      user.username,
      "| Session expires:",
      expiresAt.toISOString(),
    );
    return response;
  } catch (error) {
    console.error("❌ Blog admin login error:", error);
    console.error("Stack trace:", error.stack);
    return Response.json(
      {
        error: "Login failed",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}
