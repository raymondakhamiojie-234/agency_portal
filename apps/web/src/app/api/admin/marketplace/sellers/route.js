import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/auth";

// GET - Admin: Get all sellers and their contract status
export async function GET(request) {
  try {
    const session = await getSession(request);

    if (!session?.user?.isAdmin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all creators who are sellers
    const creators = await sql`
      SELECT 
        cp.id,
        cp.full_name as name,
        au.email,
        'creator' as role,
        cp.seller_contract_signed,
        cp.seller_contract_signed_at,
        cp.seller_contract_revoked,
        cp.seller_contract_revoked_at,
        COUNT(ml.id) as listing_count
      FROM creator_profiles cp
      JOIN auth_users au ON cp.user_id = au.id
      LEFT JOIN marketplace_listings ml ON ml.seller_id = cp.id AND ml.seller_role = 'creator'
      GROUP BY cp.id, cp.full_name, au.email, cp.seller_contract_signed, 
               cp.seller_contract_signed_at, cp.seller_contract_revoked, 
               cp.seller_contract_revoked_at
    `;

    // Get all partners who are sellers
    const partners = await sql`
      SELECT 
        p.id,
        p.name,
        p.email,
        'partner' as role,
        p.seller_contract_signed,
        p.seller_contract_signed_at,
        p.seller_contract_revoked,
        p.seller_contract_revoked_at,
        COUNT(ml.id) as listing_count
      FROM partners p
      LEFT JOIN marketplace_listings ml ON ml.seller_id = p.id AND ml.seller_role = 'partner'
      GROUP BY p.id, p.name, p.email, p.seller_contract_signed, 
               p.seller_contract_signed_at, p.seller_contract_revoked, 
               p.seller_contract_revoked_at
    `;

    // Get all clients who are sellers
    const clients = await sql`
      SELECT 
        au.id,
        au.name,
        au.email,
        'client' as role,
        au.seller_contract_signed,
        au.seller_contract_signed_at,
        au.seller_contract_revoked,
        au.seller_contract_revoked_at,
        COUNT(ml.id) as listing_count
      FROM auth_users au
      LEFT JOIN marketplace_listings ml ON ml.seller_id = au.id AND ml.seller_role = 'client'
      WHERE au.seller_contract_signed = true OR ml.id IS NOT NULL
      GROUP BY au.id, au.name, au.email, au.seller_contract_signed, 
               au.seller_contract_signed_at, au.seller_contract_revoked, 
               au.seller_contract_revoked_at
    `;

    const allSellers = [...creators, ...partners, ...clients];

    return Response.json({ sellers: allSellers });
  } catch (error) {
    console.error("Error fetching sellers:", error);
    return Response.json({ error: "Failed to fetch sellers" }, { status: 500 });
  }
}
