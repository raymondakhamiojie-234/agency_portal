import sql from "@/app/api/utils/sql";
import { getAdminSession } from "@/app/api/utils/auth";

export async function GET(request) {
  try {
    const session = await getAdminSession(request);

    if (!session || !session.admin?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all contracts with creator details
    const contracts = await sql`
      SELECT 
        c.*,
        cp.full_name as creator_name,
        au.email as creator_email
      FROM contracts c
      JOIN creator_profiles cp ON c.creator_id = cp.id
      JOIN auth_users au ON cp.user_id = au.id
      ORDER BY c.created_at DESC
    `;

    return Response.json({ contracts });
  } catch (error) {
    console.error("Error fetching contracts:", error);
    return Response.json(
      { error: "Failed to fetch contracts" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const session = await getAdminSession(request);

    if (!session || !session.admin?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { contractId, durationYears, revenueSharePercentage } = body;

    if (!contractId) {
      return Response.json(
        { error: "Contract ID is required" },
        { status: 400 },
      );
    }

    // Validate inputs
    if (durationYears !== undefined) {
      const duration = parseInt(durationYears);
      if (isNaN(duration) || duration < 1 || duration > 10) {
        return Response.json(
          { error: "Duration must be between 1 and 10 years" },
          { status: 400 },
        );
      }
    }

    if (revenueSharePercentage !== undefined) {
      const revShare = parseFloat(revenueSharePercentage);
      if (isNaN(revShare) || revShare < 0 || revShare > 100) {
        return Response.json(
          { error: "Revenue share must be between 0 and 100%" },
          { status: 400 },
        );
      }
    }

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (durationYears !== undefined) {
      updates.push(`duration_years = $${paramCount}`);
      values.push(parseInt(durationYears));
      paramCount++;
    }

    if (revenueSharePercentage !== undefined) {
      updates.push(`revenue_share_percentage = $${paramCount}`);
      values.push(parseFloat(revenueSharePercentage));
      paramCount++;
    }

    if (updates.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    // Add contract ID as last parameter
    values.push(parseInt(contractId));

    const query = `
      UPDATE contracts
      SET ${updates.join(", ")}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json({ error: "Contract not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      contract: result[0],
      message: "Contract updated successfully",
    });
  } catch (error) {
    console.error("Error updating contract:", error);
    return Response.json(
      { error: error.message || "Failed to update contract" },
      { status: 500 },
    );
  }
}
