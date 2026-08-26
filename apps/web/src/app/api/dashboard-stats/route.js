import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/auth";

export async function GET(request) {
  try {
    const session = await getSession(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get creator profile with follower count
    const profileRows = await sql`
      SELECT id, follower_count FROM creator_profiles WHERE user_id = ${userId} LIMIT 1
    `;

    if (profileRows.length === 0) {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    const creatorId = profileRows[0].id;
    const followerCount = profileRows[0].follower_count;

    // Get all stats in parallel
    const [
      earningsRows,
      withholdingTaxRows,
      contractRows,
      accountHealthRows,
      recentEarningsRows,
      pendingAdvanceRows,
    ] = await sql.transaction([
      // Total earnings this month
      sql`
        SELECT COALESCE(SUM(amount), 0) as total
        FROM earnings
        WHERE creator_id = ${creatorId}
        AND EXTRACT(MONTH FROM earning_date) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM earning_date) = EXTRACT(YEAR FROM CURRENT_DATE)
      `,
      // Total withholding tax this month
      sql`
        SELECT COALESCE(SUM(withholding_tax), 0) as total
        FROM earnings
        WHERE creator_id = ${creatorId}
        AND EXTRACT(MONTH FROM earning_date) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM earning_date) = EXTRACT(YEAR FROM CURRENT_DATE)
      `,
      // Contract information (duration and revenue share)
      sql`
        SELECT duration_years, revenue_share_percentage
        FROM contracts
        WHERE creator_id = ${creatorId}
        AND status = 'Signed'
        ORDER BY signed_at DESC
        LIMIT 1
      `,
      // Account health
      sql`
        SELECT health_score, risk_level
        FROM account_health
        WHERE creator_id = ${creatorId}
        ORDER BY last_checked DESC
        LIMIT 1
      `,
      // Recent earnings (last 7 days)
      sql`
        SELECT platform, SUM(amount) as total, COUNT(*) as count
        FROM earnings
        WHERE creator_id = ${creatorId}
        AND earning_date >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY platform
        ORDER BY total DESC
      `,
      // Pending advance payout
      sql`
        SELECT outstanding_balance
        FROM advance_payouts
        WHERE creator_id = ${creatorId}
        AND status = 'Active'
        AND outstanding_balance > 0
        ORDER BY created_at DESC
        LIMIT 1
      `,
    ]);

    const stats = {
      monthlyEarnings: parseFloat(earningsRows[0]?.total || 0),
      withholdingTax: parseFloat(withholdingTaxRows[0]?.total || 0),
      contractYears: contractRows[0]?.duration_years || null,
      contractPercentage: contractRows[0]?.revenue_share_percentage
        ? parseFloat(contractRows[0].revenue_share_percentage)
        : null,
      accountHealth: accountHealthRows[0] || {
        health_score: 100,
        risk_level: "Low",
      },
      recentEarnings: recentEarningsRows,
      pendingAdvance: parseFloat(
        pendingAdvanceRows[0]?.outstanding_balance || 0,
      ),
      followerCount: followerCount || null,
    };

    return Response.json({ stats });
  } catch (err) {
    console.error("GET /api/dashboard-stats error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
