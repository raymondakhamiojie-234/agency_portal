import { getSession } from "@/app/api/utils/auth";
import sql from "@/app/api/utils/sql";
import { notifyContractSigned } from "@/app/api/utils/admin-notifications";

export async function POST(request) {
  try {
    const session = await getSession(request);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { signatureName } = body;

    if (!signatureName || !signatureName.trim()) {
      return Response.json(
        { error: "Signature name is required" },
        { status: 400 },
      );
    }

    // Get creator profile
    const profiles = await sql`
      SELECT id, full_name FROM creator_profiles WHERE user_id = ${session.user.id}
    `;

    if (profiles.length === 0) {
      return Response.json(
        {
          error:
            "Creator profile not found. Please complete your profile first.",
        },
        { status: 404 },
      );
    }

    const creatorId = profiles[0].id;
    const creatorName = profiles[0].full_name;

    // Get contract
    const contracts = await sql`
      SELECT * FROM contracts 
      WHERE creator_id = ${creatorId}
      ORDER BY created_at DESC
      LIMIT 1
    `;

    if (contracts.length === 0) {
      return Response.json({ error: "No contract found" }, { status: 404 });
    }

    const contract = contracts[0];

    if (contract.status !== "Pending Signature") {
      return Response.json(
        { error: "Contract is not available for signature" },
        { status: 400 },
      );
    }

    // Get client IP
    const forwardedFor = request.headers.get("x-forwarded-for");
    const signatureIp = forwardedFor ? forwardedFor.split(",")[0] : "unknown";

    // Use transaction to update contract, creator profile, and auth_users
    const [updatedContract] = await sql.transaction([
      sql`
        UPDATE contracts
        SET 
          status = 'Signed',
          signed_at = NOW(),
          signature_name = ${signatureName.trim()},
          signature_ip = ${signatureIp}
        WHERE id = ${contract.id}
        RETURNING *
      `,
      sql`
        UPDATE creator_profiles
        SET 
          account_status = 'Active',
          seller_contract_signed = true,
          seller_contract_signed_at = NOW(),
          updated_at = NOW()
        WHERE id = ${creatorId}
      `,
      sql`
        UPDATE auth_users
        SET 
          seller_contract_signed = true,
          seller_contract_signed_at = NOW()
        WHERE id = ${session.user.id}
      `,
    ]);

    // Send admin notification about contract signing
    try {
      await notifyContractSigned(
        contract.id,
        creatorName,
        contract.revenue_share_percentage || 0,
      );
    } catch (notifError) {
      console.error("Failed to send admin notification:", notifError);
      // Don't fail the request if notification fails
    }

    return Response.json({ contract: updatedContract[0] });
  } catch (error) {
    console.error("Error signing contract:", error);

    // Check if it's a foreign key constraint error
    if (error.message && error.message.includes("foreign key constraint")) {
      return Response.json(
        {
          error:
            "Creator profile not found. Please complete your profile first.",
        },
        { status: 400 },
      );
    }

    return Response.json({ error: "Failed to sign contract" }, { status: 500 });
  }
}
