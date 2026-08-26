import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    // Get the session token from cookies
    const cookieName = process.env.AUTH_URL?.startsWith("https")
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";

    const cookies = request.headers.get("cookie");
    let sessionToken = null;

    if (cookies) {
      const cookieArr = cookies.split(";");
      for (const cookie of cookieArr) {
        const [name, value] = cookie.trim().split("=");
        if (name === cookieName) {
          sessionToken = value;
          break;
        }
      }
    }

    // Delete session from database if exists
    if (sessionToken) {
      await sql`DELETE FROM auth_sessions WHERE "sessionToken" = ${sessionToken}`;
    }

    // Clear the session cookie
    const response = Response.json({ success: true });
    response.headers.set(
      "Set-Cookie",
      `${cookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${process.env.AUTH_URL?.startsWith("https") ? "; Secure" : ""}`,
    );

    return response;
  } catch (error) {
    console.error("Sign out error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
