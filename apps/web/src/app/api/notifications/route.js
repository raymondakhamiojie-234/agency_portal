import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/auth";

// Get all notifications for the logged-in creator
export async function GET(request) {
  try {
    const session = await getSession(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get creator profile
    const profileRows = await sql`
      SELECT id FROM creator_profiles WHERE user_id = ${userId} LIMIT 1
    `;

    if (profileRows.length === 0) {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    const creatorId = profileRows[0].id;

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // agency, update, blog
    const unreadOnly = searchParams.get("unread") === "true";

    // Build dynamic query
    let query = `
      SELECT * FROM notifications 
      WHERE creator_id = $1
    `;
    const values = [creatorId];
    let paramCount = 2;

    if (type) {
      query += ` AND notification_type = $${paramCount}`;
      values.push(type);
      paramCount++;
    }

    if (unreadOnly) {
      query += ` AND is_read = false`;
    }

    query += ` ORDER BY created_at DESC`;

    const notifications = await sql(query, values);

    return Response.json({ notifications });
  } catch (err) {
    console.error("GET /api/notifications error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Mark notification(s) as read
export async function PUT(request) {
  try {
    const session = await getSession(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { notificationId, markAllRead } = body;

    // Get creator profile
    const profileRows = await sql`
      SELECT id FROM creator_profiles WHERE user_id = ${userId} LIMIT 1
    `;

    if (profileRows.length === 0) {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    const creatorId = profileRows[0].id;

    if (markAllRead) {
      // Mark all notifications as read for this creator
      await sql`
        UPDATE notifications
        SET is_read = true
        WHERE creator_id = ${creatorId} AND is_read = false
      `;

      return Response.json({ message: "All notifications marked as read" });
    } else if (notificationId) {
      // Mark specific notification as read
      const result = await sql`
        UPDATE notifications
        SET is_read = true
        WHERE id = ${notificationId} AND creator_id = ${creatorId}
        RETURNING *
      `;

      if (result.length === 0) {
        return Response.json(
          { error: "Notification not found" },
          { status: 404 },
        );
      }

      return Response.json({ notification: result[0] });
    } else {
      return Response.json(
        { error: "Must provide notificationId or markAllRead" },
        { status: 400 },
      );
    }
  } catch (err) {
    console.error("PUT /api/notifications error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Create a new notification (admin only - for demo purposes)
export async function POST(request) {
  try {
    const session = await getSession(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { title, message, notificationType } = body;

    if (!title || !message) {
      return Response.json(
        { error: "Title and message are required" },
        { status: 400 },
      );
    }

    // Get creator profile
    const profileRows = await sql`
      SELECT id FROM creator_profiles WHERE user_id = ${userId} LIMIT 1
    `;

    if (profileRows.length === 0) {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    const creatorId = profileRows[0].id;

    // Create notification
    const result = await sql`
      INSERT INTO notifications (creator_id, title, message, notification_type)
      VALUES (${creatorId}, ${title}, ${message}, ${notificationType || "agency"})
      RETURNING *
    `;

    return Response.json({ notification: result[0] });
  } catch (err) {
    console.error("POST /api/notifications error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
