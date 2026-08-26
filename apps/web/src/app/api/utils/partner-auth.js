import sql from "@/app/api/utils/sql";

/**
 * Get current partner from session token
 * @param {Request} request - The request object
 * @returns {Promise<Object|null>} - Partner object or null
 */
export async function getCurrentPartner(request) {
  try {
    // Get session token from cookie
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) {
      return null;
    }

    const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      acc[key] = value;
      return acc;
    }, {});

    const sessionToken = cookies["partner.session-token"];
    if (!sessionToken) {
      return null;
    }

    // Get partner from session
    const sessions = await sql`
      SELECT p.* 
      FROM partner_sessions ps
      JOIN partners p ON ps.partner_id = p.id
      WHERE ps.session_token = ${sessionToken}
        AND ps.expires > NOW()
      LIMIT 1
    `;

    if (sessions.length === 0) {
      return null;
    }

    const partner = sessions[0];

    // Don't return password
    delete partner.password;

    return partner;
  } catch (error) {
    console.error("Error getting current partner:", error);
    return null;
  }
}

/**
 * Require partner authentication
 * Returns partner if authenticated, otherwise returns error response
 */
export async function requirePartnerAuth(request) {
  const partner = await getCurrentPartner(request);

  if (!partner) {
    return {
      error: true,
      response: Response.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 },
      ),
    };
  }

  return { error: false, partner };
}

/**
 * Generate unique referral code from partner name
 * Format: FirstNameFalcus (e.g., IzahFalcus)
 */
export function generateReferralCode(name) {
  // Extract first name (before any space)
  const firstName = name.trim().split(" ")[0];

  // Remove special characters and convert to title case
  const cleanName =
    firstName
      .replace(/[^a-zA-Z]/g, "")
      .charAt(0)
      .toUpperCase() + firstName.slice(1).toLowerCase();

  return `${cleanName}Falcus`;
}

/**
 * Generate referral link
 */
export function generateReferralLink(referralCode) {
  const baseUrl = process.env.APP_URL || "https://www.falcusmediaagency.com";
  return `${baseUrl}/account/signup?ref=${referralCode}`;
}

/**
 * Validate referral code and get partner
 */
export async function validateReferralCode(referralCode) {
  if (!referralCode) {
    return null;
  }

  const partners = await sql`
    SELECT id, name, email, referral_code
    FROM partners
    WHERE referral_code = ${referralCode}
    LIMIT 1
  `;

  return partners.length > 0 ? partners[0] : null;
}
