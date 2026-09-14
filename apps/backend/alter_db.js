import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const run = async () => {
  try {
    console.log("Altering table auth_users...");
    await pool.query(`
      ALTER TABLE auth_users 
      ADD COLUMN IF NOT EXISTS is_partner BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS partner_id UUID REFERENCES auth_users(id),
      ADD COLUMN IF NOT EXISTS partner_percentage DECIMAL(5,2) DEFAULT 0.00;
    `);
    console.log("Table altered successfully.");
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
};
run();
