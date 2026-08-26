import sql from "@/app/api/utils/sql";
import { getAdminSession } from "@/app/api/utils/auth";

// GET - Fetch all creators with their details
export async function GET(request) {
  try {
    const session = await getAdminSession(request);
    if (!session || !session.admin?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all creator profiles with their associated data
    const creators = await sql`
      SELECT 
        cp.id,
        cp.user_id,
        cp.full_name,
        cp.brand_name,
        cp.page_name,
        cp.phone_number,
        cp.primary_platform,
        cp.page_urls,
        cp.country,
        cp.account_status,
        cp.follower_count,
        cp.date_of_birth,
        cp.home_address,
        cp.bank_account_number,
        cp.bank_name,
        cp.account_name,
        cp.onboarding_completed,
        cp.onboarding_completed_at,
        cp.created_at,
        cp.updated_at,
        au.email,
        c.id as contract_id,
        c.revenue_share_percentage,
        c.status as contract_status,
        c.signed_at,
        (SELECT COUNT(*) FROM earnings WHERE creator_id = cp.id) as total_earnings_count,
        (SELECT COALESCE(SUM(amount), 0) FROM earnings WHERE creator_id = cp.id) as total_earnings_amount,
        (SELECT COUNT(*) FROM testimonials WHERE creator_id = cp.id) as testimonials_count
      FROM creator_profiles cp
      LEFT JOIN auth_users au ON cp.user_id = au.id
      LEFT JOIN contracts c ON cp.id = c.creator_id
      ORDER BY cp.created_at DESC
    `;

    return Response.json({ creators });
  } catch (err) {
    console.error("GET /api/admin/creators error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT - Update creator account status or contract percentage
export async function PUT(request) {
  try {
    const session = await getAdminSession(request);
    if (!session || !session.admin?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { creatorId, accountStatus, revenueSharePercentage } = body;

    if (!creatorId) {
      return Response.json({ error: "Missing creatorId" }, { status: 400 });
    }

    // Update account status if provided
    if (accountStatus) {
      await sql`
        UPDATE creator_profiles
        SET account_status = ${accountStatus}, updated_at = NOW()
        WHERE id = ${creatorId}
      `;
    }

    // Update revenue share percentage if provided
    if (revenueSharePercentage !== undefined) {
      const existingContract = await sql`
        SELECT id FROM contracts WHERE creator_id = ${creatorId} LIMIT 1
      `;

      if (existingContract.length > 0) {
        await sql`
          UPDATE contracts
          SET revenue_share_percentage = ${revenueSharePercentage}
          WHERE creator_id = ${creatorId}
        `;
      }
    }

    return Response.json({
      message: "Creator updated successfully",
    });
  } catch (err) {
    console.error("PUT /api/admin/creators error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
