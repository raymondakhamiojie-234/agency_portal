import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/auth";

// GET - Public: Browse approved marketplace listings with filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract filters
    const platform = searchParams.get("platform");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minFollowers = searchParams.get("minFollowers");
    const maxFollowers = searchParams.get("maxFollowers");
    const niche = searchParams.get("niche");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "DESC";

    // Build dynamic query
    let queryParts = [
      `SELECT * FROM marketplace_listings WHERE status = 'approved'`,
    ];
    const values = [];
    let paramCounter = 1;

    if (platform) {
      queryParts.push(`AND platform = $${paramCounter}`);
      values.push(platform);
      paramCounter++;
    }

    if (minPrice) {
      queryParts.push(`AND price >= $${paramCounter}`);
      values.push(parseFloat(minPrice));
      paramCounter++;
    }

    if (maxPrice) {
      queryParts.push(`AND price <= $${paramCounter}`);
      values.push(parseFloat(maxPrice));
      paramCounter++;
    }

    if (minFollowers) {
      queryParts.push(`AND followers_count >= $${paramCounter}`);
      values.push(parseInt(minFollowers));
      paramCounter++;
    }

    if (maxFollowers) {
      queryParts.push(`AND followers_count <= $${paramCounter}`);
      values.push(parseInt(maxFollowers));
      paramCounter++;
    }

    if (niche) {
      queryParts.push(
        `AND (niche ILIKE $${paramCounter} OR category ILIKE $${paramCounter})`,
      );
      values.push(`%${niche}%`);
      paramCounter++;
    }

    if (search) {
      queryParts.push(
        `AND (account_name ILIKE $${paramCounter} OR description ILIKE $${paramCounter})`,
      );
      values.push(`%${search}%`);
      paramCounter++;
    }

    // Add sorting
    const validSortFields = [
      "created_at",
      "price",
      "followers_count",
      "engagement_rate",
    ];
    const sortField = validSortFields.includes(sortBy) ? sortBy : "created_at";
    const order = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";
    queryParts.push(`ORDER BY ${sortField} ${order}`);

    const query = queryParts.join(" ");
    const listings = await sql(query, values);

    // Get available niches for filter
    const niches = await sql`
      SELECT DISTINCT niche 
      FROM marketplace_listings 
      WHERE status = 'approved' AND niche IS NOT NULL
      ORDER BY niche
    `;

    return Response.json({
      listings,
      niches: niches.map((n) => n.niche),
    });
  } catch (error) {
    console.error("Error fetching marketplace listings:", error);
    return Response.json(
      { error: "Failed to fetch listings" },
      { status: 500 },
    );
  }
}

// POST - Authenticated: Create new listing (creators, partners, or clients)
export async function POST(request) {
  try {
    const session = await getSession(request);

    if (!session?.user) {
      return Response.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const {
      platform,
      account_name,
      account_url,
      followers_count,
      engagement_rate,
      niche,
      category,
      price,
      description,
      seller_role,
    } = body;

    // Validate required fields
    if (
      !platform ||
      !account_name ||
      !followers_count ||
      !price ||
      !seller_role
    ) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate seller_role
    if (!["creator", "partner", "client"].includes(seller_role)) {
      return Response.json({ error: "Invalid seller role" }, { status: 400 });
    }

    // Determine seller_id based on role and CHECK CONTRACT STATUS
    let seller_id;
    let contractSigned = false;
    let contractRevoked = false;

    if (seller_role === "creator") {
      const creatorProfile = await sql`
        SELECT id, seller_contract_signed, seller_contract_revoked 
        FROM creator_profiles 
        WHERE user_id = ${session.user.id}
      `;
      if (creatorProfile.length === 0) {
        return Response.json(
          { error: "Creator profile not found" },
          { status: 404 },
        );
      }
      seller_id = creatorProfile[0].id;
      contractSigned = creatorProfile[0].seller_contract_signed || false;
      contractRevoked = creatorProfile[0].seller_contract_revoked || false;
    } else if (seller_role === "partner") {
      const partnerProfile = await sql`
        SELECT id, seller_contract_signed, seller_contract_revoked 
        FROM partners 
        WHERE email = ${session.user.email}
      `;
      if (partnerProfile.length === 0) {
        return Response.json(
          { error: "Partner profile not found" },
          { status: 404 },
        );
      }
      seller_id = partnerProfile[0].id;
      contractSigned = partnerProfile[0].seller_contract_signed || false;
      contractRevoked = partnerProfile[0].seller_contract_revoked || false;
    } else {
      // For 'client' role, use auth_users id and contract status
      const clientProfile = await sql`
        SELECT id, seller_contract_signed, seller_contract_revoked 
        FROM auth_users 
        WHERE id = ${session.user.id}
      `;
      if (clientProfile.length === 0) {
        return Response.json(
          { error: "User profile not found" },
          { status: 404 },
        );
      }
      seller_id = session.user.id;
      contractSigned = clientProfile[0].seller_contract_signed || false;
      contractRevoked = clientProfile[0].seller_contract_revoked || false;
    }

    // ENFORCE CONTRACT REQUIREMENT
    if (!contractSigned || contractRevoked) {
      return Response.json(
        {
          error:
            "You must sign your seller agreement with Falcus Media before listing assets.",
          requiresContract: true,
          contractRevoked: contractRevoked,
        },
        { status: 403 },
      );
    }

    // Create listing
    const [listing] = await sql`
      INSERT INTO marketplace_listings (
        seller_id,
        seller_role,
        platform,
        account_name,
        account_url,
        followers_count,
        engagement_rate,
        niche,
        category,
        price,
        description,
        status
      ) VALUES (
        ${seller_id},
        ${seller_role},
        ${platform},
        ${account_name},
        ${account_url || null},
        ${followers_count},
        ${engagement_rate || null},
        ${niche || null},
        ${category || null},
        ${price},
        ${description || null},
        'pending'
      )
      RETURNING *
    `;

    return Response.json(
      {
        listing,
        message:
          "Listing created successfully. It will be reviewed by an admin before going live.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating listing:", error);
    return Response.json(
      { error: "Failed to create listing" },
      { status: 500 },
    );
  }
}
