import sql from "@/app/api/utils/sql";

/**
 * GET /api/blog
 * Get all published blog posts (public) or all posts (admin)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status") || "published";
    const limit = parseInt(searchParams.get("limit")) || 50;
    const offset = parseInt(searchParams.get("offset")) || 0;

    let query = `
      SELECT 
        id, title, slug, featured_image, category, author_name,
        excerpt, is_external, source_name, source_url, status,
        view_count, published_at, created_at
      FROM blog_posts
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    // Filter by status (skip if "all")
    if (status && status !== "all") {
      query += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    // Filter by category
    if (category && category !== "all") {
      query += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    query += ` ORDER BY published_at DESC NULLS LAST, created_at DESC`;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const posts = await sql(query, params);

    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM blog_posts WHERE 1=1`;
    const countParams = [];
    let countParamIndex = 1;

    if (status && status !== "all") {
      countQuery += ` AND status = $${countParamIndex}`;
      countParams.push(status);
      countParamIndex++;
    }

    if (category && category !== "all") {
      countQuery += ` AND category = $${countParamIndex}`;
      countParams.push(category);
    }

    const countResult = await sql(countQuery, countParams);
    const total = parseInt(countResult[0]?.total || 0);

    return Response.json({
      success: true,
      posts,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return Response.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/blog
 * Create a new blog post (admin only)
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      featured_image,
      category,
      author_name,
      author_id,
      content,
      excerpt,
      status,
      published_at,
    } = body;

    // Validate required fields
    if (!title || !slug || !category || !content) {
      return Response.json(
        { error: "Title, slug, category, and content are required" },
        { status: 400 },
      );
    }

    // Validate category
    const validCategories = [
      "Instagram",
      "TikTok",
      "YouTube",
      "Meta",
      "X",
      "General",
    ];
    if (!validCategories.includes(category)) {
      return Response.json(
        {
          error:
            "Invalid category. Must be one of: " + validCategories.join(", "),
        },
        { status: 400 },
      );
    }

    // Create excerpt if not provided
    const finalExcerpt =
      excerpt || content.substring(0, 200).replace(/<[^>]*>/g, "") + "...";

    // Insert blog post
    const result = await sql`
      INSERT INTO blog_posts (
        title, slug, featured_image, category, author_name, author_id,
        content, excerpt, status, published_at
      ) VALUES (
        ${title}, ${slug}, ${featured_image || null}, ${category},
        ${author_name || "Falcus Media"}, ${author_id || null},
        ${content}, ${finalExcerpt}, ${status || "draft"},
        ${published_at || null}
      )
      RETURNING *
    `;

    return Response.json({ success: true, post: result[0] });
  } catch (error) {
    console.error("Error creating blog post:", error);

    // Check for duplicate slug
    if (error.message && error.message.includes("unique")) {
      return Response.json(
        { error: "A post with this slug already exists" },
        { status: 400 },
      );
    }

    return Response.json(
      { error: "Failed to create blog post" },
      { status: 500 },
    );
  }
}
