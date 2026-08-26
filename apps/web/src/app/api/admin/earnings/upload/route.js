import sql from "@/app/api/utils/sql";
import { getSession, getAdminSession } from "@/app/api/utils/auth";
import { notifyEarningsUploaded } from "@/app/api/utils/admin-notifications";
import { sendEarningsNotificationEmail } from "@/app/api/utils/email";
// ── Invoice automation ──────────────────────────────────────────────────────
import {
  processInvoicesForTargets,
  buildTargetsFromEarnings,
} from "@/app/api/utils/invoice-service";

export async function POST(request) {
  try {
    // Check BOTH admin systems
    const session = await getSession(request);
    const adminSession = await getAdminSession(request);

    // Allow if either:
    // 1. User is logged in with is_admin=true, OR
    // 2. Admin is logged in via admin_users table
    const isAuthorized =
      session?.user?.isAdmin === true || adminSession?.admin?.id;

    if (!isAuthorized) {
      console.error("Unauthorized access attempt to earnings upload");
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

    console.log(
      "File uploaded:",
      file.name,
      "Size:",
      buffer.byteLength,
      "bytes",
    );

    // Parse CSV
    let rows;
    if (file.name.endsWith(".csv")) {
      rows = parseCSV(content);
    } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      return Response.json(
        { error: "Please convert Excel files to CSV format before uploading" },
        { status: 400 },
      );
    } else {
      return Response.json(
        { error: "Unsupported file format. Please use CSV." },
        { status: 400 },
      );
    }

    if (rows.length === 0) {
      return Response.json({ error: "No data found in file" }, { status: 400 });
    }

    console.log(`Parsed ${rows.length} rows from CSV`);

    // Get headers and normalize them
    const headers = rows[0].map((h) => h.toLowerCase().trim());
    console.log("CSV Headers:", headers);

    // Check for page_name
    const hasPageName =
      headers.includes("page_name") || headers.includes("pagename");

    if (!hasPageName) {
      return Response.json(
        {
          error: `Missing 'page_name' column. Your CSV should include: page_name,amount,earning_date,withholding_tax (platform column is optional)`,
        },
        { status: 400 },
      );
    }

    // Validate other required headers
    const hasAmount = headers.includes("amount");
    const hasEarningDate =
      headers.includes("earning_date") ||
      headers.includes("date") ||
      headers.includes("earningdate");
    const hasWithholdingTax =
      headers.includes("withholding_tax") ||
      headers.includes("withholdintax") ||
      headers.includes("tax");

    if (!hasAmount || !hasEarningDate || !hasWithholdingTax) {
      const missing = [];
      if (!hasAmount) missing.push("amount");
      if (!hasEarningDate) missing.push("earning_date");
      if (!hasWithholdingTax) missing.push("withholding_tax");
      return Response.json(
        {
          error: `Missing required columns: ${missing.join(", ")}. Your CSV headers: ${headers.join(", ")}`,
        },
        { status: 400 },
      );
    }

    // Get all valid page names upfront for better error messages
    const allCreators = await sql`
      SELECT id, page_name, full_name
      FROM creator_profiles
      ORDER BY page_name
    `;
    console.log(
      `Found ${allCreators.length} creators in database:`,
      allCreators.map((c) => `"${c.page_name}"`).join(", "),
    );

    // Process data rows
    const dataRows = rows
      .slice(1)
      .filter((row) => row.some((cell) => cell.trim()));
    let recordsCreated = 0;
    let recordsUpdated = 0;
    const errors = [];
    const processedCreators = new Set();

    // NEW: track per-creator earnings for emails and running totals for upload log
    const creatorEmailMap = new Map(); // creatorId -> { email, name, earnings[] }
    let totalAmountUploaded = 0;
    let totalWithholdingUploaded = 0;

    console.log(`Processing ${dataRows.length} earnings records...`);

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      try {
        // Get values by finding the index of each header
        const getValue = (possibleNames) => {
          for (const name of possibleNames) {
            const idx = headers.indexOf(name.toLowerCase().trim());
            if (idx !== -1 && idx < row.length && row[idx]) {
              return row[idx].trim();
            }
          }
          return null;
        };

        const pageName = getValue(["page_name", "pagename"]);
        const platform = getValue(["platform"]) || "Facebook"; // Extract platform or default to Facebook
        const amount = getValue(["amount"]);
        const earningDate = getValue(["earning_date", "date", "earningdate"]);
        const withholdingTax =
          getValue(["withholding_tax", "tax", "withholdintax"]) || "0";

        // Enhanced logging
        console.log(`Row ${i + 2} data:`, {
          pageName: `"${pageName}"`,
          pageNameBytes: pageName
            ? Array.from(pageName).map((c) => c.charCodeAt(0))
            : [],
          platform,
          amount,
          earningDate,
          withholdingTax,
        });

        if (!amount || !earningDate) {
          const error = `Row ${i + 2}: Missing required data (amount: ${amount || "MISSING"}, earning_date: ${earningDate || "MISSING"})`;
          console.log(error);
          errors.push(error);
          continue;
        }

        if (!pageName) {
          const error = `Row ${i + 2}: Missing page_name`;
          console.log(error);
          errors.push(error);
          continue;
        }

        // Find creator by page_name — now also fetching email via auth_users join
        console.log(
          `Searching for creator with page_name matching: "${pageName}"`,
        );
        const creators = await sql`
          SELECT cp.id, cp.page_name, cp.full_name, au.email
          FROM creator_profiles cp
          JOIN auth_users au ON cp.user_id = au.id
          WHERE LOWER(TRIM(cp.page_name)) = LOWER(TRIM(${pageName}))
        `;

        if (creators.length === 0) {
          const validNames = allCreators
            .map((c) => `"${c.page_name}"`)
            .join(", ");
          const error = `Row ${i + 2}: Creator not found with page name "${pageName}". Valid page names are: ${validNames}`;
          console.log(error);
          errors.push(error);
          continue;
        }

        const creatorId = creators[0].id;
        console.log(
          `Processing earnings for creator ID ${creatorId} (${creators[0].page_name}): $${amount}`,
        );

        // Insert earning record with the platform from CSV
        await sql`
          INSERT INTO earnings (creator_id, platform, amount, earning_date, withholding_tax, payout_status, created_at)
          VALUES (
            ${creatorId},
            ${platform},
            ${parseFloat(amount)},
            ${earningDate},
            ${parseFloat(withholdingTax)},
            'Pending',
            NOW()
          )
        `;

        recordsCreated++;
        processedCreators.add(creatorId);
        console.log(`✓ Created earning record for creator ${creatorId}`);

        // Track earnings per creator for email notifications and running totals
        if (!creatorEmailMap.has(creatorId)) {
          creatorEmailMap.set(creatorId, {
            email: creators[0].email,
            name: creators[0].full_name,
            earnings: [],
          });
        }
        creatorEmailMap.get(creatorId).earnings.push({
          platform,
          amount: parseFloat(amount),
          earning_date: earningDate,
          withholding_tax: parseFloat(withholdingTax),
        });
        totalAmountUploaded += parseFloat(amount);
        totalWithholdingUploaded += parseFloat(withholdingTax);
      } catch (err) {
        console.error(`Error processing row ${i + 2}:`, err);
        errors.push(`Row ${i + 2}: ${err.message}`);
      }
    }

    // After all earnings are inserted, update onboarded_creators total_earnings for each unique creator
    console.log(
      `Updating total_earnings for ${processedCreators.size} creators...`,
    );

    for (const creatorId of processedCreators) {
      try {
        // Calculate total earnings for this creator
        const totalResult = await sql`
          SELECT COALESCE(SUM(amount), 0) as total
          FROM earnings
          WHERE creator_id = ${creatorId}
        `;

        const totalEarnings = parseFloat(totalResult[0].total);
        console.log(`Creator ${creatorId} total earnings: $${totalEarnings}`);

        // Update onboarded_creators if this creator was onboarded via partner
        const updateResult = await sql`
          UPDATE onboarded_creators
          SET 
            total_earnings = ${totalEarnings},
            updated_at = NOW()
          WHERE creator_profile_id = ${creatorId}
          RETURNING id, partner_id, creator_name, total_earnings, contract_percentage
        `;

        if (updateResult.length > 0) {
          const updated = updateResult[0];
          const partnerShare =
            (totalEarnings * updated.contract_percentage) / 100;
          console.log(
            `✓ Updated onboarded_creator ${updated.creator_name}: Total=$${totalEarnings}, Partner Share (${updated.contract_percentage}%)=$${partnerShare.toFixed(2)}`,
          );
          recordsUpdated++;
        } else {
          console.log(
            `Note: Creator ${creatorId} not in onboarded_creators (direct signup, not via partner)`,
          );
        }
      } catch (updateError) {
        console.error(
          `Error updating totals for creator ${creatorId}:`,
          updateError,
        );
        errors.push(
          `Failed to update totals for creator ${creatorId}: ${updateError.message}`,
        );
      }
    }

    // ── Post-upload: log batch, notify admins, email creators ──────────────
    if (recordsCreated > 0) {
      const uploadedBy =
        adminSession?.admin?.full_name ||
        adminSession?.admin?.email ||
        session?.user?.email ||
        "Admin";

      // 1. Log upload batch to earnings_uploads table
      try {
        await sql`
          INSERT INTO earnings_uploads (
            filename, records_count, total_amount, withholding_tax_total,
            creators_affected, errors_count, uploaded_by, created_at
          ) VALUES (
            ${file.name},
            ${recordsCreated},
            ${totalAmountUploaded},
            ${totalWithholdingUploaded},
            ${processedCreators.size},
            ${errors.length},
            ${uploadedBy},
            NOW()
          )
        `;
        console.log(`✓ Logged upload batch to earnings_uploads`);
      } catch (logErr) {
        console.error("Failed to log upload batch:", logErr);
      }

      // 2. Send admin bell notification
      try {
        await notifyEarningsUploaded(
          recordsCreated,
          totalAmountUploaded,
          processedCreators.size,
          file.name,
          uploadedBy,
        );
      } catch (notifErr) {
        console.error("Failed to send admin notification:", notifErr);
      }

      // 3. Email each affected creator their earnings summary
      const emailPromises = [];
      for (const [, creatorData] of creatorEmailMap.entries()) {
        if (creatorData.email) {
          emailPromises.push(
            sendEarningsNotificationEmail(
              creatorData.email,
              creatorData.name,
              creatorData.earnings,
            ).catch((err) =>
              console.error(
                `Failed to send earnings email to ${creatorData.email}:`,
                err,
              ),
            ),
          );
        }
      }
      if (emailPromises.length > 0) {
        await Promise.allSettled(emailPromises);
        console.log(
          `✓ Sent earnings notification emails to ${emailPromises.length} creator(s)`,
        );
      }

      // 4. Auto-generate and send invoices for each affected creator × month
      try {
        // Build per-creator earning date sets from creatorEmailMap
        const earningDatesMap = new Map();
        for (const [creatorId, creatorData] of creatorEmailMap.entries()) {
          const dates = new Set(
            creatorData.earnings.map((e) => e.earning_date),
          );
          earningDatesMap.set(creatorId, dates);
        }
        const targets = buildTargetsFromEarnings(earningDatesMap);
        console.log(
          `Generating invoices for ${targets.length} creator-month combo(s)...`,
        );
        const invoiceResults = await processInvoicesForTargets(targets, false);
        const sent = invoiceResults.filter((r) => r.status === "sent").length;
        const skipped = invoiceResults.filter(
          (r) => r.status === "skipped",
        ).length;
        const errored = invoiceResults.filter((r) => r.status === "error");
        console.log(
          `✓ Invoices: ${sent} sent, ${skipped} skipped, ${errored.length} errors`,
        );
        errored.forEach((ie) =>
          console.error(`Invoice error (creator ${ie.creatorId}):`, ie.error),
        );
      } catch (invoiceErr) {
        // Non-fatal — upload is already recorded
        console.error("Invoice auto-generation error (non-fatal):", invoiceErr);
      }
    }
    // ────────────────────────────────────────────────────────────────────────

    console.log(
      `✓ Upload complete: ${recordsCreated} earnings created, ${recordsUpdated} creators updated, ${errors.length} errors`,
    );

    return Response.json({
      success: recordsCreated > 0,
      recordsCreated,
      recordsProcessed: recordsCreated,
      creatorsUpdated: recordsUpdated,
      totalRows: dataRows.length,
      errors: errors.length > 0 ? errors : undefined,
      message:
        recordsCreated > 0
          ? `Successfully processed ${recordsCreated} of ${dataRows.length} earnings records${errors.length > 0 ? ` (${errors.length} errors)` : ""}`
          : errors.length > 0
            ? `Failed to process any records. Check errors below.`
            : "No valid records found in file",
    });
  } catch (err) {
    console.error("POST /api/admin/earnings/upload error", err);
    return Response.json(
      { error: "Failed to process upload", details: err.message },
      { status: 500 },
    );
  }
}

function parseCSV(content) {
  const lines = content.split("\n").filter((line) => line.trim());
  return lines.map((line) => {
    // Simple CSV parser - handles basic cases
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
