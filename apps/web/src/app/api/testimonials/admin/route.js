import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/auth";

// GET - Fetch all testimonials (admin only)
export async function GET(request) {
  try {
    const session = await getSession(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For now, we'll allow any authenticated user to access admin panel
    // In production, you should check if user has admin role
    const userId = session.user.id;

    const testimonials = await sql`
      SELECT 
        t.id,
        t.rating,
        t.testimonial_text,
        t.is_approved,
        t.created_at,
        t.updated_at,
        cp.full_name,
        cp.page_name,
        cp.primary_platform,
        cp.follower_count
      FROM testimonials t
      JOIN creator_profiles cp ON t.creator_id = cp.id
      ORDER BY t.created_at DESC
    `;

    return Response.json({ testimonials });
  } catch (err) {
    console.error("GET /api/testimonials/admin error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT - Approve or reject testimonial
export async function PUT(request) {
  try {
    const session = await getSession(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { testimonialId, isApproved } = body;

    if (!testimonialId || isApproved === undefined) {
      return Response.json(
        { error: "Missing testimonialId or isApproved" },
        { status: 400 },
      );
    }

    const result = await sql`
      UPDATE testimonials
      SET is_approved = ${isApproved}, updated_at = NOW()
      WHERE id = ${testimonialId}
      RETURNING *
    `;

    if (result.length === 0) {
      return Response.json({ error: "Testimonial not found" }, { status: 404 });
    }

    return Response.json({
      message: isApproved
        ? "Testimonial approved successfully"
        : "Testimonial rejected successfully",
      testimonial: result[0],
    });
  } catch (err) {
    console.error("PUT /api/testimonials/admin error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE - Delete testimonial
export async function DELETE(request) {
  try {
    const session = await getSession(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { testimonialId } = body;

    if (!testimonialId) {
      return Response.json({ error: "Missing testimonialId" }, { status: 400 });
    }

    const result = await sql`
      DELETE FROM testimonials
      WHERE id = ${testimonialId}
      RETURNING id
    `;

    if (result.length === 0) {
      return Response.json({ error: "Testimonial not found" }, { status: 404 });
    }

    return Response.json({ message: "Testimonial deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/testimonials/admin error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
