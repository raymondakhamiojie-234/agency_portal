import sql from "@/app/api/utils/sql";
import { hash } from "argon2";
import { randomBytes } from "crypto";

export async function POST(request) {
  try {
    const { username, email, password, full_name } = await request.json();

    // Validation
    if (!username || !email || !password) {
      return Response.json(
        { error: "Username, email, and password are required" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return Response.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 },
      );
    }

    // Check if username or email already exists
    const existingUser = await sql`
      SELECT id FROM admin_users 
      WHERE username = ${username} OR email = ${email}
    `;

    if (existingUser.length > 0) {
      return Response.json(
        { error: "Username or email already exists" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await hash(password);

    // Create admin user
    const result = await sql`
      INSERT INTO admin_users (username, email, password, full_name)
      VALUES (${username}, ${email}, ${hashedPassword}, ${full_name || null})
      RETURNING id, username, email, full_name, role, created_at
    `;

    const admin = result[0];

    // Create session
    const sessionToken = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await sql`
      INSERT INTO admin_sessions (admin_id, session_token, expires_at)
      VALUES (${admin.id}, ${sessionToken}, ${expiresAt})
    `;

    // Set session cookie
    const response = Response.json({
      success: true,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role,
      },
    });

    response.headers.set(
      "Set-Cookie",
      `admin_session=${sessionToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`,
    );

    return response;
  } catch (error) {
    console.error("Admin signup error:", error);
    return Response.json(
      { error: "Failed to create admin account" },
      { status: 500 },
    );
  }
}
