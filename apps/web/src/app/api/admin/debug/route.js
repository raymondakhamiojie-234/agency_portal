import sql from "@/app/api/utils/sql";
import { getAdminSession } from "@/app/api/utils/auth";

export async function GET(req) {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    checks: [],
  };

  try {
    // Check 1: Database connection
    diagnostics.checks.push({
      name: "Database Connection",
      status: "testing...",
    });
    try {
      const testQuery = await sql`SELECT NOW() as current_time`;
      diagnostics.checks[0] = {
        name: "Database Connection",
        status: "✅ SUCCESS",
        result: testQuery[0],
      };
    } catch (error) {
      diagnostics.checks[0] = {
        name: "Database Connection",
        status: "❌ FAILED",
        error: error.message,
        stack: error.stack,
      };
      return Response.json(diagnostics);
    }

    // Check 2: Admin session
    diagnostics.checks.push({ name: "Admin Session", status: "testing..." });
    try {
      const session = await getAdminSession(req);

      if (!session || !session.admin) {
        diagnostics.checks[1] = {
          name: "Admin Session",
          status: "❌ NO SESSION",
          message: "No valid admin session found",
        };
      } else {
        diagnostics.checks[1] = {
          name: "Admin Session",
          status: "✅ VALID",
          adminId: session.admin.id,
          adminEmail: session.admin.email,
          adminUsername: session.admin.username,
        };
      }
    } catch (error) {
      diagnostics.checks[1] = {
        name: "Admin Session",
        status: "❌ ERROR",
        error: error.message,
        stack: error.stack,
      };
    }

    // Check 3: Advance payouts query
    diagnostics.checks.push({
      name: "Advance Payouts Query",
      status: "testing...",
    });
    try {
      const loans = await sql`
        SELECT 
          ap.id,
          ap.creator_id,
          ap.requested_amount,
          ap.fee_percentage,
          ap.fee_amount,
          ap.net_amount,
          ap.status,
          ap.outstanding_balance,
          ap.repayment_progress,
          ap.disbursed_at,
          ap.created_at,
          ap.updated_at,
          cp.full_name as creator_name,
          cp.brand_name,
          cp.phone_number,
          cp.primary_platform,
          au.email as creator_email
        FROM advance_payouts ap
        LEFT JOIN creator_profiles cp ON ap.creator_id = cp.id
        LEFT JOIN auth_users au ON cp.user_id = au.id
        ORDER BY ap.created_at DESC
        LIMIT 5
      `;

      diagnostics.checks[2] = {
        name: "Advance Payouts Query",
        status: "✅ SUCCESS",
        rowCount: loans.length,
        sample: loans[0] || null,
      };
    } catch (error) {
      diagnostics.checks[2] = {
        name: "Advance Payouts Query",
        status: "❌ FAILED",
        error: error.message,
        stack: error.stack,
      };
    }

    // Check 4: Stats query
    diagnostics.checks.push({ name: "Stats Query", status: "testing..." });
    try {
      const stats = await sql`
        SELECT 
          COUNT(*) FILTER (WHERE status = 'Pending') as pending_count,
          COUNT(*) FILTER (WHERE status = 'Approved') as approved_count,
          COUNT(*) FILTER (WHERE status = 'Disbursed') as disbursed_count,
          COALESCE(SUM(requested_amount) FILTER (WHERE status = 'Pending'), 0) as pending_amount,
          COALESCE(SUM(outstanding_balance), 0) as total_outstanding
        FROM advance_payouts
      `;

      diagnostics.checks[3] = {
        name: "Stats Query",
        status: "✅ SUCCESS",
        result: stats[0],
        resultType: typeof stats[0],
        rawResult: JSON.stringify(stats[0]),
      };
    } catch (error) {
      diagnostics.checks[3] = {
        name: "Stats Query",
        status: "❌ FAILED",
        error: error.message,
        stack: error.stack,
      };
    }

    // Check 5: Notifications query
    diagnostics.checks.push({
      name: "Notifications Query",
      status: "testing...",
    });
    try {
      const notifications = await sql`
        SELECT 
          id,
          title,
          message,
          notification_type,
          is_read,
          created_at
        FROM admin_notifications
        ORDER BY created_at DESC
        LIMIT 5
      `;

      diagnostics.checks[4] = {
        name: "Notifications Query",
        status: "✅ SUCCESS",
        rowCount: notifications.length,
        sample: notifications[0] || null,
      };
    } catch (error) {
      diagnostics.checks[4] = {
        name: "Notifications Query",
        status: "❌ FAILED",
        error: error.message,
        stack: error.stack,
      };
    }

    // Check 6: JSON serialization test
    diagnostics.checks.push({
      name: "JSON Serialization",
      status: "testing...",
    });
    try {
      const testData = {
        loans: [],
        stats: {
          pending_count: 0,
          approved_count: 0,
          pending_amount: 0,
          total_outstanding: 0,
        },
      };

      const serialized = JSON.stringify(testData);
      const deserialized = JSON.parse(serialized);

      diagnostics.checks[5] = {
        name: "JSON Serialization",
        status: "✅ SUCCESS",
        serializedLength: serialized.length,
      };
    } catch (error) {
      diagnostics.checks[5] = {
        name: "JSON Serialization",
        status: "❌ FAILED",
        error: error.message,
        stack: error.stack,
      };
    }

    return Response.json(diagnostics);
  } catch (error) {
    return Response.json(
      {
        ...diagnostics,
        criticalError: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
      },
      { status: 500 },
    );
  }
}
