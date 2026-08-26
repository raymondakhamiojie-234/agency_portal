import sql from "@/app/api/utils/sql";
import crypto from "crypto";

/**
 * GET /api/blog/external-news
 * Get all external news from the queue
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "pending";

    const news = await sql`
      SELECT 
        enq.*,
        au.name as reviewer_name
      FROM external_news_queue enq
      LEFT JOIN admin_users au ON enq.reviewed_by = au.id
      WHERE enq.status = ${status}
      ORDER BY enq.created_at DESC
    `;

    return Response.json({ success: true, news });
  } catch (error) {
    console.error("Error fetching external news:", error);
    return Response.json(
      { error: "Failed to fetch external news" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/blog/external-news
 * Fetch external news from sources (placeholder for actual fetching logic)
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      source_url,
      title,
      content,
      featured_image,
      category,
      source_name,
    } = body;

    // Validate required fields
    if (!source_url || !title || !content || !source_name) {
      return Response.json(
        { error: "source_url, title, content, and source_name are required" },
        { status: 400 },
      );
    }

    // Create hash to prevent duplicates
    const source_hash = crypto
      .createHash("sha256")
      .update(source_url + title)
      .digest("hex");

    // Check if already exists
    const existing = await sql`
      SELECT id FROM external_news_queue 
      WHERE source_hash = ${source_hash}
    `;

    if (existing.length > 0) {
      return Response.json(
        { error: "This news item has already been fetched" },
        { status: 400 },
      );
    }

    // Sanitize content (basic HTML stripping for security)
    const sanitizedContent = content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      .replace(/on\w+="[^"]*"/gi, "");

    const excerpt =
      sanitizedContent.substring(0, 200).replace(/<[^>]*>/g, "") + "...";

    // Insert into queue for approval
    const result = await sql`
      INSERT INTO external_news_queue (
        title, featured_image, category, content, excerpt,
        source_name, source_url, source_hash, status
      ) VALUES (
        ${title}, ${featured_image || null}, ${category || "General"},
        ${sanitizedContent}, ${excerpt},
        ${source_name}, ${source_url}, ${source_hash}, 'pending'
      )
      RETURNING *
    `;

    return Response.json({ success: true, news: result[0] });
  } catch (error) {
    console.error("Error adding external news:", error);

    if (error.message && error.message.includes("unique")) {
      return Response.json(
        { error: "This news item has already been fetched" },
        { status: 400 },
      );
    }

    return Response.json(
      { error: "Failed to add external news" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/blog/external-news
 * Approve or reject external news
 */
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, action, admin_id } = body;

    if (!id || !action || !["approve", "reject"].includes(action)) {
      return Response.json(
        { error: "Valid id and action (approve/reject) are required" },
        { status: 400 },
      );
    }

    if (action === "approve") {
      // Get the news item
      const newsItems = await sql`
        SELECT * FROM external_news_queue WHERE id = ${id}
      `;

      if (newsItems.length === 0) {
        return Response.json({ error: "News item not found" }, { status: 404 });
      }

      const news = newsItems[0];

      // Create slug from title
      const slug =
        news.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") +
        "-" +
        Date.now();

      // Create blog post from approved news
      await sql`
        INSERT INTO blog_posts (
          title, slug, featured_image, category, author_name,
          content, excerpt, is_external, source_name, source_url,
          status, published_at
        ) VALUES (
          ${news.title}, ${slug}, ${news.featured_image}, ${news.category},
          ${news.source_name}, ${news.content}, ${news.excerpt},
          true, ${news.source_name}, ${news.source_url},
          'published', NOW()
        )
      `;

      // Update queue status
      await sql`
        UPDATE external_news_queue
        SET status = 'approved', reviewed_by = ${admin_id || null}, reviewed_at = NOW()
        WHERE id = ${id}
      `;
    } else {
      // Reject
      await sql`
        UPDATE external_news_queue
        SET status = 'rejected', reviewed_by = ${admin_id || null}, reviewed_at = NOW()
        WHERE id = ${id}
      `;
    }

    return Response.json({
      success: true,
      message: `News ${action}ed successfully`,
    });
  } catch (error) {
    console.error("Error updating external news:", error);
    return Response.json(
      { error: "Failed to update external news" },
      { status: 500 },
    );
  }
}
