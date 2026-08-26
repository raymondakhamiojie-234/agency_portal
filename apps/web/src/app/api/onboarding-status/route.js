import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/auth";

export async function GET(request) {
  try {
    const session = await getSession(request);

    if (!session?.user?.id) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get creator profile
    const profiles = await sql`
      SELECT 
        cp.*,
        c.status as contract_status,
        c.signed_at as contract_signed_at
      FROM creator_profiles cp
      LEFT JOIN contracts c ON c.creator_id = cp.id AND c.status = 'Signed'
      WHERE cp.user_id = ${session.user.id}
    `;

    if (profiles.length === 0) {
      return Response.json({
        profileExists: false,
        isComplete: false,
        missingFields: [],
        contractSigned: false,
        canAccessEarnings: false,
      });
    }

    const profile = profiles[0];

    // Define required fields
    const requiredFields = [
      { field: "full_name", label: "Full Name", value: profile.full_name },
      {
        field: "phone_number",
        label: "Phone Number",
        value: profile.phone_number,
      },
      { field: "country", label: "Country", value: profile.country },
      {
        field: "primary_platform",
        label: "Primary Platform",
        value: profile.primary_platform,
      },
      { field: "page_name", label: "Page Name", value: profile.page_name },
      {
        field: "page_urls",
        label: "Page URLs",
        value: profile.page_urls?.length > 0,
      },
      {
        field: "bank_account_number",
        label: "Bank Account Number",
        value: profile.bank_account_number,
      },
      { field: "bank_name", label: "Bank Name", value: profile.bank_name },
      {
        field: "account_name",
        label: "Account Holder Name",
        value: profile.account_name,
      },
    ];

    // Check which fields are missing
    const missingFields = requiredFields.filter(
      (field) => !field.value || field.value === "",
    );

    const profileComplete = missingFields.length === 0;
    const contractSigned =
      profile.contract_status === "Signed" && profile.contract_signed_at;

    // Calculate completion percentage
    const totalFields = requiredFields.length + 1; // +1 for contract
    const completedFields =
      totalFields - missingFields.length - (contractSigned ? 0 : 1);
    const completionPercentage = Math.round(
      (completedFields / totalFields) * 100,
    );

    // Update onboarding_completed status if everything is done
    if (profileComplete && contractSigned && !profile.onboarding_completed) {
      await sql`
        UPDATE creator_profiles
        SET onboarding_completed = true, onboarding_completed_at = NOW()
        WHERE id = ${profile.id}
      `;
    }

    return Response.json({
      profileExists: true,
      isComplete: profileComplete && contractSigned,
      profileComplete,
      contractSigned,
      missingFields: missingFields.map((f) => ({
        field: f.field,
        label: f.label,
      })),
      completionPercentage,
      canAccessEarnings: profileComplete && contractSigned,
      profile: {
        id: profile.id,
        full_name: profile.full_name,
        account_status: profile.account_status,
      },
    });
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return Response.json(
      { error: "Failed to check onboarding status" },
      { status: 500 },
    );
  }
}
