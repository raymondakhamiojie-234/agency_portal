import express from 'express';
import bcrypt from 'bcrypt';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { pool } from '../server.js';

const router = express.Router();

router.post('/callback/credentials-signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Name, email, and password required' });
  }

  try {
    const { rows } = await pool.query('SELECT * FROM auth_users WHERE email = $1', [email]);
    if (rows.length > 0) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const hashedPassword = await argon2.hash(password);
    const result = await pool.query(
      'INSERT INTO auth_users (name, email, is_admin) VALUES ($1, $2, false) RETURNING id, name, email, is_admin',
      [name, email]
    );

    const user = result.rows[0];
    const role = user.is_admin ? 'ADMIN' : 'CREATOR';
    
    await pool.query(
      'INSERT INTO auth_accounts ("userId", type, provider, "providerAccountId", password) VALUES ($1, $2, $3, $4, $5)',
      [user.id, 'credentials', 'credentials', user.id.toString(), hashedPassword]
    );

    const token = jwt.sign(
      { id: user.id, email: user.email, role, name: user.name }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ user });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/callback/credentials-signin', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  try {
    const { rows } = await pool.query('SELECT * FROM auth_users WHERE email = $1', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const role = user.is_admin ? 'ADMIN' : 'CREATOR';
    
    const accountRes = await pool.query('SELECT password FROM auth_accounts WHERE "userId" = $1', [user.id]);
    if (accountRes.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const account = accountRes.rows[0];

    let match = false;
    if (account.password.startsWith('$argon2')) {
      match = await argon2.verify(account.password, password);
    } else {
      match = await bcrypt.compare(password, account.password);
    }
    
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role, name: user.name }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/signout', (req, res) => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });
  res.json({ message: 'Signed out successfully' });
});

router.get('/session', (req, res) => {
  const token = req.cookies.auth_token;
  
  if (!token) {
    return res.status(401).json({});
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      user: {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role
      }
    });
  } catch (err) {
    return res.status(401).json({});
  }
});

// Middleware to protect routes
export const requireAuth = (req, res, next) => {
  const token = req.cookies.auth_token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  
  try {
    // Check if user exists and is not admin
    const { rows } = await pool.query('SELECT * FROM auth_users WHERE email = $1', [email]);
    if (rows.length === 0) {
      // Return success anyway to prevent email enumeration
      return res.json({ success: true, message: 'If an account exists, a request has been sent to the admin.' });
    }
    
    const user = rows[0];
    if (user.is_admin) {
      return res.status(400).json({ error: 'Admins cannot request password reset this way' });
    }
    
    // Check for existing pending request
    const existingReq = await pool.query("SELECT id FROM password_reset_requests WHERE email = $1 AND status = 'PENDING'", [email]);
    if (existingReq.rows.length === 0) {
      await pool.query("INSERT INTO password_reset_requests (email) VALUES ($1)", [email]);
    }
    
    res.json({ success: true, message: 'Password reset request sent to Admin.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/profile', requireAuth, async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email required' });
  
  try {
    const checkEmail = await pool.query('SELECT id FROM auth_users WHERE email = $1 AND id != $2', [email, req.user.id]);
    if (checkEmail.rows.length > 0) return res.status(400).json({ error: 'Email already in use' });
    
    await pool.query('UPDATE auth_users SET name = $1, email = $2 WHERE id = $3', [name, email, req.user.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Passwords required' });
  
  try {
    const accountRes = await pool.query('SELECT password FROM auth_accounts WHERE "userId" = $1', [req.user.id]);
    if (accountRes.rows.length === 0) return res.status(400).json({ error: 'Account error' });
    
    const account = accountRes.rows[0];
    let match = false;
    if (account.password.startsWith('$argon2')) {
      match = await argon2.verify(account.password, currentPassword);
    } else {
      match = await bcrypt.compare(currentPassword, account.password);
    }
    
    if (!match) return res.status(400).json({ error: 'Incorrect current password' });
    
    const hashedPassword = await argon2.hash(newPassword);
    await pool.query('UPDATE auth_accounts SET password = $1 WHERE "userId" = $2', [hashedPassword, req.user.id]);
    
    res.json({ success: true });
  } catch (err) {
    console.error('Password update error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/creator-profile', requireAuth, async (req, res) => {
  if (req.user.role === 'ADMIN') return res.status(403).json({ error: 'Only for creators' });
  
  const { 
    phone_number, country, home_address, 
    page_name, page_urls, primary_platform,
    bank_name, account_name, bank_account_number
  } = req.body;
  
  try {
    const checkProfile = await pool.query('SELECT id FROM creator_profiles WHERE user_id = $1', [req.user.id]);
    if (checkProfile.rows.length > 0) {
      await pool.query(`
        UPDATE creator_profiles 
        SET phone_number=$1, country=$2, home_address=$3, page_name=$4, page_urls=$5, primary_platform=$6, bank_name=$7, account_name=$8, bank_account_number=$9
        WHERE user_id=$10
      `, [phone_number, country, home_address, page_name, page_urls, primary_platform, bank_name, account_name, bank_account_number, req.user.id]);
    } else {
      await pool.query(`
        INSERT INTO creator_profiles (user_id, phone_number, country, home_address, page_name, page_urls, primary_platform, bank_name, account_name, bank_account_number)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [req.user.id, phone_number, country, home_address, page_name, page_urls, primary_platform, bank_name, account_name, bank_account_number]);
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Creator profile update error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

export default router;
