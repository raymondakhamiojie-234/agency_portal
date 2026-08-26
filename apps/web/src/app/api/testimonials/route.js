import { getSession } from "@/app/api/utils/auth";
import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const session = await getSession(request);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get approved testimonials for public display
    const testimonials = await sql`
      SELECT 
        t.id,
        t.rating,
        t.testimonial_text,
        t.created_at,
        cp.full_name,
        cp.page_name,
        cp.primary_platform
      FROM testimonials t
      JOIN creator_profiles cp ON t.creator_id = cp.id
      WHERE t.is_approved = true
      ORDER BY t.created_at DESC
      LIMIT 50
    `;

    // Get user's own testimonial (approved or not)
    const profile = await sql`
      SELECT id FROM creator_profiles WHERE user_id = ${session.user.id}
    `;

    let userTestimonial = null;
    if (profile.length > 0) {
      const userTestimonialResult = await sql`
        SELECT id, rating, testimonial_text, is_approved, created_at
        FROM testimonials
        WHERE creator_id = ${profile[0].id}
        ORDER BY created_at DESC
        LIMIT 1
      `;
      userTestimonial = userTestimonialResult[0] || null;
    }

    return Response.json({
      testimonials: testimonials,
      userTestimonial: userTestimonial,
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return Response.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const session = await getSession(request);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { rating, testimonialText } = body;

    if (!rating || !testimonialText) {
      return Response.json(
        { error: "Rating and testimonial text are required" },
        { status: 400 },
      );
    }

    if (rating < 1 || rating > 5) {
      return Response.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    if (testimonialText.trim().length < 10) {
      return Response.json(
        { error: "Testimonial must be at least 10 characters" },
        { status: 400 },
      );
    }

    // Get creator profile
    const profile = await sql`
      SELECT id FROM creator_profiles WHERE user_id = ${session.user.id}
    `;

    if (profile.length === 0) {
      return Response.json(
        { error: "Creator profile not found" },
        { status: 404 },
      );
    }

    const creatorId = profile[0].id;

    // Check if user already has a testimonial
    const existing = await sql`
      SELECT id FROM testimonials WHERE creator_id = ${creatorId}
    `;

    if (existing.length > 0) {
      // Update existing testimonial
      await sql`
        UPDATE testimonials
        SET rating = ${rating},
            testimonial_text = ${testimonialText.trim()},
            is_approved = false,
            updated_at = NOW()
        WHERE creator_id = ${creatorId}
      `;
    } else {
      // Create new testimonial
      await sql`
        INSERT INTO testimonials (creator_id, rating, testimonial_text)
        VALUES (${creatorId}, ${rating}, ${testimonialText.trim()})
      `;
    }

    return Response.json({
      message:
        "Testimonial submitted successfully. It will be reviewed before being published.",
    });
  } catch (error) {
    console.error("Error submitting testimonial:", error);
    return Response.json(
      { error: "Failed to submit testimonial" },
      { status: 500 },
    );
  }
}
