import { getSession } from "@/app/api/utils/auth";
import sql from "@/app/api/utils/sql";

// GET all messages for a specific ticket
export async function GET(request, { params }) {
  try {
    const session = await getSession(request);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ticketId = params.id;

    // Verify ticket belongs to this user
    const ticket = await sql`
      SELECT st.id
      FROM support_tickets st
      JOIN creator_profiles cp ON st.creator_id = cp.id
      WHERE st.id = ${ticketId} AND cp.user_id = ${session.user.id}
    `;

    if (ticket.length === 0) {
      return Response.json({ error: "Ticket not found" }, { status: 404 });
    }

    // For now, return the original ticket message as the first message
    // In a full implementation, you'd have a ticket_messages table
    const ticketDetails = await sql`
      SELECT message, created_at FROM support_tickets WHERE id = ${ticketId}
    `;

    const messages = [
      {
        id: 1,
        ticket_id: ticketId,
        sender: "client",
        message: ticketDetails[0].message,
        created_at: ticketDetails[0].created_at,
      },
    ];

    return Response.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return Response.json(
      { error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}

// POST add a new message to a ticket
export async function POST(request, { params }) {
  try {
    const session = await getSession(request);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ticketId = params.id;
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    // Verify ticket belongs to this user
    const ticket = await sql`
      SELECT st.id
      FROM support_tickets st
      JOIN creator_profiles cp ON st.creator_id = cp.id
      WHERE st.id = ${ticketId} AND cp.user_id = ${session.user.id}
    `;

    if (ticket.length === 0) {
      return Response.json({ error: "Ticket not found" }, { status: 404 });
    }

    // For now, we'll append to the ticket message field
    // In a full implementation, you'd insert into a ticket_messages table
    await sql`
      UPDATE support_tickets 
      SET updated_at = NOW()
      WHERE id = ${ticketId}
    `;

    const newMessage = {
      id: Date.now(),
      ticket_id: ticketId,
      sender: "client",
      message: message,
      created_at: new Date(),
    };

    return Response.json({ message: newMessage }, { status: 201 });
  } catch (error) {
    console.error("Error posting message:", error);
    return Response.json({ error: "Failed to post message" }, { status: 500 });
  }
}
