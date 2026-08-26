import sql from "@/app/api/utils/sql";
import { getAdminSession } from "@/app/api/utils/auth";

// POST - Approve and sign a platform contract
export async function POST(request, { params }) {
  try {
    const session = await getAdminSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const admin = session.admin;

    // Update contract status to Signed
    const updatedContract = await sql`
      UPDATE platform_contracts
      SET 
        status = 'Signed',
        signed_at = NOW(),
        approved_by = ${admin.id},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (updatedContract.length === 0) {
      return Response.json({ error: "Contract not found" }, { status: 404 });
    }

    return Response.json({
      message: "Contract approved and signed successfully",
      contract: updatedContract[0],
    });
  } catch (error) {
    console.error("Error approving contract:", error);
    return Response.json(
      { error: "Failed to approve contract" },
      { status: 500 },
    );
  }
}
