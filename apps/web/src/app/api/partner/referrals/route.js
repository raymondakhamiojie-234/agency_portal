import sql from "@/app/api/utils/sql";
import { requirePartnerAuth } from "@/app/api/utils/partner-auth";

export async function GET(request) {
  try {
    // Require authentication
    const authCheck = await requirePartnerAuth(request);
    if (authCheck.error) {
      return authCheck.response;
    }

    const partner = authCheck.partner;

    // Get all referrals for this partner
    const referrals = await sql`
      SELECT 
        pr.id,
        pr.referred_user_email,
        pr.referred_user_name,
        pr.signup_date,
        pr.created_at,
        cp.full_name as creator_full_name,
        cp.account_status
      FROM partner_referrals pr
      LEFT JOIN creator_profiles cp ON pr.referred_user_id = cp.id
      WHERE pr.partner_id = ${partner.id}
      ORDER BY pr.created_at DESC
    `;

    // Get referral stats
    const stats = await sql`
      SELECT 
        COUNT(*) as total_referrals,
        COUNT(CASE WHEN pr.created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as referrals_this_month,
        COUNT(CASE WHEN pr.created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as referrals_this_week
      FROM partner_referrals pr
      WHERE pr.partner_id = ${partner.id}
    `;

    return Response.json({
      success: true,
      referrals,
      stats: stats[0] || {
        total_referrals: 0,
        referrals_this_month: 0,
        referrals_this_week: 0,
      },
    });
  } catch (error) {
    console.error("Error getting referrals:", error);
    return Response.json({ error: "Failed to get referrals" }, { status: 500 });
  }
}
