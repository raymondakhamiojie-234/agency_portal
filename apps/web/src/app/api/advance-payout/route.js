import { getSession } from "@/app/api/utils/auth";
import sql from "@/app/api/utils/sql";

export async function POST(req) {
  try {
    const session = await getSession(req);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { requested_amount, fee_percentage, fee_amount, net_amount } = body;

    // Get creator profile
    const profiles = await sql`
      SELECT id FROM creator_profiles 
      WHERE user_id = ${session.user.id}
    `;

    if (profiles.length === 0) {
      return Response.json(
        { error: "Creator profile not found" },
        { status: 404 },
      );
    }

    const creatorId = profiles[0].id;

    // Get total earnings
    const earningsResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as total_earnings
      FROM earnings
      WHERE creator_id = ${creatorId}
    `;

    const totalEarnings = parseFloat(earningsResult[0].total_earnings);
    const maxLoan = totalEarnings * 0.5;

    // Validate loan amount
    if (requested_amount > maxLoan) {
      return Response.json(
        {
          error: `Loan amount cannot exceed 50% of your earnings ($${maxLoan.toFixed(2)})`,
        },
        { status: 400 },
      );
    }

    if (requested_amount <= 0) {
      return Response.json({ error: "Invalid loan amount" }, { status: 400 });
    }

    // Check for existing pending loans
    const existingLoans = await sql`
      SELECT id FROM advance_payouts
      WHERE creator_id = ${creatorId}
      AND status IN ('Pending', 'Approved')
      AND outstanding_balance > 0
    `;

    if (existingLoans.length > 0) {
      return Response.json(
        {
          error:
            "You already have an outstanding loan. Please repay it before requesting a new one.",
        },
        { status: 400 },
      );
    }

    // Create advance payout request
    const result = await sql`
      INSERT INTO advance_payouts (
        creator_id,
        requested_amount,
        fee_percentage,
        fee_amount,
        net_amount,
        status,
        outstanding_balance,
        repayment_progress
      ) VALUES (
        ${creatorId},
        ${requested_amount},
        ${fee_percentage},
        ${fee_amount},
        ${net_amount},
        'Pending',
        ${requested_amount},
        0
      )
      RETURNING id
    `;

    const loanId = result[0].id;

    // Get creator details for notification
    const creatorDetails = await sql`
      SELECT cp.full_name, cp.brand_name, au.email
      FROM creator_profiles cp
      LEFT JOIN auth_users au ON cp.user_id = au.id
      WHERE cp.id = ${creatorId}
    `;

    const creatorName = creatorDetails[0]?.full_name || "Unknown Creator";
    const creatorEmail = creatorDetails[0]?.email || "";

    // Notify all admins about the new loan request
    const admins = await sql`
      SELECT id FROM admin_users WHERE is_active = true
    `;

    for (const admin of admins) {
      await sql`
        INSERT INTO admin_notifications (
          admin_id,
          title,
          message,
          notification_type,
          related_id,
          related_type
        ) VALUES (
          ${admin.id},
          'New Loan Request',
          ${`${creatorName} (${creatorEmail}) has requested a loan of $${parseFloat(requested_amount).toFixed(2)}`},
          'loan_request',
          ${loanId},
          'advance_payout'
        )
      `;
    }

    return Response.json({
      success: true,
      message: "Loan request submitted successfully",
      loan_id: loanId,
    });
  } catch (error) {
    console.error("Error creating advance payout:", error);
    return Response.json(
      { error: "Failed to create loan request" },
      { status: 500 },
    );
  }
}

export async function GET(req) {
  try {
    const session = await getSession(req);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get creator profile
    const profiles = await sql`
      SELECT id FROM creator_profiles 
      WHERE user_id = ${session.user.id}
    `;

    if (profiles.length === 0) {
      return Response.json(
        { error: "Creator profile not found" },
        { status: 404 },
      );
    }

    const creatorId = profiles[0].id;

    // Get all advance payouts for this creator
    const loans = await sql`
      SELECT 
        id,
        requested_amount,
        fee_percentage,
        fee_amount,
        net_amount,
        status,
        outstanding_balance,
        repayment_progress,
        disbursed_at,
        created_at
      FROM advance_payouts
      WHERE creator_id = ${creatorId}
      ORDER BY created_at DESC
    `;

    return Response.json({ loans });
  } catch (error) {
    console.error("Error fetching advance payouts:", error);
    return Response.json({ error: "Failed to fetch loans" }, { status: 500 });
  }
}
