import sql from "@/app/api/utils/sql";
import { requirePartnerAuth } from "@/app/api/utils/partner-auth";

/**
 * GET /api/partner/financial-stats
 * Returns comprehensive financial statistics for the authenticated partner
 */
export async function GET(request) {
  try {
    // Require authentication
    const authCheck = await requirePartnerAuth(request);
    if (authCheck.error) {
      return authCheck.response;
    }

    const partner = authCheck.partner;

    // Get overall stats for onboarded creators
    const overallStats = await sql`
      SELECT 
        COUNT(*) as total_creators,
        SUM(total_earnings) as total_creator_earnings,
        SUM(total_earnings * contract_percentage / 100) as total_partner_share,
        AVG(contract_percentage) as avg_contract_percentage
      FROM onboarded_creators
      WHERE partner_id = ${partner.id}
    `;

    // Get monthly earnings breakdown (last 6 months)
    const monthlyEarnings = await sql`
      SELECT 
        DATE_TRUNC('month', e.earning_date) as month,
        SUM(e.amount) as creator_earnings,
        SUM(e.amount * oc.contract_percentage / 100) as partner_earnings
      FROM earnings e
      JOIN onboarded_creators oc ON e.creator_id = oc.creator_profile_id
      WHERE oc.partner_id = ${partner.id}
        AND e.earning_date >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', e.earning_date)
      ORDER BY month DESC
    `;

    // Get top earning creators
    const topCreators = await sql`
      SELECT 
        oc.id,
        oc.creator_name,
        oc.creator_email,
        oc.total_earnings,
        oc.contract_percentage,
        (oc.total_earnings * oc.contract_percentage / 100) as partner_share,
        cp.primary_platform,
        cp.page_name
      FROM onboarded_creators oc
      LEFT JOIN creator_profiles cp ON oc.creator_profile_id = cp.id
      WHERE oc.partner_id = ${partner.id}
      ORDER BY oc.total_earnings DESC
      LIMIT 10
    `;

    // Get platform breakdown
    const platformBreakdown = await sql`
      SELECT 
        cp.primary_platform as platform,
        COUNT(*) as creator_count,
        SUM(oc.total_earnings) as total_earnings,
        SUM(oc.total_earnings * oc.contract_percentage / 100) as partner_share
      FROM onboarded_creators oc
      LEFT JOIN creator_profiles cp ON oc.creator_profile_id = cp.id
      WHERE oc.partner_id = ${partner.id}
      GROUP BY cp.primary_platform
      ORDER BY total_earnings DESC
    `;

    // Get recent earnings (last 30 days)
    const recentEarnings = await sql`
      SELECT 
        SUM(e.amount) as total_earnings,
        SUM(e.amount * oc.contract_percentage / 100) as partner_share
      FROM earnings e
      JOIN onboarded_creators oc ON e.creator_id = oc.creator_profile_id
      WHERE oc.partner_id = ${partner.id}
        AND e.earning_date >= NOW() - INTERVAL '30 days'
    `;

    return Response.json({
      success: true,
      overall: overallStats[0] || {
        total_creators: 0,
        total_creator_earnings: 0,
        total_partner_share: 0,
        avg_contract_percentage: 0,
      },
      monthly: monthlyEarnings,
      topCreators,
      platforms: platformBreakdown,
      recent: recentEarnings[0] || {
        total_earnings: 0,
        partner_share: 0,
      },
    });
  } catch (error) {
    console.error("Error getting financial stats:", error);
    return Response.json(
      { error: "Failed to get financial statistics" },
      { status: 500 },
    );
  }
}
