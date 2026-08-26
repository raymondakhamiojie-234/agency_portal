import { getSession } from "@/app/api/utils/auth";
import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const session = await getSession(request);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get creator profile
    const profiles = await sql`
      SELECT id FROM creator_profiles WHERE user_id = ${session.user.id}
    `;

    if (profiles.length === 0) {
      return Response.json(
        {
          error:
            "Creator profile not found. Please complete your profile first.",
        },
        { status: 404 },
      );
    }

    const creatorId = profiles[0].id;

    // Get contract
    const contracts = await sql`
      SELECT * FROM contracts 
      WHERE creator_id = ${creatorId}
      ORDER BY created_at DESC
      LIMIT 1
    `;

    if (contracts.length === 0) {
      return Response.json({ error: "No contract found" }, { status: 404 });
    }

    return Response.json({ contract: contracts[0] });
  } catch (error) {
    console.error("Error fetching contract:", error);

    // Check if it's a foreign key constraint error
    if (error.message && error.message.includes("foreign key constraint")) {
      return Response.json(
        {
          error:
            "Creator profile not found. Please complete your profile first.",
        },
        { status: 400 },
      );
    }

    return Response.json(
      { error: "Failed to fetch contract" },
      { status: 500 },
    );
  }
}
