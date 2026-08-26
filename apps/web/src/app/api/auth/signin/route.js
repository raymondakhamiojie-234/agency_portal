import sql from "@/app/api/utils/sql";
import { verify } from "argon2";
import crypto from "crypto";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 400 },
      );
    }

    // Get user from database with lockout info
    const users = await sql`
      SELECT u.*, a.password
      FROM auth_users u
      JOIN auth_accounts a ON u.id = a."userId"
      WHERE u.email = ${email}
        AND a.provider = 'credentials'
      LIMIT 1
    `;

    if (users.length === 0) {
      // Log failed attempt even if user doesn't exist
      await sql`
        INSERT INTO login_attempts (email, success, attempted_at)
        VALUES (${email}, false, now())
      `;
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const user = users[0];

    // Check if account is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      const minutesLeft = Math.ceil(
        (new Date(user.locked_until) - new Date()) / 60000,
      );
      return Response.json(
        {
          error: `Account is locked due to too many failed login attempts. Please try again in ${minutesLeft} minutes or reset your password.`,
        },
        { status: 423 },
      );
    }

    // Verify password
    const isValid = await verify(user.password, password);
    if (!isValid) {
      // Increment failed login count
      const newFailedCount = (user.failed_login_count || 0) + 1;
      let lockUntil = null;

      // Lock account after 5 failed attempts for 15 minutes
      if (newFailedCount >= 5) {
        lockUntil = new Date(Date.now() + 15 * 60 * 1000);
      }

      await sql.transaction([
        sql`
          UPDATE auth_users
          SET failed_login_count = ${newFailedCount},
              locked_until = ${lockUntil ? lockUntil.toISOString() : null}
          WHERE id = ${user.id}
        `,
        sql`
          INSERT INTO login_attempts (email, success, attempted_at)
          VALUES (${email}, false, now())
        `,
      ]);

      if (lockUntil) {
        return Response.json(
          {
            error:
              "Too many failed login attempts. Your account has been locked for 15 minutes. You can reset your password to unlock it immediately.",
          },
          { status: 423 },
        );
      }

      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Successful login - reset failed login count and update last login
    await sql.transaction([
      sql`
        UPDATE auth_users
        SET failed_login_count = 0,
            locked_until = NULL,
            last_login = now()
        WHERE id = ${user.id}
      `,
      sql`
        INSERT INTO login_attempts (email, success, attempted_at)
        VALUES (${email}, true, now())
      `,
    ]);

    // Create session
    const sessionToken = crypto.randomUUID();
    const expires = new Date();
    expires.setDate(expires.getDate() + 30); // 30 days from now

    await sql`
      INSERT INTO auth_sessions ("userId", expires, "sessionToken")
      VALUES (${user.id}, ${expires}, ${sessionToken})
    `;

    // Return response with session cookie
    const response = Response.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        emailVerified: user.emailVerified,
      },
    });

    // Set the session cookie
    const cookieValue = `authjs.session-token=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Expires=${expires.toUTCString()}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
    response.headers.set("Set-Cookie", cookieValue);

    return response;
  } catch (error) {
    console.error("Sign in error:", error);
    return Response.json(
      { error: "Invalid email or password" },
      { status: 500 },
    );
  }
}
