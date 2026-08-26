import sql from "@/app/api/utils/sql";
import { getAdminSession } from "@/app/api/utils/auth";

// GET - Fetch audit log entries
export async function GET(request) {
  try {
    const session = await getAdminSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const targetType = searchParams.get("target_type");
    const limit = parseInt(searchParams.get("limit") || "50");

    let queryText = `
      SELECT * FROM marketplace_audit_log
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (targetType) {
      queryText += ` AND target_type = $${paramIndex}`;
      params.push(targetType);
      paramIndex++;
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${paramIndex}`;
    params.push(limit);

    const logs = await sql(queryText, params);

    return Response.json({ logs });
  } catch (error) {
    console.error("Error fetching audit log:", error);
    return Response.json(
      { error: "Failed to fetch audit log" },
      { status: 500 },
    );
  }
}

// POST - Create an audit log entry
export async function POST(request) {
  try {
    const session = await getAdminSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminId = session.admin.id;
    const body = await request.json();
    const { action_type, target_type, target_id, details } = body;

    if (!action_type || !target_type || !target_id) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const newLog = await sql`
      INSERT INTO marketplace_audit_log (
        admin_id,
        action_type,
        target_type,
        target_id,
        details
      ) VALUES (
        ${adminId},
        ${action_type},
        ${target_type},
        ${target_id},
        ${details ? JSON.stringify(details) : null}
      )
      RETURNING *
    `;

    return Response.json({ log: newLog[0] });
  } catch (error) {
    console.error("Error creating audit log entry:", error);
    return Response.json(
      { error: "Failed to create audit log entry" },
      { status: 500 },
    );
  }
}
