import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/auth";

// PUT - Admin: Suspend a listing
export async function PUT(request, { params }) {
  try {
    const session = await getSession(request);

    if (!session?.user?.isAdmin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const [listing] = await sql`
      UPDATE marketplace_listings 
      SET 
        status = 'suspended',
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!listing) {
      return Response.json({ error: "Listing not found" }, { status: 404 });
    }

    return Response.json({
      listing,
      message: "Listing suspended successfully",
    });
  } catch (error) {
    console.error("Error suspending listing:", error);
    return Response.json(
      { error: "Failed to suspend listing" },
      { status: 500 },
    );
  }
}
