import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/auth";

// Generate platform-specific contract text
function generatePlatformContractText(
  clientName,
  clientAddress,
  platform,
  accountName,
  accountUrl,
  followersCount,
  clientPercentage,
  companyPercentage,
  contractDate,
) {
  const formattedDate = new Date(contractDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `PLATFORM MONETIZATION AGREEMENT - ${platform.toUpperCase()}

This PLATFORM MONETIZATION AGREEMENT is made this day ${formattedDate}

BETWEEN

FALCUS MEDIA LIMITED, a company incorporated under the Companies and Allied Matters Act, 2020 and having its registered office and principal place of business at NO 2 EKEZUE STREET, OFF EZIOPKOR ROAD, OBIARUKU, DELTA STATE, NIGERIA (hereinafter referred to as the Company which expression shall wherever the context so admit include its successors in title and assigns) of the one part

AND

"${clientName}", of "${clientAddress}" (hereinafter referred to as the client which expression shall wherever the context so admit shall include his heirs, agents and personal representatives) of the other part.

PLATFORM DETAILS:
Platform: ${platform}
Account/Page/Channel Name: ${accountName}
Account URL: ${accountUrl}
Current Followers/Subscribers: ${followersCount.toLocaleString()}

WHEREAS

1. The company has expertise in monetization services for social media platforms.

2. The client operates a ${platform} account and seeks to engage the company as an independent contractor to provide monetization services described herein, and the company seeks to provide their services according to the terms and conditions of this agreement.

3. The Company and the client deem it in their best interests to express in this written agreement their understandings regarding the scope of services that the company will provide and the rights and obligations of the client.

NOW THIS AGREEMENT WITNESSES AS FOLLOWS:

IN CONSIDERATION of the mutual covenants set forth in this agreement, the Company and client hereby agree as follows;

1. This Agreement shall have an initial term of two years and shall automatically renew for additional one-year term thereafter unless either Party provides 28 days prior written notice of its intention of non renewal.

2. The client is not obligated to obtain prior consent from the Company for the publication of a post on their ${platform} account. It is within their discretion.

3. The company's duty and responsibility is monetization of the client's ${platform} account.

4. The content of the client should be original, accurate and adhere to the terms and conditions of ${platform} as well as comply with relevant intellectual property guidelines.

5. Nothing contained within this agreement shall be construed to form any partnership, joint venture, agency, franchise, or employment relationship. The company is an independent contractor and shall at all times, act as such. The client is responsible for the client's own local state, and federal tax liability, and no tax funds or other required payments, such as social security, shall be withheld from any of the clients fees.

6. This agreement does not create an exclusive relationship between the Company and the client. Throughout the terms of this agreement, the company may work with any other clients.

7. The company agrees to pay the client in commission on the basis of percentage of proceeds made from the monetization services of the client's ${platform} account. The Company shall make payment of the payment amount to the client upon receipt. The client is entitled to receive payment between the 25th and 30th of each month.

8. The company's liability will be limited to the total payment amount due to the client. Which shall be "${clientPercentage}%" to the Client and "${companyPercentage}%" to the Company from the monetization proceeds generated from the ${platform} account.

9. The company hereby disclaims any responsibility for any legal technical regulatory specification pertaining to the client's business as it is understood that the client bears sole responsibility for complying with such requirement.

10. This Agreement and the rights and obligations of the parties shall be construed and governed and interpreted in accordance with the laws of the Federal Republic of Nigeria.

11. The Company shall not be held liable for the cessation or delay of work caused by circumstances beyond their reasonable control such as acts of God Military action, Riots, or natural disasters.

12. This represents the complete agreement between the parties for the ${platform} account specified above, and no modifications or amendments shall be valid unless made in writing and signed by both parties.

13. In the event that the ${platform} account is no longer able to generate income, this contract shall be terminated. Upon termination, all accrued fees up to date of termination must be paid to the client by the company.

14. This agreement shall terminate automatically upon notice in writing: if the client, commits a material breach of any term of this agreement that is not capable of being remedied according to the company's discretion. if the client becomes unable to perform their duties. This Agreement may also be terminated by the Company at any time with or without cause. The company specifically reserves the right to terminate this agreement if the client breaches any of the terms outlined herein. If this agreement is terminated by the client the company shall pay the client any and all fees earned but not paid out prior to termination, unless the client fails to follow the terms of this agreement and the company terminates for breach. in such a case, client forfeits all rights, including the right to any unclaimed fees.

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

// GET - List all platform contracts for the logged-in creator
export async function GET(request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user;

    // Get creator profile
    const creatorProfile = await sql`
      SELECT id FROM creator_profiles WHERE user_id = ${user.id}
    `;

    if (creatorProfile.length === 0) {
      return Response.json(
        { error: "Creator profile not found" },
        { status: 404 },
      );
    }

    const creatorId = creatorProfile[0].id;

    // Get all platform contracts for this creator
    const contracts = await sql`
      SELECT 
        id,
        creator_id,
        platform,
        account_name,
        account_url,
        followers_count,
        contract_file_url,
        status,
        rejection_reason,
        created_at,
        updated_at,
        signed_at
      FROM platform_contracts
      WHERE creator_id = ${creatorId}
      ORDER BY created_at DESC
    `;

    return Response.json({ contracts });
  } catch (error) {
    console.error("Error fetching platform contracts:", error);
    return Response.json(
      { error: "Failed to fetch contracts" },
      { status: 500 },
    );
  }
}

// POST - Create a new platform contract
export async function POST(request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user;

    // Get creator profile with details
    const creatorProfile = await sql`
      SELECT cp.id, cp.full_name, cp.home_address, cp.seller_contract_signed
      FROM creator_profiles cp
      WHERE cp.user_id = ${user.id}
    `;

    if (creatorProfile.length === 0) {
      return Response.json(
        { error: "Creator profile not found" },
        { status: 404 },
      );
    }

    const creator = creatorProfile[0];

    // Check if master contract is signed
    if (!creator.seller_contract_signed) {
      return Response.json(
        {
          error:
            "You must complete your master contract with Falcus Media before creating platform contracts.",
        },
        { status: 403 },
      );
    }

    // Get the master contract to fetch revenue share percentage
    const masterContract = await sql`
      SELECT revenue_share_percentage FROM contracts
      WHERE creator_id = ${creator.id}
      AND status = 'Signed'
      ORDER BY signed_at DESC
      LIMIT 1
    `;

    if (masterContract.length === 0) {
      return Response.json(
        {
          error:
            "Master contract not found. Please complete your master contract first.",
        },
        { status: 404 },
      );
    }

    const revenueSharePercentage = masterContract[0].revenue_share_percentage;
    const clientPercentage = 100 - revenueSharePercentage;
    const companyPercentage = revenueSharePercentage;

    const body = await request.json();
    const { platform, account_name, account_url, followers_count } = body;

    // Validate required fields
    if (
      !platform ||
      !account_name ||
      !account_url ||
      followers_count === undefined
    ) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate platform
    const validPlatforms = ["Facebook", "YouTube", "TikTok", "Instagram"];
    if (!validPlatforms.includes(platform)) {
      return Response.json({ error: "Invalid platform" }, { status: 400 });
    }

    // Validate URL based on platform
    const urlValidation = {
      Facebook: "facebook.com",
      YouTube: "youtube.com",
      TikTok: "tiktok.com",
      Instagram: "instagram.com",
    };

    if (!account_url.includes(urlValidation[platform])) {
      return Response.json(
        {
          error: `Invalid URL for ${platform}. URL must contain ${urlValidation[platform]}`,
        },
        { status: 400 },
      );
    }

    // Generate platform-specific contract text
    const contractText = generatePlatformContractText(
      creator.full_name,
      creator.home_address,
      platform,
      account_name,
      account_url,
      followers_count,
      clientPercentage,
      companyPercentage,
      new Date(),
    );

    // Insert new contract with generated contract text
    const newContract = await sql`
      INSERT INTO platform_contracts (
        creator_id,
        platform,
        account_name,
        account_url,
        followers_count,
        contract_text,
        status
      ) VALUES (
        ${creator.id},
        ${platform},
        ${account_name},
        ${account_url},
        ${followers_count},
        ${contractText},
        'Draft'
      )
      RETURNING *
    `;

    return Response.json(
      {
        message: "Contract generated and created successfully",
        contract: newContract[0],
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating platform contract:", error);
    return Response.json(
      { error: "Failed to create contract" },
      { status: 500 },
    );
  }
}
