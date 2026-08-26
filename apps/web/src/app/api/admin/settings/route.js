import sql from "@/app/api/utils/sql";
import { getAdminSession } from "@/app/api/utils/auth";

// GET - Fetch admin settings
export async function GET(request) {
  try {
    const session = await getAdminSession(request);
    if (!session || !session.admin?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await sql`
      SELECT * FROM admin_settings
      ORDER BY setting_key
    `;

    return Response.json({ settings });
  } catch (err) {
    console.error("GET /api/admin/settings error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT - Update admin settings
export async function PUT(request) {
  try {
    const session = await getAdminSession(request);
    if (!session || !session.admin?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Update all settings
    const settingsToUpdate = [
      { key: "default_revenue_share", value: body.default_revenue_share },
      {
        key: "default_contract_duration",
        value: body.default_contract_duration,
      },
      { key: "withholding_tax_rate", value: body.withholding_tax_rate },
      { key: "advance_fee_percentage", value: body.advance_fee_percentage },
    ];

    for (const setting of settingsToUpdate) {
      await sql`
        INSERT INTO admin_settings (setting_key, setting_value, updated_at)
        VALUES (${setting.key}, ${setting.value}, NOW())
        ON CONFLICT (setting_key)
        DO UPDATE SET 
          setting_value = ${setting.value},
          updated_at = NOW()
      `;
    }

    return Response.json({
      message: "Settings updated successfully",
    });
  } catch (err) {
    console.error("PUT /api/admin/settings error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
