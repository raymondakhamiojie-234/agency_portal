import express from 'express';
import { pool } from '../server.js';
import { requireAuth, requireAdmin } from './auth.js';

const router = express.Router();

router.use(requireAuth, requireAdmin);

// Earnings
router.get('/earnings', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT e.*, u.name as creator_name, u.email as creator_email 
      FROM earnings e 
      JOIN auth_users u ON e.creator_id = u.id 
      ORDER BY e.created_at DESC
    `);
    
    res.json(rows.map(row => ({
      id: row.id,
      creator_name: row.creator_name,
      creator_email: row.creator_email,
      platform: row.platform,
      period: row.earning_date ? new Date(row.earning_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Unknown',
      amount: row.amount,
      currency: 'USD',
      status: 'VERIFIED',
      payment_status: row.payout_status ? row.payout_status.toUpperCase() : 'UNPAID'
    })));
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
      // Input from CSV: email, platform, period, amount, currency, status
      // We map this to: creator_id, platform, earning_date, amount, payout_status
      const { email, platform, period, amount, status } = record;
      
      const userRes = await pool.query("SELECT id FROM auth_users WHERE email = $1", [email]);
      if (userRes.rows.length === 0) {
        failed++;
        errors.push({ email, error: 'User not found' });
        continue;
      }
      
      const user = userRes.rows[0];
      
      // Attempt to parse 'period' into a valid date, fallback to now
      let earningDate = new Date(period);
      if (isNaN(earningDate.getTime())) {
        earningDate = new Date();
      }
      
      await pool.query(
        `INSERT INTO earnings (creator_id, platform, amount, earning_date, payout_status) 
         VALUES ($1, $2, $3, $4, $5)`,
        [user.id, platform, parseFloat(amount), earningDate, status || 'Unpaid']
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
    // Loans has user_id
    const { rows } = await pool.query(`
      SELECT l.*, u.name as creator_name, u.email as creator_email 
      FROM loans l
      JOIN auth_users u ON l.user_id = u.id
      ORDER BY l.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Loans error:', err);
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
    // Monetization might not exist in legacy, so we gracefully catch it
    const { rows } = await pool.query(`
      SELECT m.*, u.name as creator_name, u.email as creator_email
      FROM monetization m
      JOIN auth_users u ON m.user_id = u.id
      ORDER BY m.last_updated DESC
    `).catch(() => ({ rows: [] }));
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/monetization', async (req, res) => {
  const { user_id, platform, handle, current_followers, status } = req.body;
  try {
    // We didn't migrate monetization schema fully, but we assume it has user_id if it exists.
    const existRes = await pool.query("SELECT id FROM monetization WHERE user_id = $1 AND platform = $2", [user_id, platform]);
    
    if (existRes.rows.length > 0) {
      await pool.query(
        "UPDATE monetization SET handle=$1, current_followers=$2, status=$3, last_updated=CURRENT_TIMESTAMP WHERE id=$4",
        [handle, current_followers, status, existRes.rows[0].id]
      );
    } else {
      await pool.query(
        `INSERT INTO monetization (user_id, platform, handle, current_followers, status)
         VALUES ($1, $2, $3, $4, $5)`,
        [user_id, platform, handle, current_followers, status]
      );
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
