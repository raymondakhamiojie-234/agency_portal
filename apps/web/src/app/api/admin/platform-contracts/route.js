import sql from "@/app/api/utils/sql";
import { getAdminSession } from "@/app/api/utils/auth";

// GET - List all platform contracts (Admin)
export async function GET(request) {
  try {
    const session = await getAdminSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const platform = searchParams.get("platform");
    const status = searchParams.get("status");

    // Build query dynamically based on filters
    let queryText = `
      SELECT 
        pc.*,
        cp.full_name as creator_name,
        cp.user_id
      FROM platform_contracts pc
      JOIN creator_profiles cp ON pc.creator_id = cp.id
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (platform) {
      queryText += ` AND pc.platform = $${paramIndex}`;
      params.push(platform);
      paramIndex++;
    }

    if (status) {
      queryText += ` AND pc.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    queryText += " ORDER BY pc.created_at DESC";

    const contracts = await sql(queryText, params);

    // Calculate total followers per platform
    const followerStats = await sql`
      SELECT 
        platform,
        SUM(followers_count) as total_followers,
        COUNT(*) as contract_count
      FROM platform_contracts
      WHERE status = 'Signed'
      GROUP BY platform
    `;

    return Response.json({
      contracts,
      followerStats,
    });
  } catch (error) {
    console.error("Error fetching platform contracts:", error);
    return Response.json(
      { error: "Failed to fetch contracts" },
      { status: 500 },
    );
  }
}
