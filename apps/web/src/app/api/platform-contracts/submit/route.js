import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/auth";
import { notifyPlatformContractSubmitted } from "@/app/api/utils/admin-notifications";

// POST - Submit a contract for review (Draft -> Pending)
export async function POST(request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user;
    const body = await request.json();
    const { contract_id } = body;

    if (!contract_id) {
      return Response.json(
        { error: "Contract ID is required" },
        { status: 400 },
      );
    }

    // Get creator profile
    const creatorProfile = await sql`
      SELECT id, full_name FROM creator_profiles WHERE user_id = ${user.id}
    `;

    if (creatorProfile.length === 0) {
      return Response.json(
        { error: "Creator profile not found" },
        { status: 404 },
      );
    }

    const creatorId = creatorProfile[0].id;
    const creatorName = creatorProfile[0].full_name;

    // Get the contract
    const contract = await sql`
      SELECT * FROM platform_contracts
      WHERE id = ${contract_id} AND creator_id = ${creatorId}
    `;

    if (contract.length === 0) {
      return Response.json({ error: "Contract not found" }, { status: 404 });
    }

    // Only allow submission if Draft
    if (contract[0].status !== "Draft") {
      return Response.json(
        {
          error: "Can only submit contracts in Draft status",
        },
        { status: 403 },
      );
    }

    // Update status to Pending
    const updatedContract = await sql`
      UPDATE platform_contracts
      SET status = 'Pending', updated_at = NOW()
      WHERE id = ${contract_id} AND creator_id = ${creatorId}
      RETURNING *
    `;

    // Send admin notification about platform contract submission
    try {
      await notifyPlatformContractSubmitted(
        updatedContract[0].id,
        creatorName,
        contract[0].platform,
      );
    } catch (notifError) {
      console.error("Failed to send admin notification:", notifError);
      // Don't fail the request if notification fails
    }

    return Response.json({
      message: "Contract submitted for review successfully",
      contract: updatedContract[0],
    });
  } catch (error) {
    console.error("Error submitting contract:", error);
    return Response.json(
      { error: "Failed to submit contract" },
      { status: 500 },
    );
  }
}
