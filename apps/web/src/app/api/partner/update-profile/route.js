import sql from "@/app/api/utils/sql";
import { getCurrentPartner } from "@/app/api/utils/partner-auth";

export async function POST(request) {
  try {
    const partner = await getCurrentPartner(request);

    if (!partner) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();

    // Extract fields that can be updated
    const {
      name,
      phone_number,
      date_of_birth,
      country,
      location,
      primary_platform,
      bank_name,
      account_number,
      account_holder_name,
      bio,
    } = body;

    // Build update query with only provided fields
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (phone_number !== undefined) {
      updates.push(`phone_number = $${paramCount++}`);
      values.push(phone_number);
    }
    if (date_of_birth !== undefined) {
      updates.push(`date_of_birth = $${paramCount++}`);
      values.push(date_of_birth || null);
    }
    if (country !== undefined) {
      updates.push(`country = $${paramCount++}`);
      values.push(country);
    }
    if (location !== undefined) {
      updates.push(`location = $${paramCount++}`);
      values.push(location);
    }
    if (primary_platform !== undefined) {
      updates.push(`primary_platform = $${paramCount++}`);
      values.push(primary_platform);
    }
    if (bank_name !== undefined) {
      updates.push(`bank_name = $${paramCount++}`);
      values.push(bank_name);
    }
    if (account_number !== undefined) {
      updates.push(`account_number = $${paramCount++}`);
      values.push(account_number);
    }
    if (account_holder_name !== undefined) {
      updates.push(`account_holder_name = $${paramCount++}`);
      values.push(account_holder_name);
    }
    if (bio !== undefined) {
      updates.push(`bio = $${paramCount++}`);
      values.push(bio);
    }

    // Always update the updated_at timestamp
    updates.push(`updated_at = NOW()`);

    if (updates.length === 1) {
      // Only updated_at, no actual changes
      return Response.json({
        success: true,
        message: "No changes to update",
      });
    }

    // Add partner ID as last parameter
    values.push(partner.id);

    const query = `
      UPDATE partners 
      SET ${updates.join(", ")} 
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json({ error: "Partner not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: "Profile updated successfully",
      partner: result[0],
    });
  } catch (error) {
    console.error("Error updating partner profile:", error);
    return Response.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
