import sql from "@/app/api/utils/sql";
import { getAdminSession } from "@/app/api/utils/auth";

/**
 * GET /api/admin/partner-performance
 * Returns comprehensive partner performance data with optional filtering
 */
export async function GET(request) {
  try {
    // Check if user is admin
    const session = await getAdminSession(request);
    if (!session || !session.admin?.id) {
      return Response.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 },
      );
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get("partnerId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build base query with filters
    let partnerFilter = "";
    let dateFilter = "";
    const params = [];

    if (partnerId) {
      partnerFilter = "AND p.id = $" + (params.length + 1);
      params.push(parseInt(partnerId));
    }

    if (startDate && endDate) {
      dateFilter =
        "AND oc.created_at BETWEEN $" +
        (params.length + 1) +
        " AND $" +
        (params.length + 2);
      params.push(startDate, endDate);
    }

    // Get all partners with their performance metrics
    const partnersQuery = `
      SELECT 
        p.id,
        p.name,
        p.email,
        p.referral_code,
        p.referral_link,
        p.total_referrals,
        p.created_at,
        COUNT(DISTINCT oc.id) as onboarded_creators_count,
        COALESCE(SUM(oc.total_earnings), 0) as total_creator_earnings,
        COALESCE(SUM(oc.total_earnings * oc.contract_percentage / 100), 0) as total_partner_commission,
        COALESCE(AVG(oc.contract_percentage), 0) as avg_contract_percentage
      FROM partners p
      LEFT JOIN onboarded_creators oc ON p.id = oc.partner_id ${dateFilter}
      WHERE 1=1 ${partnerFilter}
      GROUP BY p.id, p.name, p.email, p.referral_code, p.referral_link, p.total_referrals, p.created_at
      ORDER BY total_partner_commission DESC
    `;

    const partners = await sql(partnersQuery, params);

    // Get overall stats
    const overallStats = await sql`
      SELECT 
        COUNT(DISTINCT p.id) as total_partners,
        COUNT(DISTINCT oc.id) as total_onboarded_creators,
        COALESCE(SUM(oc.total_earnings), 0) as total_earnings,
        COALESCE(SUM(oc.total_earnings * oc.contract_percentage / 100), 0) as total_commissions
      FROM partners p
      LEFT JOIN onboarded_creators oc ON p.id = oc.partner_id
    `;

    // Get top performing partners (by commission)
    const topPartners = await sql`
      SELECT 
        p.name,
        p.email,
        COUNT(DISTINCT oc.id) as creators_count,
        COALESCE(SUM(oc.total_earnings * oc.contract_percentage / 100), 0) as total_commission
      FROM partners p
      LEFT JOIN onboarded_creators oc ON p.id = oc.partner_id
      GROUP BY p.id, p.name, p.email
      HAVING COUNT(DISTINCT oc.id) > 0
      ORDER BY total_commission DESC
      LIMIT 5
    `;

    // Get monthly commission trends (last 6 months)
    const monthlyTrends = await sql`
      SELECT 
        DATE_TRUNC('month', e.earning_date) as month,
        SUM(e.amount * oc.contract_percentage / 100) as total_commission,
        COUNT(DISTINCT oc.partner_id) as active_partners
      FROM earnings e
      JOIN onboarded_creators oc ON e.creator_id = oc.creator_profile_id
      WHERE e.earning_date >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', e.earning_date)
      ORDER BY month DESC
    `;

    return Response.json({
      success: true,
      partners,
      stats: overallStats[0] || {
        total_partners: 0,
        total_onboarded_creators: 0,
        total_earnings: 0,
        total_commissions: 0,
      },
      topPartners,
      monthlyTrends,
    });
  } catch (error) {
    console.error("Error getting partner performance:", error);
    return Response.json(
      { error: "Failed to get partner performance data" },
      { status: 500 },
    );
  }
}
