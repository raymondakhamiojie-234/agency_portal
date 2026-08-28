import 'dotenv/config';
import pg from 'pg';
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
async function run() {
  for (const t of ['contracts', 'platform_contracts']) {
    const res = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${t}'`);
    console.log(t, ':', res.rows.map(r => r.column_name + ' (' + r.data_type + ')').join(', '));
  }
  await pool.end();
}
run();
