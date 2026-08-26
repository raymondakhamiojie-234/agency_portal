import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/auth";

// POST - Authenticated: Express interest in a listing
export async function POST(request, { params }) {
  try {
    const session = await getSession(request);

    if (!session?.user) {
      return Response.json(
        { error: "Please sign in to contact sellers" },
        { status: 401 },
      );
    }

    const { id } = params;
    const body = await request.json();
    const { message } = body;

    // Check if listing exists and is approved
    const [listing] = await sql`
      SELECT * FROM marketplace_listings 
      WHERE id = ${id} AND status = 'approved'
    `;

    if (!listing) {
      return Response.json(
        { error: "Listing not found or not available" },
        { status: 404 },
      );
    }

    // Check if user has already contacted
    const existing = await sql`
      SELECT * FROM marketplace_interests 
      WHERE listing_id = ${id} AND buyer_id = ${session.user.id}
    `;

    if (existing.length > 0) {
      return Response.json(
        { error: "You have already expressed interest in this listing" },
        { status: 400 },
      );
    }

    // Create interest record
    const [interest] = await sql`
      INSERT INTO marketplace_interests (
        listing_id,
        buyer_id,
        buyer_email,
        buyer_name,
        message,
        status
      ) VALUES (
        ${id},
        ${session.user.id},
        ${session.user.email},
        ${session.user.name || session.user.email},
        ${message || null},
        'pending'
      )
      RETURNING *
    `;

    return Response.json(
      {
        interest,
        message:
          "Your interest has been registered. The seller will be notified.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating interest:", error);
    return Response.json(
      { error: "Failed to register interest" },
      { status: 500 },
    );
  }
}
