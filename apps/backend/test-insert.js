import 'dotenv/config';
import pg from 'pg';
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function run() {
  try {
    const res = await pool.query(
      `INSERT INTO platform_contracts (
        creator_id, platform, account_name, account_url, 
        followers_count, signed_at, created_at, status
      ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), 'PENDING') RETURNING *`,
      [1, 'YouTube', '@test', 'http://youtube.com/test', 100]
    );
    console.log('Success:', res.rows[0]);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    pool.end();
  }
}
run();
