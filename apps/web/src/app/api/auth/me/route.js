import { getSession } from "@/app/api/utils/auth";

export async function GET(request) {
  try {
    const session = await getSession(request);

    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    return Response.json(session.user);
  } catch (error) {
    console.error("Get user error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
