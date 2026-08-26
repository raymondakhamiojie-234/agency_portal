import sql from "@/app/api/utils/sql";
import { getAdminSession } from "@/app/api/utils/auth";

export async function GET(req) {
  try {
    console.log("[Advance Payouts API] Request received");

    // Check admin authentication using the proper helper
    const session = await getAdminSession(req);
    if (!session || !session.admin?.id) {
      console.error("[Advance Payouts API] No admin session found");
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(
      "[Advance Payouts API] Admin authenticated, ID:",
      session.admin.id,
    );

    // Get query parameters for filtering
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    console.log("[Advance Payouts API] Filter status:", status);

    // Fetch all advance payouts with creator details
    console.log("[Advance Payouts API] Fetching loans...");
    let loans;
    if (status && status !== "all") {
      loans = await sql`
        SELECT 
          ap.id,
          ap.creator_id,
          ap.requested_amount,
          ap.fee_percentage,
          ap.fee_amount,
          ap.net_amount,
          ap.status,
          ap.outstanding_balance,
          ap.repayment_progress,
          ap.disbursed_at,
          ap.created_at,
          ap.updated_at,
          cp.full_name as creator_name,
          cp.brand_name,
          cp.phone_number,
          cp.primary_platform,
          au.email as creator_email
        FROM advance_payouts ap
        LEFT JOIN creator_profiles cp ON ap.creator_id = cp.id
        LEFT JOIN auth_users au ON cp.user_id = au.id
        WHERE ap.status = ${status}
        ORDER BY ap.created_at DESC
      `;
    } else {
      loans = await sql`
        SELECT 
          ap.id,
          ap.creator_id,
          ap.requested_amount,
          ap.fee_percentage,
          ap.fee_amount,
          ap.net_amount,
          ap.status,
          ap.outstanding_balance,
          ap.repayment_progress,
          ap.disbursed_at,
          ap.created_at,
          ap.updated_at,
          cp.full_name as creator_name,
          cp.brand_name,
          cp.phone_number,
          cp.primary_platform,
          au.email as creator_email
        FROM advance_payouts ap
        LEFT JOIN creator_profiles cp ON ap.creator_id = cp.id
        LEFT JOIN auth_users au ON cp.user_id = au.id
        ORDER BY ap.created_at DESC
      `;
    }

    console.log("[Advance Payouts API] Loans fetched, count:", loans.length);

    // Get summary stats
    console.log("[Advance Payouts API] Fetching stats...");
    const stats = await sql`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'Pending') as pending_count,
        COUNT(*) FILTER (WHERE status = 'Approved') as approved_count,
        COUNT(*) FILTER (WHERE status = 'Disbursed') as disbursed_count,
        COUNT(*) FILTER (WHERE status = 'Rejected') as rejected_count,
        COUNT(*) FILTER (WHERE status = 'Completed') as completed_count,
        COALESCE(SUM(requested_amount) FILTER (WHERE status = 'Pending'), 0) as pending_amount,
        COALESCE(SUM(requested_amount) FILTER (WHERE status = 'Approved'), 0) as approved_amount,
        COALESCE(SUM(requested_amount) FILTER (WHERE status = 'Disbursed'), 0) as disbursed_amount,
        COALESCE(SUM(outstanding_balance), 0) as total_outstanding
      FROM advance_payouts
    `;

    console.log("[Advance Payouts API] Stats query result:", stats);

    const responseData = {
      loans: loans || [],
      stats:
        stats && stats[0]
          ? {
              pending_count: Number(stats[0].pending_count || 0),
              approved_count: Number(stats[0].approved_count || 0),
              disbursed_count: Number(stats[0].disbursed_count || 0),
              rejected_count: Number(stats[0].rejected_count || 0),
              completed_count: Number(stats[0].completed_count || 0),
              pending_amount: Number(stats[0].pending_amount || 0),
              approved_amount: Number(stats[0].approved_amount || 0),
              disbursed_amount: Number(stats[0].disbursed_amount || 0),
              total_outstanding: Number(stats[0].total_outstanding || 0),
            }
          : {
              pending_count: 0,
              approved_count: 0,
              disbursed_count: 0,
              rejected_count: 0,
              completed_count: 0,
              pending_amount: 0,
              approved_amount: 0,
              disbursed_amount: 0,
              total_outstanding: 0,
            },
    };

    console.log("[Advance Payouts API] Response prepared, sending...");

    return Response.json(responseData);
  } catch (error) {
    console.error("[Advance Payouts API] ❌ ERROR occurred:");
    console.error("[Advance Payouts API] Error name:", error.name);
    console.error("[Advance Payouts API] Error message:", error.message);
    console.error("[Advance Payouts API] Error stack:", error.stack);

    return Response.json(
      {
        error: "Failed to fetch advance payouts",
        details: error.message,
        errorName: error.name,
      },
      { status: 500 },
    );
  }
}
