import pg from 'pg';
const pool = new pg.Pool();

async function run() {
  try {
    const invalidDate = new Date("");
    console.log("Invalid date:", invalidDate);
    const { rows } = await pool.query(
      `SELECT $1::date as date`,
      [invalidDate]
    );
    console.log(rows);
  } catch (err) {
    console.error("Caught error full:", err);
  } finally {
    pool.end();
  }
}
run();
