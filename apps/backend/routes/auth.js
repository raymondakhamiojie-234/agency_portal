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

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

export default router;
