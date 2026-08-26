import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const cookies = request.headers.get("cookie") || "";
    const sessionToken = cookies
      .split(";")
      .find((c) => c.trim().startsWith("admin_session="))
      ?.split("=")[1];

    if (sessionToken) {
      // Delete session from database
      await sql`
        DELETE FROM admin_sessions
        WHERE session_token = ${sessionToken}
      `;
    }

    // Clear cookie
    const response = Response.json({ success: true });
    response.headers.set(
      "Set-Cookie",
      "admin_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0",
    );

    return response;
  } catch (error) {
    console.error("Admin logout error:", error);
    return Response.json({ error: "Failed to logout" }, { status: 500 });
  }
}
