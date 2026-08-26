import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/auth";

// GET - Authenticated: Get messages for a listing
export async function GET(request, { params }) {
  try {
    const session = await getSession(request);

    if (!session?.user) {
      return Response.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const { id } = params;

    // Get listing to verify access
    const [listing] = await sql`
      SELECT * FROM marketplace_listings WHERE id = ${id}
    `;

    if (!listing) {
      return Response.json({ error: "Listing not found" }, { status: 404 });
    }

    // Determine if user is seller, buyer, or admin
    let isSeller = false;
    let isBuyer = false;
    const isAdmin = session.user.isAdmin;

    if (listing.seller_role === "creator") {
      const creatorProfile = await sql`
        SELECT id FROM creator_profiles WHERE user_id = ${session.user.id}
      `;
      isSeller =
        creatorProfile.length > 0 && creatorProfile[0].id === listing.seller_id;
    } else if (listing.seller_role === "partner") {
      const partnerProfile = await sql`
        SELECT id FROM partners WHERE email = ${session.user.email}
      `;
      isSeller =
        partnerProfile.length > 0 && partnerProfile[0].id === listing.seller_id;
    } else {
      isSeller = session.user.id === listing.seller_id;
    }

    // Check if user has expressed interest (is a buyer)
    const interest = await sql`
      SELECT * FROM marketplace_interests 
      WHERE listing_id = ${id} AND buyer_id = ${session.user.id}
    `;
    isBuyer = interest.length > 0;

    // Only seller, buyers who contacted, or admin can view messages
    if (!isSeller && !isBuyer && !isAdmin) {
      return Response.json({ error: "Access denied" }, { status: 403 });
    }

    // Get all messages for this listing
    const messages = await sql`
      SELECT * FROM marketplace_messages 
      WHERE listing_id = ${id}
      ORDER BY created_at ASC
    `;

    // Mark messages as read if user is the recipient
    const userRole = isSeller ? "seller" : "buyer";
    if (messages.length > 0) {
      await sql`
        UPDATE marketplace_messages 
        SET read_by_recipient = true, read_at = NOW()
        WHERE listing_id = ${id} 
          AND sender_role != ${userRole}
          AND read_by_recipient = false
      `;
    }

    return Response.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return Response.json(
      { error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}

// POST - Authenticated: Send a message
export async function POST(request, { params }) {
  try {
    const session = await getSession(request);

    if (!session?.user) {
      return Response.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const { id } = params;
    const body = await request.json();
    const { message } = body;

    if (!message || message.trim().length === 0) {
      return Response.json(
        { error: "Message cannot be empty" },
        { status: 400 },
      );
    }

    // Get listing
    const [listing] = await sql`
      SELECT * FROM marketplace_listings WHERE id = ${id}
    `;

    if (!listing) {
      return Response.json({ error: "Listing not found" }, { status: 404 });
    }

    // Determine sender role
    let senderRole;
    let isSeller = false;

    if (session.user.isAdmin) {
      senderRole = "admin";
    } else {
      // Check if user is the seller
      if (listing.seller_role === "creator") {
        const creatorProfile = await sql`
          SELECT id FROM creator_profiles WHERE user_id = ${session.user.id}
        `;
        isSeller =
          creatorProfile.length > 0 &&
          creatorProfile[0].id === listing.seller_id;
      } else if (listing.seller_role === "partner") {
        const partnerProfile = await sql`
          SELECT id FROM partners WHERE email = ${session.user.email}
        `;
        isSeller =
          partnerProfile.length > 0 &&
          partnerProfile[0].id === listing.seller_id;
      } else {
        isSeller = session.user.id === listing.seller_id;
      }

      if (isSeller) {
        senderRole = "seller";
      } else {
        // User must have expressed interest to message
        const interest = await sql`
          SELECT * FROM marketplace_interests 
          WHERE listing_id = ${id} AND buyer_id = ${session.user.id}
        `;

        if (interest.length === 0) {
          return Response.json(
            {
              error:
                "You must express interest in this listing before messaging",
            },
            { status: 403 },
          );
        }

        senderRole = "buyer";
      }
    }

    // Create message
    const [newMessage] = await sql`
      INSERT INTO marketplace_messages (
        listing_id,
        sender_id,
        sender_role,
        sender_name,
        message
      ) VALUES (
        ${id},
        ${session.user.id},
        ${senderRole},
        ${session.user.name || session.user.email},
        ${message.trim()}
      )
      RETURNING *
    `;

    return Response.json(
      {
        message: newMessage,
        success: "Message sent successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return Response.json({ error: "Failed to send message" }, { status: 500 });
  }
}
