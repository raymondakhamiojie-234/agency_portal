import sql from "@/app/api/utils/sql";
import { getAdminSession } from "@/app/api/utils/auth";

// POST - Reject a platform contract
export async function POST(request, { params }) {
  try {
    const session = await getAdminSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { reason } = body;

    if (!reason) {
      return Response.json(
        { error: "Rejection reason is required" },
        { status: 400 },
      );
    }

    // Update contract status to Rejected
    const updatedContract = await sql`
      UPDATE platform_contracts
      SET 
        status = 'Rejected',
        rejection_reason = ${reason},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (updatedContract.length === 0) {
      return Response.json({ error: "Contract not found" }, { status: 404 });
    }

    return Response.json({
      message: "Contract rejected successfully",
      contract: updatedContract[0],
    });
  } catch (error) {
    console.error("Error rejecting contract:", error);
    return Response.json(
      { error: "Failed to reject contract" },
      { status: 500 },
    );
  }
}
