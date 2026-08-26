import { getSession } from "@/app/api/utils/auth";
import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const session = await getSession(request);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get creator profile
    const profileResult = await sql`
      SELECT id, full_name, page_name 
      FROM creator_profiles 
      WHERE user_id = ${session.user.id}
    `;

    if (profileResult.length === 0) {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    const creatorId = profileResult[0].id;

    // Get contract info for revenue share percentage
    const contractResult = await sql`
      SELECT revenue_share_percentage, duration_years, status
      FROM contracts
      WHERE creator_id = ${creatorId}
      ORDER BY created_at DESC
      LIMIT 1
    `;

    const contract = contractResult.length > 0 ? contractResult[0] : null;
    const revenueSharePercentage = contract?.revenue_share_percentage || 0;
    // Client gets (100 - revenue_share_percentage)% of net earnings
    const clientPercentage = 100 - revenueSharePercentage;

    // Get all earnings with payment status
    const earningsResult = await sql`
      SELECT 
        id,
        platform,
        amount,
        earning_date,
        payout_status,
        withholding_tax,
        created_at
      FROM earnings
      WHERE creator_id = ${creatorId}
      ORDER BY earning_date DESC, created_at DESC
    `;

    // Get all payouts
    const payoutsResult = await sql`
      SELECT 
        id,
        amount,
        payout_date,
        status,
        notes,
        created_at
      FROM payouts
      WHERE creator_id = ${creatorId}
      ORDER BY payout_date DESC, created_at DESC
    `;

    // Calculate totals
    const totalEarnings = earningsResult.reduce(
      (sum, e) => sum + parseFloat(e.amount),
      0,
    );
    const totalWithholdingTax = earningsResult.reduce(
      (sum, e) => sum + parseFloat(e.withholding_tax || 0),
      0,
    );
    const netEarnings = totalEarnings - totalWithholdingTax;
    const clientEarnings = (netEarnings * clientPercentage) / 100;
    const agencyShare = (netEarnings * revenueSharePercentage) / 100;

    const totalPaid = payoutsResult
      .filter((p) => p.status === "Completed")
      .reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const totalPending = earningsResult
      .filter((e) => e.payout_status === "Pending")
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);

    // Calculate yearly, current month, and previous month earnings
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousMonthYear =
      currentMonth === 0 ? currentYear - 1 : currentYear;

    const yearlyEarnings = earningsResult
      .filter((e) => {
        const earningDate = new Date(e.earning_date);
        return earningDate.getFullYear() === currentYear;
      })
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);

    const yearlyWithholdingTax = earningsResult
      .filter((e) => {
        const earningDate = new Date(e.earning_date);
        return earningDate.getFullYear() === currentYear;
      })
      .reduce((sum, e) => sum + parseFloat(e.withholding_tax || 0), 0);

    const yearlyNetEarnings = yearlyEarnings - yearlyWithholdingTax;
    const yearlyClientEarnings = (yearlyNetEarnings * clientPercentage) / 100;

    const currentMonthEarnings = earningsResult
      .filter((e) => {
        const earningDate = new Date(e.earning_date);
        return (
          earningDate.getFullYear() === currentYear &&
          earningDate.getMonth() === currentMonth
        );
      })
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);

    const currentMonthWithholdingTax = earningsResult
      .filter((e) => {
        const earningDate = new Date(e.earning_date);
        return (
          earningDate.getFullYear() === currentYear &&
          earningDate.getMonth() === currentMonth
        );
      })
      .reduce((sum, e) => sum + parseFloat(e.withholding_tax || 0), 0);

    const currentMonthNetEarnings =
      currentMonthEarnings - currentMonthWithholdingTax;
    const currentMonthClientEarnings =
      (currentMonthNetEarnings * clientPercentage) / 100;

    const previousMonthEarnings = earningsResult
      .filter((e) => {
        const earningDate = new Date(e.earning_date);
        return (
          earningDate.getFullYear() === previousMonthYear &&
          earningDate.getMonth() === previousMonth
        );
      })
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);

    const previousMonthWithholdingTax = earningsResult
      .filter((e) => {
        const earningDate = new Date(e.earning_date);
        return (
          earningDate.getFullYear() === previousMonthYear &&
          earningDate.getMonth() === previousMonth
        );
      })
      .reduce((sum, e) => sum + parseFloat(e.withholding_tax || 0), 0);

    const previousMonthNetEarnings =
      previousMonthEarnings - previousMonthWithholdingTax;
    const previousMonthClientEarnings =
      (previousMonthNetEarnings * clientPercentage) / 100;

    // Calculate percentage change based on client earnings
    const percentageChange =
      previousMonthClientEarnings > 0
        ? ((currentMonthClientEarnings - previousMonthClientEarnings) /
            previousMonthClientEarnings) *
          100
        : currentMonthClientEarnings > 0
          ? 100
          : 0;

    // Determine remark with adjusted thresholds
    let remark = {
      message: "",
      type: "", // success, warning, info
      shouldContactSupport: false,
    };

    if (currentMonthClientEarnings === 0 && previousMonthClientEarnings === 0) {
      remark = {
        message: "No earnings recorded yet. Contact support to get started!",
        type: "info",
        shouldContactSupport: true,
      };
    } else if (
      currentMonthClientEarnings === 0 &&
      previousMonthClientEarnings > 0
    ) {
      remark = {
        message:
          "Your earnings dropped to $0 this month. Please contact support immediately!",
        type: "warning",
        shouldContactSupport: true,
      };
    } else if (percentageChange < -10) {
      remark = {
        message: `Earnings decreased by ${Math.abs(percentageChange).toFixed(1)}%. Consider reaching out to support for optimization tips.`,
        type: "warning",
        shouldContactSupport: true,
      };
    } else if (percentageChange > 15) {
      remark = {
        message: `Excellent! Earnings increased by ${percentageChange.toFixed(1)}%. Keep up the great work!`,
        type: "success",
        shouldContactSupport: false,
      };
    } else if (percentageChange > 0) {
      remark = {
        message: `Good progress! Earnings increased by ${percentageChange.toFixed(1)}%. Keep it up!`,
        type: "success",
        shouldContactSupport: false,
      };
    } else if (percentageChange < 0) {
      remark = {
        message: `Earnings decreased by ${Math.abs(percentageChange).toFixed(1)}%. Let's work on improving this!`,
        type: "info",
        shouldContactSupport: true,
      };
    } else {
      remark = {
        message: "Earnings remained steady. Keep up the consistent work!",
        type: "info",
        shouldContactSupport: false,
      };
    }

    // Get advance payouts for loan refunded tracking
    const advancesResult = await sql`
      SELECT 
        id,
        requested_amount,
        outstanding_balance,
        repayment_progress,
        status
      FROM advance_payouts
      WHERE creator_id = ${creatorId}
      ORDER BY created_at DESC
    `;

    return Response.json({
      success: true,
      data: {
        earnings: earningsResult,
        payouts: payoutsResult,
        advances: advancesResult,
        contract: contract,
        totals: {
          totalEarnings: totalEarnings.toFixed(2),
          totalWithholdingTax: totalWithholdingTax.toFixed(2),
          totalPaid: totalPaid.toFixed(2),
          totalPending: totalPending.toFixed(2),
          netEarnings: netEarnings.toFixed(2),
          clientEarnings: clientEarnings.toFixed(2),
          agencyShare: agencyShare.toFixed(2),
          yearlyEarnings: yearlyEarnings.toFixed(2),
          yearlyClientEarnings: yearlyClientEarnings.toFixed(2),
          currentMonthEarnings: currentMonthEarnings.toFixed(2),
          currentMonthClientEarnings: currentMonthClientEarnings.toFixed(2),
          previousMonthEarnings: previousMonthEarnings.toFixed(2),
          previousMonthClientEarnings: previousMonthClientEarnings.toFixed(2),
          percentageChange: percentageChange.toFixed(2),
          revenueSharePercentage: revenueSharePercentage,
          clientPercentage: clientPercentage,
        },
        remark: remark,
      },
    });
  } catch (error) {
    console.error("Finance API Error:", error);
    return Response.json(
      { error: "Failed to fetch finance data" },
      { status: 500 },
    );
  }
}
