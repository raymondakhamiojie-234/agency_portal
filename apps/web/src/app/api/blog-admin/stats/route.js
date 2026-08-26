import sql from "@/app/api/utils/sql";

async function getBlogAdminSession(request) {
  try {
    console.log("🔍 Checking blog admin session...");

    // Get cookies from request headers
    const cookieHeader = request.headers.get("cookie") || "";
    console.log("📦 Cookie header:", cookieHeader);

    // Parse cookies manually
    const cookies = {};
    cookieHeader.split(";").forEach((cookie) => {
      const [name, value] = cookie.trim().split("=");
      if (name && value) {
        cookies[name] = value;
      }
    });

    const sessionToken = cookies["blog_admin_session"];

    console.log(
      "🔑 Session token:",
      sessionToken ? sessionToken.substring(0, 10) + "..." : "NONE",
    );
    console.log("📋 Available cookies:", Object.keys(cookies).join(", "));

    if (!sessionToken) {
      console.log("❌ No session token found in cookies");
      return null;
    }

    const sessions = await sql`
      SELECT admin_sessions.*, admin_users.username, admin_users.email, admin_users.full_name
      FROM admin_sessions
      JOIN admin_users ON admin_sessions.admin_id = admin_users.id
      WHERE admin_sessions.session_token = ${sessionToken}
      AND admin_sessions.expires_at > NOW()
      AND admin_users.is_active = true
    `;

    if (sessions.length > 0) {
      console.log("✅ Valid session found for:", sessions[0].username);
      return sessions[0];
    } else {
      console.log("❌ No valid session found for token");
      return null;
    }
  } catch (error) {
    console.error("❌ Error checking blog admin session:", error);
    return null;
  }
}

export async function GET(request) {
  try {
    console.log("📊 Blog admin stats request received");

    const session = await getBlogAdminSession(request);

    if (!session) {
      console.log("❌ Unauthorized - No valid session");
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("✅ Fetching blog admin stats for:", session.username);

    // Total posts
    const totalPosts = await sql`SELECT COUNT(*) as count FROM blog_posts`;

    // Published posts
    const publishedPosts = await sql`
      SELECT COUNT(*) as count FROM blog_posts WHERE status = 'published'
    `;

    // Draft posts
    const draftPosts = await sql`
      SELECT COUNT(*) as count FROM blog_posts WHERE status = 'draft'
    `;

    // Total views
    const totalViews = await sql`
      SELECT COALESCE(SUM(view_count), 0) as total FROM blog_posts
    `;

    // Pending news
    const pendingNews = await sql`
      SELECT COUNT(*) as count FROM external_news_queue WHERE status = 'pending'
    `;

    // Pending news list
    const pendingNewsList = await sql`
      SELECT id, title, source_name, created_at
      FROM external_news_queue
      WHERE status = 'pending'
      ORDER BY created_at DESC
      LIMIT 10
    `;

    // Top performing posts
    const topPosts = await sql`
      SELECT id, title, slug, category, view_count
      FROM blog_posts
      WHERE status = 'published'
      ORDER BY view_count DESC
      LIMIT 10
    `;

    const response = {
      totalPosts: parseInt(totalPosts[0]?.count || 0),
      publishedPosts: parseInt(publishedPosts[0]?.count || 0),
      draftPosts: parseInt(draftPosts[0]?.count || 0),
      totalViews: parseInt(totalViews[0]?.total || 0),
      pendingNews: parseInt(pendingNews[0]?.count || 0),
      pendingNewsList,
      topPosts,
    };

    console.log("✅ Stats retrieved successfully");

    return Response.json(response);
  } catch (error) {
    console.error("❌ Error fetching blog admin stats:", error);
    console.error("Stack trace:", error.stack);
    return Response.json(
      {
        error: "Failed to fetch stats",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}
