import 'dotenv/config';
import fs from 'fs';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function initDb() {
  try {
    const schema = fs.readFileSync('./db/schema.sql', 'utf8');
    await pool.query(schema);
    console.log('Database schema applied successfully!');
    
    // Check if admin user exists, if not create one
    const { rows } = await pool.query("SELECT * FROM users WHERE email = 'admin@falcusmedia.com'");
    if (rows.length === 0) {
      import('bcrypt').then(async (bcrypt) => {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await pool.query(
          "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
          ["Admin User", "admin@falcusmedia.com", hashedPassword, "ADMIN"]
        );
        console.log('Admin user created (admin@falcusmedia.com / admin123)');
      });
    }
  } catch (err) {
    console.error('Error applying schema:', err);
  } finally {
    setTimeout(() => pool.end(), 1000);
  }
}

initDb();
