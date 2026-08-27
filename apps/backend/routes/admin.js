import express from 'express';
import { pool } from '../server.js';
import { requireAuth, requireAdmin } from './auth.js';

const router = express.Router();

router.use(requireAuth, requireAdmin);

// Earnings
router.get('/earnings', async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM earnings ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/earnings/import', async (req, res) => {
  const { records } = req.body;
  if (!Array.isArray(records)) return res.status(400).json({ error: 'Invalid data' });
  
  let imported = 0;
  let failed = 0;
  let errors = [];

  for (const record of records) {
    try {
      const { email, platform, period, amount, currency, status } = record;
      
      const userRes = await pool.query("SELECT id, name FROM users WHERE email = $1", [email]);
      if (userRes.rows.length === 0) {
        failed++;
        errors.push({ email, error: 'User not found' });
        continue;
      }
      
      const user = userRes.rows[0];
      
      await pool.query(
        `INSERT INTO earnings (user_id, creator_name, creator_email, platform, period, amount, currency, status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [user.id, user.name, email, platform, period, parseFloat(amount), currency || 'NGN', status || 'VERIFIED']
      );
      imported++;
    } catch (err) {
      failed++;
      errors.push({ email: record.email, error: err.message });
    }
  }
  
  res.json({ imported, failed, errors });
});

router.delete('/earnings/:id', async (req, res) => {
  try {
    await pool.query("DELETE FROM earnings WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Loans
router.get('/loans', async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM loans ORDER BY request_date DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/loans/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    await pool.query("UPDATE loans SET status = $1 WHERE id = $2", [status, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Monetization
router.get('/monetization', async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM monetization ORDER BY last_updated DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/monetization', async (req, res) => {
  const { user_id, platform, handle, current_followers, status } = req.body;
  try {
    const userRes = await pool.query("SELECT name, email FROM users WHERE id = $1", [user_id]);
    if (userRes.rows.length === 0) return res.status(400).json({ error: 'User not found' });
    
    const user = userRes.rows[0];
    
    // Check if exists, update or insert
    const existRes = await pool.query("SELECT id FROM monetization WHERE user_id = $1 AND platform = $2", [user_id, platform]);
    
    if (existRes.rows.length > 0) {
      await pool.query(
        "UPDATE monetization SET handle=$1, current_followers=$2, status=$3, last_updated=CURRENT_TIMESTAMP WHERE id=$4",
        [handle, current_followers, status, existRes.rows[0].id]
      );
    } else {
      await pool.query(
        `INSERT INTO monetization (user_id, creator_name, creator_email, platform, handle, current_followers, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [user_id, user.name, user.email, platform, handle, current_followers, status]
      );
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
