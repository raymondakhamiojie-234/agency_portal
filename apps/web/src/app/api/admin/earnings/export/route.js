import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/auth";

export async function GET(request) {
  try {
    const session = await getSession(request);

    if (!session || !session.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const users = await sql`
      SELECT is_admin FROM auth_users WHERE email = ${session.user.email}
    `;

    if (users.length === 0 || !users[0].is_admin) {
      return Response.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 },
      );
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get("creator_id");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const platform = searchParams.get("platform");

    // Build query with filters
    let query = `
      SELECT 
        au.email as creator_email,
        cp.full_name,
        cp.page_name,
        e.platform,
        e.amount,
        e.earning_date,
        e.withholding_tax,
        e.payout_status,
        e.created_at
      FROM earnings e
      JOIN creator_profiles cp ON e.creator_id = cp.id
      JOIN auth_users au ON cp.user_id = au.id
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (creatorId) {
      query += ` AND e.creator_id = $${paramIndex}`;
      params.push(parseInt(creatorId));
      paramIndex++;
    }

    if (startDate) {
      query += ` AND e.earning_date >= $${paramIndex}`;
      params.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      query += ` AND e.earning_date <= $${paramIndex}`;
      params.push(endDate);
      paramIndex++;
    }

    if (platform) {
      query += ` AND e.platform = $${paramIndex}`;
      params.push(platform);
      paramIndex++;
    }

    query += ` ORDER BY e.earning_date DESC, e.created_at DESC`;

    const earnings = await sql(query, params);

    // Generate CSV
    const headers = [
      "Creator Email",
      "Full Name",
      "Page Name",
      "Platform",
      "Amount",
      "Earning Date",
      "Withholding Tax",
      "Payout Status",
      "Created At",
    ];

    let csvContent = headers.join(",") + "\n";

    earnings.forEach((earning) => {
      const row = [
        earning.creator_email || "",
        earning.full_name || "",
        earning.page_name || "",
        earning.platform || "",
        earning.amount || "0",
        earning.earning_date || "",
        earning.withholding_tax || "0",
        earning.payout_status || "",
        earning.created_at ? new Date(earning.created_at).toISOString() : "",
      ];

      // Escape any commas or quotes in the data
      const escapedRow = row.map((field) => {
        const stringField = String(field);
        if (
          stringField.includes(",") ||
          stringField.includes('"') ||
          stringField.includes("\n")
        ) {
          return `"${stringField.replace(/"/g, '""')}"`;
        }
        return stringField;
      });

      csvContent += escapedRow.join(",") + "\n";
    });

    // Return CSV file
    return new Response(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="earnings_export_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (err) {
    console.error("GET /api/admin/earnings/export error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
