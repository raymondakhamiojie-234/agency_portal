import sql from "@/app/api/utils/sql";
import { getSession, getAdminSession } from "@/app/api/utils/auth";
import { hash } from "argon2";

export async function POST(request) {
  try {
    // Check admin authorization
    const session = await getSession(request);
    const adminSession = await getAdminSession(request);

    const isAuthorized =
      session?.user?.isAdmin === true || adminSession?.admin?.id;

    if (!isAuthorized) {
      return Response.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    // Read file content
    const buffer = await file.arrayBuffer();
    const content = Buffer.from(buffer).toString("utf-8");

    // Parse CSV
    const rows = parseCSV(content);

    if (rows.length === 0) {
      return Response.json({ error: "No data found in file" }, { status: 400 });
    }

    // Get headers and normalize
    const headers = rows[0].map((h) => h.toLowerCase().trim());
    console.log("CSV Headers:", headers);

    // Required: page_name, email
    // Optional: full_name, primary_platform, phone_number, country
    const hasPageName = headers.includes("page_name");
    const hasEmail = headers.includes("email");

    if (!hasPageName || !hasEmail) {
      return Response.json(
        {
          error: `Missing required columns. Found: ${headers.join(", ")}. Required: page_name, email`,
        },
        { status: 400 },
      );
    }

    // Process data rows
    const dataRows = rows
      .slice(1)
      .filter((row) => row.some((cell) => cell.trim()));
    let creatorsAdded = 0;
    let creatorsSkipped = 0;
    const errors = [];

    console.log(`Processing ${dataRows.length} creators...`);

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      try {
        // Get values
        const getValue = (possibleNames) => {
          for (const name of possibleNames) {
            const idx = headers.indexOf(name.toLowerCase());
            if (idx !== -1 && row[idx]) {
              return row[idx].trim();
            }
          }
          return null;
        };

        const pageName = getValue(["page_name", "pagename"]);
        const email = getValue(["email"]);
        const fullName =
          getValue(["full_name", "fullname", "name"]) || pageName;
        const primaryPlatform =
          getValue(["primary_platform", "platform"]) || "Facebook";
        const phoneNumber = getValue(["phone_number", "phone"]);
        const country = getValue(["country"]);

        if (!pageName || !email) {
          errors.push(`Row ${i + 2}: Missing page_name or email`);
          continue;
        }

        // Check if creator already exists by email or page_name
        const existing = await sql`
          SELECT cp.id, cp.page_name, au.email
          FROM creator_profiles cp
          JOIN auth_users au ON cp.user_id = au.id
          WHERE LOWER(au.email) = LOWER(${email})
             OR LOWER(cp.page_name) = LOWER(${pageName})
        `;

        if (existing.length > 0) {
          console.log(`Skipping ${pageName} - already exists`);
          creatorsSkipped++;
          continue;
        }

        // Generate a temporary password (they'll need to reset it)
        const tempPassword = await hash("TempPassword123!");

        // Create auth_user
        const userResult = await sql`
          INSERT INTO auth_users (email, name)
          VALUES (${email}, ${fullName})
          RETURNING id
        `;
        const userId = userResult[0].id;

        // Create auth_account with password
        await sql`
          INSERT INTO auth_accounts ("userId", type, provider, "providerAccountId", password)
          VALUES (${userId}, 'credentials', 'email', ${email}, ${tempPassword})
        `;

        // Create creator_profile
        await sql`
          INSERT INTO creator_profiles (
            user_id, 
            full_name, 
            page_name, 
            primary_platform,
            phone_number,
            country,
            account_status
          )
          VALUES (
            ${userId},
            ${fullName},
            ${pageName},
            ${primaryPlatform},
            ${phoneNumber},
            ${country},
            'Active'
          )
        `;

        creatorsAdded++;
        console.log(`✓ Created creator: ${pageName} (${email})`);
      } catch (err) {
        console.error(`Error processing row ${i + 2}:`, err);
        errors.push(`Row ${i + 2}: ${err.message}`);
      }
    }

    return Response.json({
      success: creatorsAdded > 0,
      creatorsAdded,
      creatorsSkipped,
      totalRows: dataRows.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully added ${creatorsAdded} creators${creatorsSkipped > 0 ? ` (${creatorsSkipped} already exist)` : ""}${errors.length > 0 ? `. ${errors.length} errors encountered.` : ""}`,
    });
  } catch (err) {
    console.error("POST /api/admin/creators/bulk-import error", err);
    return Response.json(
      { error: "Failed to process import", details: err.message },
      { status: 500 },
    );
  }
}

function parseCSV(content) {
  const lines = content.split("\n").filter((line) => line.trim());
  return lines.map((line) => {
    const values = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    values.push(current.trim());
    return values;
  });
}
