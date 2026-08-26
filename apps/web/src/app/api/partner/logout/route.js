import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    // Get session token from cookie
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = value;
        return acc;
      }, {});

      const sessionToken = cookies["partner.session-token"];

      if (sessionToken) {
        // Delete session from database
        await sql`
          DELETE FROM partner_sessions
          WHERE session_token = ${sessionToken}
        `;
      }
    }

    // Clear the session cookie
    const response = Response.json({ success: true });
    response.headers.set(
      "Set-Cookie",
      `partner.session-token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
    );

    return response;
  } catch (error) {
    console.error("Partner logout error:", error);
    return Response.json({ success: true }, { status: 200 });
  }
}
