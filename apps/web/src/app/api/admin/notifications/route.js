import sql from "@/app/api/utils/sql";
import { getAdminSession } from "@/app/api/utils/auth";

export async function GET(req) {
  try {
    console.log("[Admin Notifications API] Request received");

    // Check admin authentication using the proper helper
    const session = await getAdminSession(req);
    if (!session || !session.admin?.id) {
      console.error("[Admin Notifications API] No admin session found");
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminId = session.admin.id;
    console.log("[Admin Notifications API] Admin authenticated, ID:", adminId);

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get("unread") === "true";
    const limit = parseInt(searchParams.get("limit") || "50");

    console.log(
      "[Admin Notifications API] Filters - unreadOnly:",
      unreadOnly,
      "limit:",
      limit,
    );

    // Fetch notifications
    console.log("[Admin Notifications API] Fetching notifications...");
    let notifications;
    if (unreadOnly) {
      notifications = await sql`
        SELECT 
          id,
          title,
          message,
          notification_type,
          related_id,
          related_type,
          is_read,
          created_at
        FROM admin_notifications
        WHERE admin_id = ${adminId}
        AND is_read = false
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
    } else {
      notifications = await sql`
        SELECT 
          id,
          title,
          message,
          notification_type,
          related_id,
          related_type,
          is_read,
          created_at
        FROM admin_notifications
        WHERE admin_id = ${adminId}
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
    }

    console.log(
      "[Admin Notifications API] Notifications fetched, count:",
      notifications.length,
    );

    // Get unread count
    console.log("[Admin Notifications API] Fetching unread count...");
    const unreadCount = await sql`
      SELECT COUNT(*) as count
      FROM admin_notifications
      WHERE admin_id = ${adminId}
      AND is_read = false
    `;

    console.log(
      "[Admin Notifications API] Unread count query result:",
      unreadCount,
    );

    const responseData = {
      notifications: notifications || [],
      unread_count:
        unreadCount && unreadCount[0] ? Number(unreadCount[0].count || 0) : 0,
    };

    console.log("[Admin Notifications API] Response prepared, sending...");

    return Response.json(responseData);
  } catch (error) {
    console.error("[Admin Notifications API] ❌ ERROR occurred:");
    console.error("[Admin Notifications API] Error name:", error.name);
    console.error("[Admin Notifications API] Error message:", error.message);
    console.error("[Admin Notifications API] Error stack:", error.stack);

    return Response.json(
      {
        error: "Failed to fetch notifications",
        details: error.message,
        errorName: error.name,
      },
      { status: 500 },
    );
  }
}

export async function PATCH(req) {
  try {
    // Check admin authentication using the proper helper
    const session = await getAdminSession(req);
    if (!session || !session.admin?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminId = session.admin.id;
    const body = await req.json();
    const { notification_id, mark_all_read } = body;

    if (mark_all_read) {
      // Mark all notifications as read
      await sql`
        UPDATE admin_notifications
        SET is_read = true
        WHERE admin_id = ${adminId}
        AND is_read = false
      `;

      return Response.json({
        success: true,
        message: "All notifications marked as read",
      });
    } else if (notification_id) {
      // Mark specific notification as read
      const result = await sql`
        UPDATE admin_notifications
        SET is_read = true
        WHERE id = ${notification_id}
        AND admin_id = ${adminId}
        RETURNING id
      `;

      if (result.length === 0) {
        return Response.json(
          { error: "Notification not found" },
          { status: 404 },
        );
      }

      return Response.json({
        success: true,
        message: "Notification marked as read",
      });
    } else {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error updating notifications:", error);
    return Response.json(
      { error: "Failed to update notifications" },
      { status: 500 },
    );
  }
}
