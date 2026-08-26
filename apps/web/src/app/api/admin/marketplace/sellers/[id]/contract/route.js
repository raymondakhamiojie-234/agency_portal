import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/auth";

// PUT - Admin: Approve or revoke seller contract
export async function PUT(request, { params }) {
  try {
    const session = await getSession(request);

    if (!session?.user?.isAdmin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { role, action } = body; // action: 'approve' or 'revoke'

    if (!role || !["creator", "partner", "client"].includes(role)) {
      return Response.json({ error: "Invalid role" }, { status: 400 });
    }

    if (!action || !["approve", "revoke"].includes(action)) {
      return Response.json(
        { error: "Invalid action. Must be 'approve' or 'revoke'" },
        { status: 400 },
      );
    }

    let result;

    if (action === "approve") {
      if (role === "creator") {
        result = await sql`
          UPDATE creator_profiles 
          SET 
            seller_contract_signed = true,
            seller_contract_signed_at = NOW(),
            seller_contract_revoked = false,
            seller_contract_revoked_at = NULL,
            seller_contract_revoked_by = NULL
          WHERE id = ${id}
          RETURNING *
        `;
      } else if (role === "partner") {
        result = await sql`
          UPDATE partners 
          SET 
            seller_contract_signed = true,
            seller_contract_signed_at = NOW(),
            seller_contract_revoked = false,
            seller_contract_revoked_at = NULL,
            seller_contract_revoked_by = NULL
          WHERE id = ${id}
          RETURNING *
        `;
      } else {
        result = await sql`
          UPDATE auth_users 
          SET 
            seller_contract_signed = true,
            seller_contract_signed_at = NOW(),
            seller_contract_revoked = false,
            seller_contract_revoked_at = NULL,
            seller_contract_revoked_by = NULL
          WHERE id = ${id}
          RETURNING *
        `;
      }
    } else {
      // Revoke
      if (role === "creator") {
        result = await sql`
          UPDATE creator_profiles 
          SET 
            seller_contract_revoked = true,
            seller_contract_revoked_at = NOW(),
            seller_contract_revoked_by = ${session.user.id}
          WHERE id = ${id}
          RETURNING *
        `;
      } else if (role === "partner") {
        result = await sql`
          UPDATE partners 
          SET 
            seller_contract_revoked = true,
            seller_contract_revoked_at = NOW(),
            seller_contract_revoked_by = ${session.user.id}
          WHERE id = ${id}
          RETURNING *
        `;
      } else {
        result = await sql`
          UPDATE auth_users 
          SET 
            seller_contract_revoked = true,
            seller_contract_revoked_at = NOW(),
            seller_contract_revoked_by = ${session.user.id}
          WHERE id = ${id}
          RETURNING *
        `;
      }

      // Suspend all active listings from this seller
      if (role === "creator" || role === "partner") {
        await sql`
          UPDATE marketplace_listings 
          SET status = 'suspended'
          WHERE seller_id = ${id} AND seller_role = ${role} AND status = 'approved'
        `;
      } else {
        await sql`
          UPDATE marketplace_listings 
          SET status = 'suspended'
          WHERE seller_id = ${id} AND seller_role = 'client' AND status = 'approved'
        `;
      }
    }

    // Log the action
    await sql`
      INSERT INTO marketplace_audit_log (
        admin_id,
        action_type,
        target_type,
        target_id,
        details
      ) VALUES (
        ${session.user.id},
        ${action === "approve" ? "contract_approved" : "contract_revoked"},
        ${role},
        ${id},
        ${JSON.stringify({ action, role })}
      )
    `;

    return Response.json({
      message:
        action === "approve"
          ? "Seller contract approved successfully"
          : "Seller contract revoked successfully. All active listings have been suspended.",
      seller: result[0],
    });
  } catch (error) {
    console.error("Error updating contract:", error);
    return Response.json(
      { error: "Failed to update contract" },
      { status: 500 },
    );
  }
}
