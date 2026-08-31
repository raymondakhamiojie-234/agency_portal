import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function test() {
  try {
    const cp = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'creator_profiles'");
    console.log('creator_profiles cols:', cp.rows.map(r => r.column_name).join(', '));
    
    const ct = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'contracts'");
    console.log('contracts cols:', ct.rows.map(r => r.column_name).join(', '));

    const bnk = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'bank_details'");
    console.log('bank_details cols:', bnk.rows.map(r => r.column_name).join(', '));
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

test();
