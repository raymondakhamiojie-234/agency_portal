import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/auth";

export async function GET(request) {
  try {
    const session = await getSession(request);

    if (!session || !session.user?.email) {
      return Response.json({ isAdmin: false }, { status: 401 });
    }

    // Check if user is admin
    const users = await sql`
      SELECT is_admin FROM auth_users WHERE email = ${session.user.email}
    `;

    if (users.length === 0 || !users[0].is_admin) {
      return Response.json({ isAdmin: false }, { status: 403 });
    }

    return Response.json({ isAdmin: true });
  } catch (err) {
    console.error("GET /api/admin/check error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
