import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/auth";

// GET - Authenticated: Get current user's listings
export async function GET(request) {
  try {
    const session = await getSession(request);

    if (!session?.user) {
      return Response.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Get seller IDs for all possible roles
    let listings = [];

    // Check if user is a creator
    const creatorProfile = await sql`
      SELECT id FROM creator_profiles WHERE user_id = ${session.user.id}
    `;

    if (creatorProfile.length > 0) {
      const creatorListings = await sql`
        SELECT * FROM marketplace_listings 
        WHERE seller_id = ${creatorProfile[0].id} AND seller_role = 'creator'
        ORDER BY created_at DESC
      `;
      listings = [...listings, ...creatorListings];
    }

    // Check if user is a partner
    const partnerProfile = await sql`
      SELECT id FROM partners WHERE email = ${session.user.email}
    `;

    if (partnerProfile.length > 0) {
      const partnerListings = await sql`
        SELECT * FROM marketplace_listings 
        WHERE seller_id = ${partnerProfile[0].id} AND seller_role = 'partner'
        ORDER BY created_at DESC
      `;
      listings = [...listings, ...partnerListings];
    }

    // Check for client listings
    const clientListings = await sql`
      SELECT * FROM marketplace_listings 
      WHERE seller_id = ${session.user.id} AND seller_role = 'client'
      ORDER BY created_at DESC
    `;
    listings = [...listings, ...clientListings];

    return Response.json({ listings });
  } catch (error) {
    console.error("Error fetching user listings:", error);
    return Response.json(
      { error: "Failed to fetch listings" },
      { status: 500 },
    );
  }
}
