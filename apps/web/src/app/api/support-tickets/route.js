import { getSession } from "@/app/api/utils/auth";
import sql from "@/app/api/utils/sql";

// GET all support tickets for the current creator
export async function GET(request) {
  try {
    const session = await getSession(request);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get creator profile
    const profileRows = await sql`
      SELECT id FROM creator_profiles WHERE user_id = ${session.user.id}
    `;

    if (profileRows.length === 0) {
      return Response.json(
        { error: "Creator profile not found" },
        { status: 404 },
      );
    }

    const creatorId = profileRows[0].id;

    // Fetch all tickets for this creator
    const tickets = await sql`
      SELECT 
        id,
        subject,
        message,
        status,
        priority,
        assigned_manager,
        created_at,
        updated_at
      FROM support_tickets
      WHERE creator_id = ${creatorId}
      ORDER BY created_at DESC
    `;

    return Response.json({ tickets });
  } catch (error) {
    console.error("Error fetching support tickets:", error);
    return Response.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

// POST create a new support ticket
export async function POST(request) {
  try {
    const session = await getSession(request);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { subject, message, priority } = body;

    if (!subject || !message) {
      return Response.json(
        { error: "Subject and message are required" },
        { status: 400 },
      );
    }

    // Get creator profile
    const profileRows = await sql`
      SELECT id FROM creator_profiles WHERE user_id = ${session.user.id}
    `;

    if (profileRows.length === 0) {
      return Response.json(
        { error: "Creator profile not found" },
        { status: 404 },
      );
    }

    const creatorId = profileRows[0].id;

    // Create new ticket
    const newTicket = await sql`
      INSERT INTO support_tickets (
        creator_id,
        subject,
        message,
        status,
        priority
      )
      VALUES (
        ${creatorId},
        ${subject},
        ${message},
        'Open',
        ${priority || "Normal"}
      )
      RETURNING *
    `;

    return Response.json({ ticket: newTicket[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating support ticket:", error);
    return Response.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}
