import sql from "@/app/api/utils/sql";
import argon2 from "argon2";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, email, password, full_name } = body;

    // Validate required fields
    if (!username || !email || !password) {
      return Response.json(
        { error: "Username, email, and password are required" },
        { status: 400 },
      );
    }

    // Check if username already exists
    const existingUser = await sql`
      SELECT id FROM admin_users 
      WHERE username = ${username} OR email = ${email}
    `;

    if (existingUser.length > 0) {
      return Response.json(
        { error: "Username or email already exists" },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await argon2.hash(password);

    // Create admin user
    const result = await sql`
      INSERT INTO admin_users (username, email, password, full_name, role, is_active, created_at, updated_at)
      VALUES (
        ${username},
        ${email},
        ${hashedPassword},
        ${full_name || username},
        'admin',
        true,
        NOW(),
        NOW()
      )
      RETURNING id, username, email, full_name
    `;

    return Response.json({
      success: true,
      admin: result[0],
      message: "Admin account created successfully. Please login.",
    });
  } catch (error) {
    console.error("Blog admin signup error:", error);
    return Response.json(
      { error: "Signup failed. Please try again." },
      { status: 500 },
    );
  }
}
