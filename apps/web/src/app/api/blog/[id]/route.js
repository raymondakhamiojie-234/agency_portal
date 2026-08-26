import sql from "@/app/api/utils/sql";

/**
 * GET /api/blog/[id]
 * Get a single blog post by ID or slug
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Check if id is numeric (ID) or string (slug)
    const isNumeric = /^\d+$/.test(id);

    let post;
    if (isNumeric) {
      const result = await sql`
        SELECT * FROM blog_posts WHERE id = ${parseInt(id)}
      `;
      post = result[0];
    } else {
      const result = await sql`
        SELECT * FROM blog_posts WHERE slug = ${id}
      `;
      post = result[0];
    }

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    // Increment view count
    await sql`
      UPDATE blog_posts 
      SET view_count = view_count + 1 
      WHERE id = ${post.id}
    `;
    post.view_count += 1;

    return Response.json({ success: true, post });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return Response.json(
      { error: "Failed to fetch blog post" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/blog/[id]
 * Update a blog post (admin only)
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      title,
      slug,
      featured_image,
      category,
      author_name,
      content,
      excerpt,
      status,
      published_at,
    } = body;

    // Validate category if provided
    if (category) {
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
    }

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramIndex}`);
      values.push(title);
      paramIndex++;
    }
    if (slug !== undefined) {
      updates.push(`slug = $${paramIndex}`);
      values.push(slug);
      paramIndex++;
    }
    if (featured_image !== undefined) {
      updates.push(`featured_image = $${paramIndex}`);
      values.push(featured_image);
      paramIndex++;
    }
    if (category !== undefined) {
      updates.push(`category = $${paramIndex}`);
      values.push(category);
      paramIndex++;
    }
    if (author_name !== undefined) {
      updates.push(`author_name = $${paramIndex}`);
      values.push(author_name);
      paramIndex++;
    }
    if (content !== undefined) {
      updates.push(`content = $${paramIndex}`);
      values.push(content);
      paramIndex++;
    }
    if (excerpt !== undefined) {
      updates.push(`excerpt = $${paramIndex}`);
      values.push(excerpt);
      paramIndex++;
    }
    if (status !== undefined) {
      updates.push(`status = $${paramIndex}`);
      values.push(status);
      paramIndex++;
    }
    if (published_at !== undefined) {
      updates.push(`published_at = $${paramIndex}`);
      values.push(published_at);
      paramIndex++;
    }

    updates.push(`updated_at = NOW()`);
    values.push(parseInt(id));

    const query = `
      UPDATE blog_posts 
      SET ${updates.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    return Response.json({ success: true, post: result[0] });
  } catch (error) {
    console.error("Error updating blog post:", error);

    if (error.message && error.message.includes("unique")) {
      return Response.json(
        { error: "A post with this slug already exists" },
        { status: 400 },
      );
    }

    return Response.json(
      { error: "Failed to update blog post" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/blog/[id]
 * Delete a blog post (admin only)
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const result = await sql`
      DELETE FROM blog_posts 
      WHERE id = ${parseInt(id)}
      RETURNING id
    `;

    if (result.length === 0) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return Response.json(
      { error: "Failed to delete blog post" },
      { status: 500 },
    );
  }
}
