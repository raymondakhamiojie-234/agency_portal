import sql from "@/app/api/utils/sql";
import { verify } from "argon2";
import { randomBytes } from "crypto";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return Response.json(
        { error: "Username and password are required" },
        { status: 400 },
      );
    }

    // Find admin user
    const users = await sql`
      SELECT id, username, email, password, full_name, role, is_active
      FROM admin_users
      WHERE username = ${username} OR email = ${username}
    `;

    if (users.length === 0) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const admin = users[0];

    if (!admin.is_active) {
      return Response.json({ error: "Account is inactive" }, { status: 403 });
    }

    // Verify password
    const validPassword = await verify(admin.password, password);

    if (!validPassword) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Update last login
    await sql`
      UPDATE admin_users
      SET last_login = NOW(), updated_at = NOW()
      WHERE id = ${admin.id}
    `;

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
    console.error("Admin login error:", error);
    return Response.json({ error: "Failed to login" }, { status: 500 });
  }
}
