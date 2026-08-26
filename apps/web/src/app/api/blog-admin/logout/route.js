import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    console.log("🚪 Blog admin logout request");

    // Get cookies from request headers
    const cookieHeader = request.headers.get("cookie") || "";

    // Parse cookies manually
    const cookies = {};
    cookieHeader.split(";").forEach((cookie) => {
      const [name, value] = cookie.trim().split("=");
      if (name && value) {
        cookies[name] = value;
      }
    });

    const sessionToken = cookies["blog_admin_session"];

    if (sessionToken) {
      console.log("🗑️ Deleting session:", sessionToken.substring(0, 10) + "...");

      // Delete session from database
      await sql`
        DELETE FROM admin_sessions 
        WHERE session_token = ${sessionToken}
      `;

      console.log("✅ Session deleted successfully");
    } else {
      console.log("⚠️ No session token found to delete");
    }

    // Clear cookie
    const response = Response.json({ success: true });
    response.headers.set(
      "Set-Cookie",
      "blog_admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0",
    );

    console.log("✅ Logout successful");
    return response;
  } catch (error) {
    console.error("❌ Blog admin logout error:", error);
    return Response.json({ error: "Logout failed" }, { status: 500 });
  }
}
