import sql from "@/app/api/utils/sql";
import { getAdminSession } from "@/app/api/utils/auth";

export async function PATCH(req, { params }) {
  try {
    // Check admin authentication using the proper helper
    const session = await getAdminSession(req);
    if (!session || !session.admin?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const {
      status,
      requested_amount,
      fee_percentage,
      fee_amount,
      net_amount,
      outstanding_balance,
      repayment_progress,
    } = body;

    // Build update query based on provided fields
    const updates = [];
    const values = [];

    if (status !== undefined) {
      updates.push(`status = $${updates.length + 1}`);
      values.push(status);

      // If status is being set to Disbursed, set disbursed_at
      if (status === "Disbursed") {
        updates.push(`disbursed_at = NOW()`);
      }
    }

    if (requested_amount !== undefined) {
      updates.push(`requested_amount = $${updates.length + 1}`);
      values.push(requested_amount);
    }

    if (fee_percentage !== undefined) {
      updates.push(`fee_percentage = $${updates.length + 1}`);
      values.push(fee_percentage);
    }

    if (fee_amount !== undefined) {
      updates.push(`fee_amount = $${updates.length + 1}`);
      values.push(fee_amount);
    }

    if (net_amount !== undefined) {
      updates.push(`net_amount = $${updates.length + 1}`);
      values.push(net_amount);
    }

    if (outstanding_balance !== undefined) {
      updates.push(`outstanding_balance = $${updates.length + 1}`);
      values.push(outstanding_balance);
    }

    if (repayment_progress !== undefined) {
      updates.push(`repayment_progress = $${updates.length + 1}`);
      values.push(repayment_progress);
    }

    updates.push(`updated_at = NOW()`);

    if (updates.length === 1) {
      // Only updated_at, no actual changes
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    // Construct and execute the update query
    values.push(id);
    const updateQuery = `
      UPDATE advance_payouts 
      SET ${updates.join(", ")}
      WHERE id = $${values.length}
      RETURNING *
    `;

    const result = await sql(updateQuery, values);

    if (result.length === 0) {
      return Response.json(
        { error: "Advance payout not found" },
        { status: 404 },
      );
    }

    // If status changed to Approved or Disbursed, send notification to creator
    if (status === "Approved" || status === "Disbursed") {
      const loan = result[0];
      const notificationTitle =
        status === "Approved" ? "Loan Request Approved" : "Loan Disbursed";
      const notificationMessage =
        status === "Approved"
          ? `Your loan request for $${parseFloat(loan.requested_amount).toFixed(2)} has been approved and will be disbursed shortly.`
          : `Your loan of $${parseFloat(loan.net_amount).toFixed(2)} has been disbursed to your account.`;

      await sql`
        INSERT INTO notifications (
          creator_id,
          title,
          message,
          notification_type
        ) VALUES (
          ${loan.creator_id},
          ${notificationTitle},
          ${notificationMessage},
          'agency'
        )
      `;
    }

    return Response.json({
      success: true,
      loan: result[0],
    });
  } catch (error) {
    console.error("Error updating advance payout:", error);
    return Response.json(
      { error: "Failed to update advance payout" },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    // Check admin authentication using the proper helper
    const session = await getAdminSession(req);
    if (!session || !session.admin?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Delete the advance payout
    const result = await sql`
      DELETE FROM advance_payouts
      WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return Response.json(
        { error: "Advance payout not found" },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      message: "Advance payout deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting advance payout:", error);
    return Response.json(
      { error: "Failed to delete advance payout" },
      { status: 500 },
    );
  }
}
