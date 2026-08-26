import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/auth";

// PUT - Admin: Reject a listing
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
        status = 'rejected',
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!listing) {
      return Response.json({ error: "Listing not found" }, { status: 404 });
    }

    return Response.json({
      listing,
      message: "Listing rejected successfully",
    });
  } catch (error) {
    console.error("Error rejecting listing:", error);
    return Response.json(
      { error: "Failed to reject listing" },
      { status: 500 },
    );
  }
}
