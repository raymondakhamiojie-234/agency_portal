import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/auth";

// GET - Public: Get single listing details
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const [listing] = await sql`
      SELECT * FROM marketplace_listings 
      WHERE id = ${id} AND status = 'approved'
    `;

    if (!listing) {
      return Response.json({ error: "Listing not found" }, { status: 404 });
    }

    return Response.json({ listing });
  } catch (error) {
    console.error("Error fetching listing:", error);
    return Response.json({ error: "Failed to fetch listing" }, { status: 500 });
  }
}

// PUT - Authenticated: Update own listing
export async function PUT(request, { params }) {
  try {
    const session = await getSession(request);

    if (!session?.user) {
      return Response.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const { id } = params;
    const body = await request.json();

    // Get existing listing
    const [existingListing] = await sql`
      SELECT * FROM marketplace_listings WHERE id = ${id}
    `;

    if (!existingListing) {
      return Response.json({ error: "Listing not found" }, { status: 404 });
    }

    // Verify ownership
    let isOwner = false;

    if (existingListing.seller_role === "creator") {
      const creatorProfile = await sql`
        SELECT id FROM creator_profiles WHERE user_id = ${session.user.id}
      `;
      isOwner =
        creatorProfile.length > 0 &&
        creatorProfile[0].id === existingListing.seller_id;
    } else if (existingListing.seller_role === "partner") {
      const partnerProfile = await sql`
        SELECT id FROM partners WHERE email = ${session.user.email}
      `;
      isOwner =
        partnerProfile.length > 0 &&
        partnerProfile[0].id === existingListing.seller_id;
    } else {
      isOwner = session.user.id === existingListing.seller_id;
    }

    if (!isOwner && !session.user.isAdmin) {
      return Response.json(
        { error: "You can only update your own listings" },
        { status: 403 },
      );
    }

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];
    let paramCounter = 1;

    const allowedFields = [
      "platform",
      "account_name",
      "account_url",
      "followers_count",
      "engagement_rate",
      "niche",
      "category",
      "price",
      "description",
    ];

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        updateFields.push(`${field} = $${paramCounter}`);
        updateValues.push(body[field]);
        paramCounter++;
      }
    });

    // Always update updated_at and reset to pending if edited
    updateFields.push(`updated_at = NOW()`);
    updateFields.push(`status = 'pending'`);

    updateValues.push(id);

    const updateQuery = `
      UPDATE marketplace_listings 
      SET ${updateFields.join(", ")}
      WHERE id = $${paramCounter}
      RETURNING *
    `;

    const [updatedListing] = await sql(updateQuery, updateValues);

    return Response.json({
      listing: updatedListing,
      message:
        "Listing updated successfully. It will be reviewed again before going live.",
    });
  } catch (error) {
    console.error("Error updating listing:", error);
    return Response.json(
      { error: "Failed to update listing" },
      { status: 500 },
    );
  }
}

// DELETE - Authenticated: Delete own listing
export async function DELETE(request, { params }) {
  try {
    const session = await getSession(request);

    if (!session?.user) {
      return Response.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const { id } = params;

    // Get existing listing
    const [existingListing] = await sql`
      SELECT * FROM marketplace_listings WHERE id = ${id}
    `;

    if (!existingListing) {
      return Response.json({ error: "Listing not found" }, { status: 404 });
    }

    // Verify ownership
    let isOwner = false;

    if (existingListing.seller_role === "creator") {
      const creatorProfile = await sql`
        SELECT id FROM creator_profiles WHERE user_id = ${session.user.id}
      `;
      isOwner =
        creatorProfile.length > 0 &&
        creatorProfile[0].id === existingListing.seller_id;
    } else if (existingListing.seller_role === "partner") {
      const partnerProfile = await sql`
        SELECT id FROM partners WHERE email = ${session.user.email}
      `;
      isOwner =
        partnerProfile.length > 0 &&
        partnerProfile[0].id === existingListing.seller_id;
    } else {
      isOwner = session.user.id === existingListing.seller_id;
    }

    if (!isOwner && !session.user.isAdmin) {
      return Response.json(
        { error: "You can only delete your own listings" },
        { status: 403 },
      );
    }

    await sql`DELETE FROM marketplace_listings WHERE id = ${id}`;

    return Response.json({
      message: "Listing deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting listing:", error);
    return Response.json(
      { error: "Failed to delete listing" },
      { status: 500 },
    );
  }
}
