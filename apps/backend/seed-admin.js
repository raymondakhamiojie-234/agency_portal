import bcrypt from 'bcrypt';
import { pool } from './server.js';
import dotenv from 'dotenv';
dotenv.config();

async function seedAdmin() {
  try {
    const email = 'admin@falcusmedia.com';
    const password = 'password123';
    
    // Check if user exists
    const { rows } = await pool.query('SELECT * FROM auth_users WHERE email = $1', [email]);
    if (rows.length > 0) {
      console.log('Admin already exists!');
      // Update them to be admin just in case
      await pool.query('UPDATE auth_users SET is_admin = true WHERE email = $1', [email]);
      console.log('Ensured they are admin.');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO auth_users (name, email, is_admin) VALUES ($1, $2, true) RETURNING id, name, email, is_admin',
      ['System Admin', email]
    );
    
    const user = result.rows[0];
    
    await pool.query(
      'INSERT INTO auth_accounts ("userId", type, provider, "providerAccountId", password) VALUES ($1, $2, $3, $4, $5)',
      [user.id, 'credentials', 'credentials', user.id.toString(), hashedPassword]
    );

    console.log('Admin account created successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed admin:', error);
    process.exit(1);
  }
}

seedAdmin();
