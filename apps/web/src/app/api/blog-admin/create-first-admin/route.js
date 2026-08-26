import sql from "@/app/api/utils/sql";
import argon2 from "argon2";

export async function POST(request) {
  try {
    // Check if any admin users exist
    const existingAdmins = await sql`SELECT COUNT(*) as count FROM admin_users`;

    if (parseInt(existingAdmins[0]?.count) > 0) {
      return Response.json(
        { error: "Admin users already exist. Use normal signup." },
        { status: 400 },
      );
    }

    // Create default admin with password: Admin123!
    const hashedPassword = await argon2.hash("Admin123!");

    const result = await sql`
      INSERT INTO admin_users (username, email, password, full_name, role, is_active, created_at, updated_at)
      VALUES (
        'admin',
        'admin@falcusmedia.com',
        ${hashedPassword},
        'Default Admin',
        'admin',
        true,
        NOW(),
        NOW()
      )
      RETURNING id, username, email
    `;

    return Response.json({
      success: true,
      message: "First admin created successfully!",
      credentials: {
        username: "admin",
        password: "Admin123!",
        email: "admin@falcusmedia.com",
      },
      admin: result[0],
    });
  } catch (error) {
    console.error("Error creating first admin:", error);
    return Response.json(
      { error: "Failed to create first admin" },
      { status: 500 },
    );
  }
}
