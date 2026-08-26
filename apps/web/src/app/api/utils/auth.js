import sql from "@/app/api/utils/sql";

/**
 * Get the current authenticated user session from request
 * This function reads the session token from cookies and validates it
 *
 * @param {Request} request - The incoming request object
 * @returns {Promise<{user: {id: number, email: string, name: string, image: string, isAdmin: boolean}} | null>}
 */
export async function getSession(request) {
  try {
    // Get session token from cookies
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      if (key) acc[key] = value;
      return acc;
    }, {});

    const sessionToken = cookies["authjs.session-token"];

    if (!sessionToken) {
      return null;
    }

    // Get session from database
    const sessions = await sql`
      SELECT s."userId", s.expires, u.id, u.email, u.name, u.image, u.is_admin
      FROM auth_sessions s
      JOIN auth_users u ON s."userId" = u.id
      WHERE s."sessionToken" = ${sessionToken}
      AND s.expires > NOW()
      LIMIT 1
    `;

    if (sessions.length === 0) {
      return null;
    }

    const session = sessions[0];

    return {
      user: {
        id: session.id,
        email: session.email,
        name: session.name,
        image: session.image,
        isAdmin: session.is_admin,
      },
    };
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}

/**
 * Get the current authenticated admin session from request
 * This function reads the admin session token from cookies and validates it
 *
 * @param {Request} request - The incoming request object
 * @returns {Promise<{admin: {id: number, email: string, username: string, full_name: string, role: string}} | null>}
 */
export async function getAdminSession(request) {
  try {
    // Get admin session token from cookies
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      if (key) acc[key] = value;
      return acc;
    }, {});

    const sessionToken = cookies["admin_session"];

    if (!sessionToken) {
      return null;
    }

    // Get admin session from database
    const sessions = await sql`
      SELECT 
        s.admin_id,
        s.expires_at,
        a.username,
        a.email,
        a.full_name,
        a.role,
        a.is_active
      FROM admin_sessions s
      JOIN admin_users a ON s.admin_id = a.id
      WHERE s.session_token = ${sessionToken}
        AND s.expires_at > NOW()
        AND a.is_active = true
      LIMIT 1
    `;

    if (sessions.length === 0) {
      return null;
    }

    const session = sessions[0];

    return {
      admin: {
        id: session.admin_id,
        email: session.email,
        username: session.username,
        full_name: session.full_name,
        role: session.role,
      },
    };
  } catch (error) {
    console.error("Admin auth error:", error);
    return null;
  }
}
