import sql from "@/app/api/utils/sql";
import { getAdminSession } from "@/app/api/utils/auth";

// GET - Admin: Get all marketplace listings
export async function GET(request) {
  try {
    const session = await getAdminSession(request);

    if (!session || !session.admin?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let listings;
    if (status) {
      listings = await sql`
        SELECT * FROM marketplace_listings 
        WHERE status = ${status}
        ORDER BY created_at DESC
      `;
    } else {
      listings = await sql`
        SELECT * FROM marketplace_listings 
        ORDER BY created_at DESC
      `;
    }

    // Get stats
    const stats = await sql`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'sold' THEN 1 ELSE 0 END) as sold,
        SUM(CASE WHEN status = 'suspended' THEN 1 ELSE 0 END) as suspended,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
      FROM marketplace_listings
    `;

    return Response.json({
      listings,
      stats: stats[0],
    });
  } catch (error) {
    console.error("Error fetching marketplace listings:", error);
    return Response.json(
      { error: "Failed to fetch listings" },
      { status: 500 },
    );
  }
}
