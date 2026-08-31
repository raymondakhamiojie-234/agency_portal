import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function test() {
  try {
    await pool.query('SELECT COUNT(*) FROM auth_users WHERE is_admin = false');
    console.log('users ok');
    
    await pool.query("SELECT COALESCE(SUM(remaining_balance), 0) as total FROM loans WHERE status != 'PAID'");
    console.log('loans ok');
    
    await pool.query("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'COMPLETED'");
    console.log('payments ok');
    
    await pool.query("SELECT COALESCE(SUM(amount), 0) as total FROM earnings");
    console.log('earnings ok');
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

test();
