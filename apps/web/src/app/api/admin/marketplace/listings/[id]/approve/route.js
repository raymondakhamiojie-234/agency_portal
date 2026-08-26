import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/auth";

// PUT - Admin: Approve a listing
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
        status = 'approved',
        approved_at = NOW(),
        approved_by = ${session.user.id},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!listing) {
      return Response.json({ error: "Listing not found" }, { status: 404 });
    }

    return Response.json({
      listing,
      message: "Listing approved successfully",
    });
  } catch (error) {
    console.error("Error approving listing:", error);
    return Response.json(
      { error: "Failed to approve listing" },
      { status: 500 },
    );
  }
}
