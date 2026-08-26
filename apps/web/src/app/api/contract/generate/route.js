import { getSession } from "@/app/api/utils/auth";
import sql from "@/app/api/utils/sql";

// Generate contract text with client details
function generateContractText(
  clientName,
  clientAddress,
  clientPercentage,
  companyPercentage,
  contractDate,
) {
  const formattedDate = new Date(contractDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `MONETIZATION AGREEMENT

This MONETIZATION AGREEMENT is made this day ${formattedDate}

BETWEEN

FALCUS MEDIA LIMITED, a company incorporated under the Companies and Allied Matters Act, 2020 and having its registered office and principal place of business at NO 2 EKEZUE STREET, OFF EZIOPKOR ROAD, OBIARUKU, DELTA STATE, NIGERIA (hereinafter referred to as the Company which expression shall wherever the context so admit include its successors in title and assigns) of the one part

AND

"${clientName}", of "${clientAddress}" (hereinafter referred to as the client which expression shall wherever the context so admit shall include his heirs, agents and personal representatives) of the other part.

WHEREAS

1. The company has expertise in monetization services.

2. The client seeks to engage the company as an independent contractor to provide monetization services described herein, and the company seeks to provide their services according to the terms and conditions of this agreement.

3. The Company and the client deem it in their best interests to express in this written agreement their understandings regarding the scope of services that the company will provide and the rights and obligations of the client.

NOW THIS AGREEMENT WITNESSES AS FOLLOWS:

IN CONSIDERATION of the mutual covenants set forth in this agreement, the Company and client hereby agree as follows;

1. This Agreement shall have an initial term of two years and shall automatically renew for additional one-year term thereafter unless either Party provides 28 days prior written notice of its intention of non renewal.

2. The client is not obligated to obtain prior consent from the Company for the publication of a post. it is within its discretion.

3. The company's duty and responsibility is monetization.

4. The content of the client should be original, accurate and adhere to the terms and conditions of the social media platforms used as well as comply with relevant intellectual property guidelines.

5. Nothing contained within this agreement shall be construed to form any partnership, joint venture, agency, franchise, or employment relationship. The company is an independent contractor and shall at all times, act as such. The client is responsible for the client's own local state, and federal tax liability, and no tax funds or other required payments, such as social security, shall be withheld from any of the clients fees.

6. This agreement does not create an exclusive relationship between the Company and the client. Throughout the terms of this agreement, the company may work with any other clients.

7. The company agrees to pay the client in commission on the basis of percentage of proceeds made from the monetization services of the client. The Company shall make payment of the payment amount to the client upon receipt. The client is entitled to receive payment between the 25th and 30th of each month.

8. The company's liability will be limited to the total payment amount due to the client. Which shall be "${clientPercentage}%" to the Client and "${companyPercentage}%" to the Company from the monetization proceeds.

9. The company hereby disclaims any responsibility for any legal technical regulatory specification pertaining to the client's business as it is understood that the client bears sole responsibility for complying with such requirement.

10. This Agreement and the rights and obligations of the parties shall be construed and governed and interpreted in accordance with the laws of the Federal Republic of Nigeria.

11. The Company shall not be held liable for the cessation or delay of work caused by circumstances beyond their reasonable control such as acts of God Military action, Riots, or natural disasters.

12. This represents the complete agreement between the parties, and no modifications or amendments shall be valid unless made in writing and signed by both parties.

13. In the event that the social media page is no longer able to generate income, this contract shall be terminated. Upon termination, all accrued fees up to date of termination must be paid to the client by the company.

14. This agreement shall terminate automatically upon notice in writing: if the client, commits a material breach of any term of this agreement that is not capable of being remedied according to the company's discretion. if the client becomes unable to perform his duties. This Agreement may also be terminated by the Company at any time with or without cause. The company specifically reserves the right to terminate this agreement if the client breaches any of the terms outlined herein. If this agreement is terminated by the client the company shall pay the client any and all fees earned but not paid out prior to termination, unless the client fails to follow the terms of this agreement and the company terminates for breach. in such a case, client forfeits all rights, including the right to any unclaimed fees.

At the termination of this agreement, any provisions that would be expected to survive termination by their nature shall remain in full force and effect.

15. Provided that the above termination clause shall not include termination of the payout.

IN WITNESS OF WHICH the parties have executed this agreement in the manner below the day and year first above written.

The common seal of Falcus media limited is affixed to this agreement and it was duly delivered in the presence of:

DIRECTOR: UZU PRAISE EBUBE
SECRETARY: UZU MARVELOUS CHUKWUB

PREPARED BY
Olamide Afolabi Esq
Enitan Afolabi and C`;
}

export async function POST(request) {
  try {
    const session = await getSession(request);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    let { revenueSharePercentage, durationYears = 2 } = body;

    // If no percentage is provided, fetch default from admin settings
    if (!revenueSharePercentage) {
      const defaultSettings = await sql`
        SELECT setting_value FROM admin_settings 
        WHERE setting_key = 'default_contract_percentage'
        LIMIT 1
      `;

      revenueSharePercentage =
        defaultSettings.length > 0
          ? parseFloat(defaultSettings[0].setting_value)
          : 20; // Fallback to 20% if no setting exists
    }

    // Get creator profile with all details
    const profiles = await sql`
      SELECT * FROM creator_profiles WHERE user_id = ${session.user.id}
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

    const profile = profiles[0];
    const creatorId = profile.id;

    // Validate that home_address exists
    if (!profile.home_address || !profile.home_address.trim()) {
      return Response.json(
        {
          error:
            "Home address is required to generate a contract. Please update your profile.",
        },
        { status: 400 },
      );
    }

    // Calculate percentages
    const clientPercentage = 100 - revenueSharePercentage;
    const companyPercentage = revenueSharePercentage;

    // Generate contract text
    const contractText = generateContractText(
      profile.full_name,
      profile.home_address,
      clientPercentage,
      companyPercentage,
      new Date(),
    );

    // Create contract
    const newContract = await sql`
      INSERT INTO contracts (
        creator_id,
        contract_text,
        revenue_share_percentage,
        duration_years,
        status
      )
      VALUES (
        ${creatorId},
        ${contractText},
        ${revenueSharePercentage},
        ${durationYears},
        'Pending Signature'
      )
      RETURNING *
    `;

    return Response.json({
      success: true,
      contract: newContract[0],
    });
  } catch (error) {
    console.error("Error generating contract:", error);

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
      { error: "Failed to generate contract" },
      { status: 500 },
    );
  }
}
