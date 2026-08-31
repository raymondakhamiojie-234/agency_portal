import express from 'express';
import { pool } from '../server.js';
import { requireAuth } from './auth.js';

const router = express.Router();

router.use(requireAuth);

router.get('/dashboard/creator', async (req, res) => {
  const userId = req.user.id;
  try {
    const earningsResult = await pool.query(
      'SELECT SUM(amount) as total FROM earnings WHERE creator_id = $1',
      [userId]
    );

    const pendingEarningsResult = await pool.query(
      "SELECT SUM(amount) as total FROM earnings WHERE creator_id = $1 AND payout_status ILIKE 'unpaid'",
      [userId]
    );

    const loansResult = await pool.query(
      "SELECT SUM(remaining_balance) as total FROM loans WHERE user_id = $1 AND status != 'PAID'",
      [userId]
    );

    const historyResult = await pool.query(
      'SELECT * FROM earnings WHERE creator_id = $1 ORDER BY created_at DESC LIMIT 5',
      [userId]
    );

    const history = historyResult.rows.map(row => ({
      id: row.id,
      platform: row.platform,
      amount: row.amount,
      currency: 'USD',
      period: row.earning_date ? new Date(row.earning_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Unknown',
      status: 'VERIFIED',
      payment_status: row.payout_status ? row.payout_status.toUpperCase() : 'UNPAID'
    }));

    const totalEarnings = parseFloat(earningsResult.rows[0]?.total || 0);
    const pendingEarnings = parseFloat(pendingEarningsResult.rows[0]?.total || 0);
    const outstandingLoan = parseFloat(loansResult.rows[0]?.total || 0);
    const availableLoan = Math.max(0, (totalEarnings * 0.5) - outstandingLoan);

    res.json({
      totalEarnings,
      pendingEarnings,
      outstandingLoan,
      availableLoan,
      history
    });
  } catch (err) {
    console.error('Creator Dashboard Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/earnings', async (req, res) => {
  try {
    const userId = req.user.id;
    const { rows } = await pool.query(
      'SELECT * FROM earnings WHERE creator_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    
    res.json(rows.map(row => ({
      id: row.id,
      platform: row.platform,
      amount: row.amount,
      currency: 'USD',
      period: row.earning_date ? new Date(row.earning_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Unknown',
      status: 'VERIFIED',
      payment_status: row.payout_status ? row.payout_status.toUpperCase() : 'UNPAID',
      withholding_tax: row.withholding_tax || 0
    })));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/loans', async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM loans WHERE user_id = $1 ORDER BY created_at DESC", 
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/loans/eligibility', async (req, res) => {
  const userId = req.user.id;
  try {
    const earningsRes = await pool.query(
      "SELECT SUM(amount) as total FROM earnings WHERE creator_id = $1", [userId]
    );
    const loansRes = await pool.query(
      "SELECT SUM(remaining_balance) as outstanding FROM loans WHERE user_id = $1 AND status != 'PAID'", [userId]
    );
    
    const totalEarnings = parseFloat(earningsRes.rows[0]?.total || 0);
    const outstandingLoan = parseFloat(loansRes.rows[0]?.outstanding || 0);
    const availableLoan = Math.max(0, (totalEarnings * 0.5) - outstandingLoan);

    res.json({
      totalEarnings,
      outstandingLoan,
      availableLoan
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/loans/apply', async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.id;
  try {
    const interest = amount * 0.15;
    const remainingBalance = amount + interest;
    
    // In legacy schema, creator_name and creator_email do not exist in loans table, only user_id
    await pool.query(
      `INSERT INTO loans (user_id, requested_amount, interest, remaining_balance, status) 
       VALUES ($1, $2, $3, $4, 'PENDING')`,
      [userId, amount, interest, remainingBalance]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Loan apply error:', err);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

router.get('/invoices', async (req, res) => {
  try {
    const userId = req.user.id;
    const { rows } = await pool.query(
      'SELECT * FROM invoices WHERE creator_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(rows.map(row => ({
      id: row.id,
      invoice_number: row.invoice_number,
      total_amount: row.total_amount,
      month: row.month,
      year: row.year,
      status: row.status,
      created_at: row.created_at
    })));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/monetization', async (req, res) => {
  try {
    // We didn't create monetization in legacy table dump? Let's just catch and return [] for now if not exists
    const { rows } = await pool.query(
      "SELECT * FROM monetization WHERE user_id = $1", 
      [req.user.id]
    ).catch(() => ({ rows: [] }));
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Contracts
router.get('/contracts', async (req, res) => {
  try {
    const userId = req.user.id;
    const masterRes = await pool.query(
      "SELECT * FROM contracts WHERE creator_id = $1 ORDER BY created_at DESC", 
      [userId]
    );
    const platformRes = await pool.query(
      "SELECT * FROM platform_contracts WHERE creator_id = $1 ORDER BY created_at DESC", 
      [userId]
    );
    
    res.json({
      master: masterRes.rows,
      platform: platformRes.rows
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/contracts/master', async (req, res) => {
  try {
    const userId = req.user.id;
    const { signature_name } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    const { rows } = await pool.query(
      `INSERT INTO contracts (
        creator_id, revenue_share_percentage, duration_years, 
        signed_at, created_at, signed_by_name, signature_name, 
        signature_ip, ip_address, status
      ) VALUES ($1, $2, $3, NOW(), NOW(), $4, $5, $6, $7, 'Signed') RETURNING *`,
      [userId, 70, 1, req.user.name, signature_name, ip, ip]
    );
    
    res.json({ success: true, contract: rows[0] });
  } catch (err) {
    console.error('Sign Master Contract Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/contracts/platform', async (req, res) => {
  try {
    const userId = req.user.id;
    const { platform, account_name, account_url, followers_count } = req.body;
    
    const { rows } = await pool.query(
      `INSERT INTO platform_contracts (
        creator_id, platform, account_name, account_url, 
        followers_count, signed_at, created_at, status
      ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), 'Pending') RETURNING *`,
      [userId, platform, account_name, account_url, followers_count || 0]
    );
    
    res.json({ success: true, contract: rows[0] });
  } catch (err) {
    console.error('Sign Platform Contract Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get Creator Profile
router.get('/profile', async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user basic info
    const userRes = await pool.query('SELECT name, email FROM auth_users WHERE id = $1', [userId]);
    const user = userRes.rows[0];
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get creator profile info
    const profileRes = await pool.query('SELECT * FROM creator_profiles WHERE user_id = $1', [userId]);
    const profile = profileRes.rows[0] || {};
    
    res.json({
      ...user,
      ...profile
    });
  } catch (err) {
    console.error('Get Profile Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update Creator Profile
router.put('/profile', async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      full_name, brand_name, phone_number, primary_platform, 
      country, page_name, date_of_birth, home_address,
      page_urls, follower_count
    } = req.body;
    
    // Safe parsing
    const parsedDate = date_of_birth ? new Date(date_of_birth) : null;
    const safeDate = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate : null;
    
    let safePageUrls = null;
    if (Array.isArray(page_urls)) {
      safePageUrls = page_urls;
    } else if (typeof page_urls === 'string' && page_urls.trim() !== '') {
      safePageUrls = [page_urls];
    }

    const safeFollowerCount = parseInt(follower_count, 10) || 0;

    // Note: Bank details are explicitly NOT updated here because changing them requires admin approval
    
    // Upsert creator profile
    const { rows } = await pool.query(
      `INSERT INTO creator_profiles (
        user_id, full_name, brand_name, phone_number, primary_platform,
        country, page_name, date_of_birth, home_address,
        page_urls, follower_count, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        brand_name = EXCLUDED.brand_name,
        phone_number = EXCLUDED.phone_number,
        primary_platform = EXCLUDED.primary_platform,
        country = EXCLUDED.country,
        page_name = EXCLUDED.page_name,
        date_of_birth = EXCLUDED.date_of_birth,
        home_address = EXCLUDED.home_address,
        page_urls = EXCLUDED.page_urls,
        follower_count = EXCLUDED.follower_count,
        updated_at = NOW()
      RETURNING *`,
      [
        userId, full_name || 'Unknown', brand_name, phone_number, primary_platform,
        country, page_name, safeDate, home_address,
        safePageUrls, safeFollowerCount
      ]
    );
    
    res.json({ success: true, profile: rows[0] });
  } catch (err) {
    console.error('Update Profile Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Notifications
router.get('/notifications', async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM notifications WHERE creator_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(rows.map(r => ({ ...r, type: r.notification_type })));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/notifications/read', async (req, res) => {
  try {
    await pool.query(
      "UPDATE notifications SET is_read = true WHERE creator_id = $1",
      [req.user.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
