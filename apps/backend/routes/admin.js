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

// ==========================================
// ADMIN SUPPORT & TALENT MANAGER
// ==========================================

// Get list of creators (for the sidebar)
router.get('/support/creators', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, name, email 
      FROM auth_users 
      WHERE is_admin = false 
      ORDER BY name ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching creators:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// TICKETS
router.get('/support/tickets/:creatorId', async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM support_tickets WHERE creator_id = $1 ORDER BY updated_at DESC",
      [req.params.creatorId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/support/tickets/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query(
      "UPDATE support_tickets SET status = $1, updated_at = NOW() WHERE id = $2",
      [status, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/support/tickets/:id/messages', async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM support_ticket_messages WHERE ticket_id = $1 ORDER BY created_at ASC",
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/support/tickets/:id/messages', async (req, res) => {
  try {
    const { message } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO support_ticket_messages (ticket_id, sender_id, sender_role, message) 
       VALUES ($1, $2, 'MANAGER', $3) RETURNING *`,
      [req.params.id, req.user.id, message]
    );
    await pool.query("UPDATE support_tickets SET updated_at = NOW() WHERE id = $1", [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DIRECT CHAT
router.get('/support/chat/:creatorId', async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM manager_chat_messages WHERE creator_id = $1 ORDER BY created_at ASC",
      [req.params.creatorId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/support/chat/:creatorId', async (req, res) => {
  try {
    const { message } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO manager_chat_messages (creator_id, sender_id, sender_role, message) 
       VALUES ($1, $2, 'MANAGER', $3) RETURNING *`,
      [req.params.creatorId, req.user.id, message]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// TASKS / UPDATES
router.post('/support/tasks', async (req, res) => {
  try {
    const { creator_id, title, description, due_date } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO manager_tasks (creator_id, title, description, due_date, status) 
       VALUES ($1, $2, $3, $4, 'Pending') RETURNING *`,
      [creator_id, title, description, due_date]
    );
    
    // Also push an update notification
    await pool.query(
      `INSERT INTO manager_updates (creator_id, title, content, type) 
       VALUES ($1, $2, $3, 'Task')`,
      [creator_id, 'New Task Assigned', title]
    );
    
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// MEETINGS
router.get('/support/meetings/:creatorId', async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM meetings WHERE creator_id = $1 ORDER BY meeting_date DESC, meeting_time DESC",
      [req.params.creatorId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/support/meetings/:id', async (req, res) => {
  try {
    const { status, meeting_link } = req.body;
    
    // Update the meeting
    const { rows } = await pool.query(
      "UPDATE meetings SET status = $1, meeting_link = $2, manager_name = $3 WHERE id = $4 RETURNING *",
      [status, meeting_link, req.user.name, req.params.id]
    );
    
    // Notify creator
    await pool.query(
      `INSERT INTO manager_updates (creator_id, title, content, type) 
       VALUES ($1, $2, $3, 'Meeting')`,
      [rows[0].creator_id, `Meeting ${status}`, `Your meeting request for ${rows[0].title} was ${status}.`]
    );
    
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// STATS
router.get('/stats', async (req, res) => {
  try {
    const creatorsRes = await pool.query("SELECT COUNT(*) FROM auth_users WHERE is_admin = false");
    const loansRes = await pool.query("SELECT COALESCE(SUM(amount), 0) as total FROM loans WHERE status = 'Approved'");
    const paymentsRes = await pool.query("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'COMPLETED'");
    const earningsRes = await pool.query("SELECT COALESCE(SUM(amount), 0) as total FROM earnings");

    res.json({
      totalCreators: parseInt(creatorsRes.rows[0].count),
      totalActiveLoans: parseFloat(loansRes.rows[0].total),
      totalPayments: parseFloat(paymentsRes.rows[0].total),
      platformEarnings: parseFloat(earningsRes.rows[0].total)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PAYMENTS
router.get('/payments', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.*, u.name as creator_name, u.email as creator_email
      FROM payments p
      JOIN auth_users u ON p.user_id = u.id
      ORDER BY p.payment_date DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// NOTIFICATIONS (Admin Broadcast)
router.post('/notifications', async (req, res) => {
  try {
    const { user_id, title, message, type } = req.body;
    
    if (user_id === 'ALL') {
      const { rows: users } = await pool.query("SELECT id FROM auth_users WHERE is_admin = false");
      for (const u of users) {
        await pool.query(
          "INSERT INTO notifications (creator_id, title, message, notification_type) VALUES ($1, $2, $3, $4)",
          [u.id, title, message, type]
        );
      }
    } else {
      await pool.query(
        "INSERT INTO notifications (creator_id, title, message, notification_type) VALUES ($1, $2, $3, $4)",
        [user_id, title, message, type]
      );
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
