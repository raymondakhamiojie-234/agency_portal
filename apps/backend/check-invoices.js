import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'invoices'").then(res => {
  console.log(res.rows);
  pool.end();
}).catch(err => {
  console.error(err);
  pool.end();
});
