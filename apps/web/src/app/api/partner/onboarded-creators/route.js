import sql from "@/app/api/utils/sql";
import { requirePartnerAuth } from "@/app/api/utils/partner-auth";

/**
 * GET /api/partner/onboarded-creators
 * Returns all onboarded creators for the authenticated partner with financial data
 */
export async function GET(request) {
  try {
    // Require authentication
    const authCheck = await requirePartnerAuth(request);
    if (authCheck.error) {
      return authCheck.response;
    }

    const partner = authCheck.partner;

    // Get all onboarded creators for this partner
    const creators = await sql`
      SELECT 
        oc.id,
        oc.creator_name,
        oc.creator_email,
        oc.contract_percentage,
        oc.total_earnings,
        oc.created_at,
        cp.account_status,
        cp.primary_platform,
        cp.page_name,
        cp.follower_count,
        (oc.total_earnings * oc.contract_percentage / 100) as partner_share
      FROM onboarded_creators oc
      LEFT JOIN creator_profiles cp ON oc.creator_profile_id = cp.id
      WHERE oc.partner_id = ${partner.id}
      ORDER BY oc.created_at DESC
    `;

    // Calculate totals
    const stats = {
      total_creators: creators.length,
      total_creator_earnings: creators.reduce(
        (sum, c) => sum + parseFloat(c.total_earnings || 0),
        0,
      ),
      total_partner_share: creators.reduce(
        (sum, c) => sum + parseFloat(c.partner_share || 0),
        0,
      ),
      average_contract_percentage:
        creators.length > 0
          ? creators.reduce(
              (sum, c) => sum + parseFloat(c.contract_percentage || 0),
              0,
            ) / creators.length
          : 0,
    };

    return Response.json({
      success: true,
      creators,
      stats,
    });
  } catch (error) {
    console.error("Error getting onboarded creators:", error);
    return Response.json(
      { error: "Failed to get onboarded creators" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/partner/onboarded-creators
 * Update contract percentage for a creator (partner can adjust revenue share)
 */
export async function PUT(request) {
  try {
    // Require authentication
    const authCheck = await requirePartnerAuth(request);
    if (authCheck.error) {
      return authCheck.response;
    }

    const partner = authCheck.partner;
    const body = await request.json();
    const { creatorId, contractPercentage } = body;

    if (!creatorId || contractPercentage === undefined) {
      return Response.json(
        { error: "Creator ID and contract percentage are required" },
        { status: 400 },
      );
    }

    // Validate contract percentage
    const percentage = parseFloat(contractPercentage);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      return Response.json(
        { error: "Contract percentage must be between 0 and 100" },
        { status: 400 },
      );
    }

    // Update the creator's contract percentage (only for this partner's creators)
    const result = await sql`
      UPDATE onboarded_creators
      SET 
        contract_percentage = ${percentage},
        updated_at = NOW()
      WHERE id = ${creatorId}
        AND partner_id = ${partner.id}
      RETURNING *
    `;

    if (result.length === 0) {
      return Response.json(
        { error: "Creator not found or unauthorized" },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      creator: result[0],
    });
  } catch (error) {
    console.error("Error updating creator contract:", error);
    return Response.json(
      { error: "Failed to update creator contract" },
      { status: 500 },
    );
  }
}
