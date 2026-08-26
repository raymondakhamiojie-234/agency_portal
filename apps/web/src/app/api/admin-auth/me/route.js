import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const cookies = request.headers.get("cookie") || "";
    const sessionToken = cookies
      .split(";")
      .find((c) => c.trim().startsWith("admin_session="))
      ?.split("=")[1];

    if (!sessionToken) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get admin from session
    const sessions = await sql`
      SELECT 
        s.admin_id,
        s.expires_at,
        a.username,
        a.email,
        a.full_name,
        a.role
      FROM admin_sessions s
      JOIN admin_users a ON a.id = s.admin_id
      WHERE s.session_token = ${sessionToken}
        AND s.expires_at > NOW()
        AND a.is_active = true
    `;

    if (sessions.length === 0) {
      return Response.json(
        { error: "Invalid or expired session" },
        { status: 401 },
      );
    }

    const session = sessions[0];

    return Response.json({
      admin: {
        id: session.admin_id,
        username: session.username,
        email: session.email,
        full_name: session.full_name,
        role: session.role,
      },
    });
  } catch (error) {
    console.error("Get admin error:", error);
    return Response.json(
      { error: "Failed to get admin info" },
      { status: 500 },
    );
  }
}
