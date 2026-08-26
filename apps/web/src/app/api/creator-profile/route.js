import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/auth";
import { notifyNewCreator } from "@/app/api/utils/admin-notifications";

export async function GET(request) {
  try {
    const session = await getSession(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const rows = await sql`
      SELECT * FROM creator_profiles WHERE user_id = ${userId} LIMIT 1
    `;

    if (rows.length === 0) {
      return Response.json({ profile: null });
    }

    return Response.json({ profile: rows[0] });
  } catch (err) {
    console.error("GET /api/creator-profile error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getSession(request);

    console.log("POST /api/creator-profile - session:", session);

    if (!session || !session.user?.id) {
      console.error("POST /api/creator-profile - No session or user ID");
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();

    console.log("POST /api/creator-profile - userId:", userId);
    console.log("POST /api/creator-profile - body:", body);

    const {
      fullName,
      brandName,
      pageName,
      phoneNumber,
      primaryPlatform,
      pageUrls,
      country,
      referralCode,
    } = body;

    if (
      !fullName ||
      !phoneNumber ||
      !primaryPlatform ||
      !pageUrls ||
      !country ||
      !pageName
    ) {
      console.error("POST /api/creator-profile - Missing fields:", {
        fullName: !!fullName,
        phoneNumber: !!phoneNumber,
        primaryPlatform: !!primaryPlatform,
        pageUrls: !!pageUrls,
        country: !!country,
        pageName: !!pageName,
      });
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if profile already exists
    const existing = await sql`
      SELECT id FROM creator_profiles WHERE user_id = ${userId} LIMIT 1
    `;

    if (existing.length > 0) {
      console.log("POST /api/creator-profile - Profile already exists");
      return Response.json(
        { error: "Profile already exists" },
        { status: 400 },
      );
    }

    // Parse URLs into an array
    const urlsArray = pageUrls
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    console.log("POST /api/creator-profile - Creating profile with:", {
      userId,
      fullName,
      pageName,
      urlsArray,
    });

    // Create profile
    const result = await sql`
      INSERT INTO creator_profiles (
        user_id, full_name, brand_name, page_name, phone_number, 
        primary_platform, page_urls, country, referral_code
      )
      VALUES (
        ${userId}, ${fullName}, ${brandName || null}, ${pageName}, ${phoneNumber},
        ${primaryPlatform}, ${urlsArray}, ${country}, ${referralCode || null}
      )
      RETURNING *
    `;

    console.log("POST /api/creator-profile - Profile created:", result[0]);

    // Send admin notification about new creator
    try {
      await notifyNewCreator(result[0].id, fullName, session.user.email);
    } catch (notifError) {
      console.error("Failed to send admin notification:", notifError);
      // Don't fail the request if notification fails
    }

    // If profile was created successfully and there's a referral code, link it to the referral
    if (result[0] && referralCode) {
      try {
        // Update partner referral with creator profile ID
        await sql`
          UPDATE partner_referrals
          SET referred_user_id = ${result[0].id}
          WHERE referred_user_email = ${session.user.email}
            AND referred_user_id IS NULL
        `;
        console.log(
          "POST /api/creator-profile - Linked profile to partner referral",
        );

        // Get the partner ID from the referral
        const referralData = await sql`
          SELECT partner_id 
          FROM partner_referrals 
          WHERE referred_user_email = ${session.user.email}
          LIMIT 1
        `;

        if (referralData.length > 0) {
          const partnerId = referralData[0].partner_id;

          // Create onboarded creator record for financial tracking
          await sql`
            INSERT INTO onboarded_creators (
              partner_id,
              creator_profile_id,
              creator_name,
              creator_email,
              contract_percentage,
              total_earnings,
              created_at,
              updated_at
            )
            VALUES (
              ${partnerId},
              ${result[0].id},
              ${fullName},
              ${session.user.email},
              20.00,
              0,
              NOW(),
              NOW()
            )
          `;

          console.log(
            "POST /api/creator-profile - Created onboarded creator record for partner:",
            partnerId,
          );
        }
      } catch (linkError) {
        console.error(
          "Failed to link profile to referral, but continuing:",
          linkError,
        );
      }
    }

    return Response.json({ profile: result[0] });
  } catch (err) {
    console.error("POST /api/creator-profile error", err);
    console.error("POST /api/creator-profile error stack:", err.stack);
    return Response.json(
      {
        error: "Internal Server Error",
        message: err.message,
        details: process.env.NODE_ENV === "development" ? err.stack : undefined,
      },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const session = await getSession(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const {
      fullName,
      brandName,
      pageName,
      phoneNumber,
      primaryPlatform,
      pageUrls,
      country,
      referralCode,
      dateOfBirth,
      homeAddress,
      bankAccountNumber,
      bankName,
      accountName,
      followerCount,
    } = body;

    // Get existing profile to check followers_set status
    const existingProfile = await sql`
      SELECT followers_set FROM creator_profiles WHERE user_id = ${userId} LIMIT 1
    `;

    if (existingProfile.length === 0) {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    const followersAlreadySet = existingProfile[0].followers_set;

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (fullName !== undefined) {
      updates.push(`full_name = $${paramCount}`);
      values.push(fullName);
      paramCount++;
    }
    if (brandName !== undefined) {
      updates.push(`brand_name = $${paramCount}`);
      values.push(brandName || null);
      paramCount++;
    }
    if (pageName !== undefined) {
      updates.push(`page_name = $${paramCount}`);
      values.push(pageName);
      paramCount++;
    }
    if (phoneNumber !== undefined) {
      updates.push(`phone_number = $${paramCount}`);
      values.push(phoneNumber);
      paramCount++;
    }
    if (primaryPlatform !== undefined) {
      updates.push(`primary_platform = $${paramCount}`);
      values.push(primaryPlatform);
      paramCount++;
    }
    if (pageUrls !== undefined) {
      // pageUrls is now already an array from the frontend
      updates.push(`page_urls = $${paramCount}`);
      values.push(pageUrls);
      paramCount++;
    }
    if (country !== undefined) {
      updates.push(`country = $${paramCount}`);
      values.push(country);
      paramCount++;
    }
    if (referralCode !== undefined) {
      updates.push(`referral_code = $${paramCount}`);
      values.push(referralCode || null);
      paramCount++;
    }
    if (dateOfBirth !== undefined) {
      updates.push(`date_of_birth = $${paramCount}`);
      values.push(dateOfBirth || null);
      paramCount++;
    }
    if (homeAddress !== undefined) {
      updates.push(`home_address = $${paramCount}`);
      values.push(homeAddress || null);
      paramCount++;
    }
    if (bankAccountNumber !== undefined) {
      updates.push(`bank_account_number = $${paramCount}`);
      values.push(bankAccountNumber || null);
      paramCount++;
    }
    if (bankName !== undefined) {
      updates.push(`bank_name = $${paramCount}`);
      values.push(bankName || null);
      paramCount++;
    }
    if (accountName !== undefined) {
      updates.push(`account_name = $${paramCount}`);
      values.push(accountName || null);
      paramCount++;
    }

    // Handle follower count - can only be set once
    if (followerCount !== undefined) {
      if (followersAlreadySet) {
        return Response.json(
          {
            error:
              "Follower count can only be set once and has already been set",
          },
          { status: 400 },
        );
      }

      const followerCountInt = parseInt(followerCount, 10);
      if (isNaN(followerCountInt) || followerCountInt < 0) {
        return Response.json(
          { error: "Invalid follower count" },
          { status: 400 },
        );
      }

      updates.push(`follower_count = $${paramCount}`);
      values.push(followerCountInt);
      paramCount++;
      updates.push(`followers_set = $${paramCount}`);
      values.push(true);
      paramCount++;
    }

    updates.push(`updated_at = NOW()`);

    if (updates.length === 1) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    const query = `
      UPDATE creator_profiles 
      SET ${updates.join(", ")}
      WHERE user_id = $${paramCount}
      RETURNING *
    `;
    values.push(userId);

    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    return Response.json({ profile: result[0] });
  } catch (err) {
    console.error("PUT /api/creator-profile error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
