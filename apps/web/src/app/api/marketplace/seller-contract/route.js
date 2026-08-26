import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/auth";

// GET - Authenticated: Get seller contract status
export async function GET(request) {
  try {
    const session = await getSession(request);

    if (!session?.user) {
      return Response.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");

    if (!role || !["creator", "partner", "client"].includes(role)) {
      return Response.json(
        { error: "Invalid role specified" },
        { status: 400 },
      );
    }

    let contractStatus = {
      signed: false,
      signedAt: null,
      revoked: false,
      revokedAt: null,
      canList: false,
    };

    if (role === "creator") {
      const profile = await sql`
        SELECT 
          seller_contract_signed,
          seller_contract_signed_at,
          seller_contract_revoked,
          seller_contract_revoked_at
        FROM creator_profiles 
        WHERE user_id = ${session.user.id}
      `;

      if (profile.length > 0) {
        contractStatus = {
          signed: profile[0].seller_contract_signed || false,
          signedAt: profile[0].seller_contract_signed_at,
          revoked: profile[0].seller_contract_revoked || false,
          revokedAt: profile[0].seller_contract_revoked_at,
          canList:
            profile[0].seller_contract_signed &&
            !profile[0].seller_contract_revoked,
        };
      }
    } else if (role === "partner") {
      const profile = await sql`
        SELECT 
          seller_contract_signed,
          seller_contract_signed_at,
          seller_contract_revoked,
          seller_contract_revoked_at
        FROM partners 
        WHERE email = ${session.user.email}
      `;

      if (profile.length > 0) {
        contractStatus = {
          signed: profile[0].seller_contract_signed || false,
          signedAt: profile[0].seller_contract_signed_at,
          revoked: profile[0].seller_contract_revoked || false,
          revokedAt: profile[0].seller_contract_revoked_at,
          canList:
            profile[0].seller_contract_signed &&
            !profile[0].seller_contract_revoked,
        };
      }
    } else {
      const profile = await sql`
        SELECT 
          seller_contract_signed,
          seller_contract_signed_at,
          seller_contract_revoked,
          seller_contract_revoked_at
        FROM auth_users 
        WHERE id = ${session.user.id}
      `;

      if (profile.length > 0) {
        contractStatus = {
          signed: profile[0].seller_contract_signed || false,
          signedAt: profile[0].seller_contract_signed_at,
          revoked: profile[0].seller_contract_revoked || false,
          revokedAt: profile[0].seller_contract_revoked_at,
          canList:
            profile[0].seller_contract_signed &&
            !profile[0].seller_contract_revoked,
        };
      }
    }

    return Response.json({ contractStatus });
  } catch (error) {
    console.error("Error fetching contract status:", error);
    return Response.json(
      { error: "Failed to fetch contract status" },
      { status: 500 },
    );
  }
}

// POST - Authenticated: Sign seller contract
export async function POST(request) {
  try {
    const session = await getSession(request);

    if (!session?.user) {
      return Response.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { role, agreementConfirmed } = body;

    if (!agreementConfirmed) {
      return Response.json(
        { error: "You must confirm the agreement" },
        { status: 400 },
      );
    }

    if (!role || !["creator", "partner", "client"].includes(role)) {
      return Response.json(
        { error: "Invalid role specified" },
        { status: 400 },
      );
    }

    let updated;

    if (role === "creator") {
      updated = await sql`
        UPDATE creator_profiles 
        SET 
          seller_contract_signed = true,
          seller_contract_signed_at = NOW(),
          seller_contract_revoked = false,
          seller_contract_revoked_at = NULL,
          seller_contract_revoked_by = NULL
        WHERE user_id = ${session.user.id}
        RETURNING seller_contract_signed, seller_contract_signed_at
      `;
    } else if (role === "partner") {
      updated = await sql`
        UPDATE partners 
        SET 
          seller_contract_signed = true,
          seller_contract_signed_at = NOW(),
          seller_contract_revoked = false,
          seller_contract_revoked_at = NULL,
          seller_contract_revoked_by = NULL
        WHERE email = ${session.user.email}
        RETURNING seller_contract_signed, seller_contract_signed_at
      `;
    } else {
      updated = await sql`
        UPDATE auth_users 
        SET 
          seller_contract_signed = true,
          seller_contract_signed_at = NOW(),
          seller_contract_revoked = false,
          seller_contract_revoked_at = NULL,
          seller_contract_revoked_by = NULL
        WHERE id = ${session.user.id}
        RETURNING seller_contract_signed, seller_contract_signed_at
      `;
    }

    if (updated.length === 0) {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    return Response.json({
      message:
        "Seller contract signed successfully. You can now create marketplace listings.",
      contractStatus: {
        signed: true,
        signedAt: updated[0].seller_contract_signed_at,
        canList: true,
      },
    });
  } catch (error) {
    console.error("Error signing contract:", error);
    return Response.json({ error: "Failed to sign contract" }, { status: 500 });
  }
}
