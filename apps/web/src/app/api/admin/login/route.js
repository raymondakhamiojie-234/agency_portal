import sql from "@/app/api/utils/sql";
import { verify } from "argon2";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    console.log("Admin login attempt for:", email);

    // Check if user exists and is admin
    const users = await sql`
      SELECT id, email, is_admin FROM auth_users WHERE email = ${email}
    `;

    if (users.length === 0) {
      console.log("User not found:", email);
      return Response.json(
        { error: "No user found with that email address" },
        { status: 401 },
      );
    }

    const user = users[0];
    console.log("User found, is_admin:", user.is_admin);

    if (!user.is_admin) {
      console.log("User is not an admin:", email);
      return Response.json(
        { error: "This account does not have admin privileges" },
        { status: 401 },
      );
    }

    // Get password from auth_accounts
    const accounts = await sql`
      SELECT password FROM auth_accounts 
      WHERE "userId" = ${user.id} AND provider = 'credentials'
    `;

    if (accounts.length === 0 || !accounts[0].password) {
      console.log("No password found for user:", email);
      return Response.json(
        { error: "No password set for this account" },
        { status: 401 },
      );
    }

    // Verify password using argon2
    const isValid = await verify(accounts[0].password, password);

    if (!isValid) {
      console.log("Invalid password for user:", email);
      return Response.json({ error: "Incorrect password" }, { status: 401 });
    }

    // Password is valid, return success
    console.log("Admin login successful:", email);
    return Response.json({
      success: true,
      message: "Admin authentication successful",
    });
  } catch (err) {
    console.error("POST /api/admin/login error:", err);
    console.error("Error stack:", err.stack);

    // Return detailed error message
    return Response.json(
      {
        error: err.message || "Internal Server Error",
        details: err.stack,
      },
      { status: 500 },
    );
  }
}
