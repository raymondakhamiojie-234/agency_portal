import { getCurrentPartner } from "@/app/api/utils/partner-auth";

export async function GET(request) {
  try {
    const partner = await getCurrentPartner(request);

    if (!partner) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    return Response.json({ partner });
  } catch (error) {
    console.error("Error getting partner:", error);
    return Response.json(
      { error: "Failed to get partner information" },
      { status: 500 },
    );
  }
}
