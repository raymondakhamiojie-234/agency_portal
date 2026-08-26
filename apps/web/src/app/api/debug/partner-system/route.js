import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/auth";

/**
 * DEBUG ENDPOINT: GET /api/debug/partner-system
 * Provides comprehensive system diagnostics for partner and earnings tracking
 * Admin-only endpoint for debugging
 */
export async function GET(request) {
  try {
    // Check if user is admin
    const session = await getSession(request);
    if (!session || !session.user.isAdmin) {
      return Response.json(
        { error: "Unauthorized. Admin access required for debugging." },
        { status: 403 },
      );
    }

    const diagnostics = {
      timestamp: new Date().toISOString(),
      checks: [],
    };

    // Check 1: Partner count and basic info
    const partners = await sql`
      SELECT 
        id, 
        name, 
        email, 
        referral_code, 
        total_referrals,
        created_at
      FROM partners
      ORDER BY created_at DESC
    `;

    diagnostics.checks.push({
      name: "Partners",
      status: "OK",
      count: partners.length,
      sample: partners.slice(0, 3),
    });

    // Check 2: Partner referrals
    const referrals = await sql`
      SELECT 
        pr.id,
        pr.partner_id,
        p.name as partner_name,
        pr.referred_user_email,
        pr.referred_user_name,
        pr.referred_user_id,
        pr.signup_date
      FROM partner_referrals pr
      JOIN partners p ON pr.partner_id = p.id
      ORDER BY pr.signup_date DESC
      LIMIT 10
    `;

    diagnostics.checks.push({
      name: "Partner Referrals",
      status: "OK",
      count: referrals.length,
      sample: referrals,
      notes:
        "These are users who signed up with a referral code. If referred_user_id is NULL, they haven't completed their profile yet.",
    });

    // Check 3: Onboarded creators (financial tracking)
    const onboardedCreators = await sql`
      SELECT 
        oc.id,
        oc.partner_id,
        p.name as partner_name,
        oc.creator_profile_id,
        oc.creator_name,
        oc.creator_email,
        oc.contract_percentage,
        oc.total_earnings,
        (oc.total_earnings * oc.contract_percentage / 100) as partner_share,
        oc.created_at
      FROM onboarded_creators oc
      JOIN partners p ON oc.partner_id = p.id
      ORDER BY oc.created_at DESC
      LIMIT 10
    `;

    diagnostics.checks.push({
      name: "Onboarded Creators (Financial Tracking)",
      status: "OK",
      count: onboardedCreators.length,
      sample: onboardedCreators,
      notes:
        "These creators have completed profiles and are linked to partners for commission tracking.",
    });

    // Check 4: Earnings records
    const earnings = await sql`
      SELECT 
        e.id,
        e.creator_id,
        cp.page_name,
        cp.full_name as creator_name,
        e.platform,
        e.amount,
        e.earning_date,
        e.payout_status,
        e.created_at
      FROM earnings e
      JOIN creator_profiles cp ON e.creator_id = cp.id
      ORDER BY e.created_at DESC
      LIMIT 10
    `;

    diagnostics.checks.push({
      name: "Earnings Records",
      status: "OK",
      count: earnings.length,
      sample: earnings,
      notes: "Individual earnings records uploaded by admin.",
    });

    // Check 5: Verify earnings aggregation
    const aggregationCheck = await sql`
      SELECT 
        oc.id as onboarded_creator_id,
        oc.creator_name,
        oc.creator_profile_id,
        oc.total_earnings as stored_total,
        COALESCE(SUM(e.amount), 0) as calculated_total,
        (oc.total_earnings - COALESCE(SUM(e.amount), 0)) as difference
      FROM onboarded_creators oc
      LEFT JOIN earnings e ON e.creator_id = oc.creator_profile_id
      GROUP BY oc.id, oc.creator_name, oc.creator_profile_id, oc.total_earnings
      HAVING ABS(oc.total_earnings - COALESCE(SUM(e.amount), 0)) > 0.01
    `;

    diagnostics.checks.push({
      name: "Earnings Aggregation Integrity",
      status: aggregationCheck.length === 0 ? "OK" : "WARNING",
      issues: aggregationCheck.length,
      sample: aggregationCheck,
      notes:
        aggregationCheck.length === 0
          ? "All totals match!"
          : "Found mismatches between stored totals and calculated totals. May need to re-run earnings update.",
    });

    // Check 6: Orphaned records
    const orphanedReferrals = await sql`
      SELECT 
        pr.id,
        pr.partner_id,
        p.name as partner_name,
        pr.referred_user_email,
        pr.referred_user_name,
        pr.referred_user_id,
        pr.signup_date
      FROM partner_referrals pr
      JOIN partners p ON pr.partner_id = p.id
      WHERE pr.referred_user_id IS NULL
        AND pr.signup_date < NOW() - INTERVAL '7 days'
    `;

    diagnostics.checks.push({
      name: "Orphaned Referrals (No Profile After 7 Days)",
      status: orphanedReferrals.length === 0 ? "OK" : "INFO",
      count: orphanedReferrals.length,
      sample: orphanedReferrals,
      notes:
        "Users who signed up with referral code but haven't completed their profile after 7 days.",
    });

    // Check 7: Partner earnings summary
    const partnerEarnings = await sql`
      SELECT 
        p.id,
        p.name,
        p.email,
        COUNT(DISTINCT oc.id) as creators_onboarded,
        COALESCE(SUM(oc.total_earnings), 0) as total_creator_earnings,
        COALESCE(SUM(oc.total_earnings * oc.contract_percentage / 100), 0) as total_partner_commission
      FROM partners p
      LEFT JOIN onboarded_creators oc ON p.id = oc.partner_id
      GROUP BY p.id, p.name, p.email
      ORDER BY total_partner_commission DESC
    `;

    diagnostics.checks.push({
      name: "Partner Earnings Summary",
      status: "OK",
      count: partnerEarnings.length,
      sample: partnerEarnings,
    });

    // Overall status
    diagnostics.overall_status =
      diagnostics.checks.filter((c) => c.status === "WARNING").length > 0
        ? "WARNING"
        : "HEALTHY";

    // Recommendations
    diagnostics.recommendations = [];

    if (aggregationCheck.length > 0) {
      diagnostics.recommendations.push({
        issue: "Earnings totals out of sync",
        action:
          "Run UPDATE onboarded_creators SET total_earnings = (SELECT COALESCE(SUM(amount), 0) FROM earnings WHERE creator_id = onboarded_creators.creator_profile_id)",
      });
    }

    if (orphanedReferrals.length > 0) {
      diagnostics.recommendations.push({
        issue: `${orphanedReferrals.length} referrals without profiles after 7 days`,
        action:
          "Follow up with these users to complete their onboarding, or clean up old referral records.",
      });
    }

    return Response.json(diagnostics, { status: 200 });
  } catch (error) {
    console.error("Debug endpoint error:", error);
    return Response.json(
      {
        error: "Debug endpoint failed",
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
