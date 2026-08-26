import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/auth";

// GET - Admin: View all marketplace conversations
export async function GET(request) {
  try {
    const session = await getSession(request);

    if (!session?.user?.isAdmin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get("listingId");

    let conversations;

    if (listingId) {
      // Get messages for specific listing
      conversations = await sql`
        SELECT 
          mm.*,
          ml.account_name as listing_name,
          ml.platform,
          ml.seller_role
        FROM marketplace_messages mm
        JOIN marketplace_listings ml ON mm.listing_id = ml.id
        WHERE mm.listing_id = ${listingId}
        ORDER BY mm.created_at ASC
      `;
    } else {
      // Get all conversations grouped by listing
      conversations = await sql`
        SELECT 
          ml.id as listing_id,
          ml.account_name as listing_name,
          ml.platform,
          ml.seller_role,
          ml.status as listing_status,
          COUNT(mm.id) as message_count,
          MAX(mm.created_at) as last_message_at
        FROM marketplace_listings ml
        LEFT JOIN marketplace_messages mm ON ml.id = mm.listing_id
        GROUP BY ml.id, ml.account_name, ml.platform, ml.seller_role, ml.status
        HAVING COUNT(mm.id) > 0
        ORDER BY MAX(mm.created_at) DESC
      `;
    }

    return Response.json({ conversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return Response.json(
      { error: "Failed to fetch conversations" },
      { status: 500 },
    );
  }
}
