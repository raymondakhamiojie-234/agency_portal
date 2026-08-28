import 'dotenv/config';
import pg from 'pg';
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function run() {
  try {
    const userId = 1;
    const full_name = 'Test';
    const brand_name = 'Test Brand';
    const phone_number = '12345';
    const primary_platform = 'YouTube';
    const country = 'US';
    const page_name = 'Test Page';
    const date_of_birth = ""; // Test empty string for date
    const home_address = '123 Test St';
    const page_urls = ['http://youtube.com/test'];
    const follower_count = ""; // Test empty string for follower count
    
    // Safe parsing
    const parsedDate = date_of_birth ? new Date(date_of_birth) : null;
    const safeDate = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate : null;
    
    let safePageUrls = null;
    if (Array.isArray(page_urls)) {
      safePageUrls = page_urls;
    } else if (typeof page_urls === 'string' && page_urls.trim() !== '') {
      safePageUrls = [page_urls];
    }

    const safeFollowerCount = parseInt(follower_count, 10) || 0;

    const { rows } = await pool.query(
      `INSERT INTO creator_profiles (
        user_id, full_name, brand_name, phone_number, primary_platform,
        country, page_name, date_of_birth, home_address,
        page_urls, follower_count, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        brand_name = EXCLUDED.brand_name,
        phone_number = EXCLUDED.phone_number,
        primary_platform = EXCLUDED.primary_platform,
        country = EXCLUDED.country,
        page_name = EXCLUDED.page_name,
        date_of_birth = EXCLUDED.date_of_birth,
        home_address = EXCLUDED.home_address,
        page_urls = EXCLUDED.page_urls,
        follower_count = EXCLUDED.follower_count,
        updated_at = NOW()
      RETURNING *`,
      [
        userId, full_name || 'Unknown', brand_name, phone_number, primary_platform,
        country, page_name, safeDate, home_address,
        safePageUrls, safeFollowerCount
      ]
    );
    console.log(rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
run();
