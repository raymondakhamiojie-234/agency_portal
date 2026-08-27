import { Pool } from '@neondatabase/serverless';

async function checkSchema() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'auth_users';
    `);
    console.log(res.rows);
  } catch (error) {
    console.error(error);
  } finally {
    await pool.end();
  }
}

checkSchema();
