import sql from "@/app/api/utils/sql";
import { getAdminSession } from "@/app/api/utils/auth";

// GET - Fetch admin dashboard statistics
export async function GET(request) {
  try {
    const session = await getAdminSession(request);
    if (!session || !session.admin?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get total creators
    const totalCreators = await sql`
      SELECT COUNT(*) as count FROM creator_profiles
    `;

    // Get total partners
    const totalPartners = await sql`
      SELECT COUNT(*) as count FROM partners
    `;

    // Get total earnings
    const totalEarnings = await sql`
      SELECT COALESCE(SUM(amount), 0) as total FROM earnings
    `;

    // Get total payouts
    const totalPayouts = await sql`
      SELECT COALESCE(SUM(amount), 0) as total FROM payouts
    `;

    // Get active contracts
    const activeContracts = await sql`
      SELECT COUNT(*) as count FROM contracts WHERE status = 'Signed'
    `;

    // Get pending advances
    const pendingAdvances = await sql`
      SELECT COUNT(*) as count FROM advance_payouts WHERE status = 'Pending'
    `;

    // Blog statistics
    const blogStatsToday = await sql`
      SELECT COUNT(*) as count 
      FROM blog_posts 
      WHERE DATE(created_at) = CURRENT_DATE
    `;

    const blogStatsWeek = await sql`
      SELECT COUNT(*) as count 
      FROM blog_posts 
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
    `;

    const blogStatsMonth = await sql`
      SELECT COUNT(*) as count 
      FROM blog_posts 
      WHERE created_at >= CURRENT_DATE - INTERVAL '1 month'
    `;

    const blogStatsYear = await sql`
      SELECT COUNT(*) as count 
      FROM blog_posts 
      WHERE created_at >= CURRENT_DATE - INTERVAL '1 year'
    `;

    const totalBlogPosts = await sql`
      SELECT COUNT(*) as count FROM blog_posts
    `;

    const publishedBlogPosts = await sql`
      SELECT COUNT(*) as count FROM blog_posts WHERE status = 'published'
    `;

    const totalBlogViews = await sql`
      SELECT COALESCE(SUM(view_count), 0) as total FROM blog_posts
    `;

    return Response.json({
      total_creators: parseInt(totalCreators[0].count),
      total_partners: parseInt(totalPartners[0].count),
      total_earnings: parseFloat(totalEarnings[0].total),
      total_payouts: parseFloat(totalPayouts[0].total),
      active_contracts: parseInt(activeContracts[0].count),
      pending_advances: parseInt(pendingAdvances[0].count),
      // Blog statistics
      blog_posts_today: parseInt(blogStatsToday[0]?.count || 0),
      blog_posts_week: parseInt(blogStatsWeek[0]?.count || 0),
      blog_posts_month: parseInt(blogStatsMonth[0]?.count || 0),
      blog_posts_year: parseInt(blogStatsYear[0]?.count || 0),
      total_blog_posts: parseInt(totalBlogPosts[0]?.count || 0),
      published_blog_posts: parseInt(publishedBlogPosts[0]?.count || 0),
      total_blog_views: parseInt(totalBlogViews[0]?.total || 0),
    });
  } catch (err) {
    console.error("GET /api/admin/stats error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
