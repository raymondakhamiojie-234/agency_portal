import express from 'express';
import axios from 'axios';
import Papa from 'papaparse';
import { pool } from '../server.js';
import { requireAuth, requireAdmin } from './auth.js';
import { sendNotificationEmail } from '../utils/email.js';

const router = express.Router();

router.use(requireAuth, requireAdmin);
router.use(requireAuth, requireAdmin);

// Partners
router.get('/partners', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name, email, partner_percentage FROM auth_users WHERE is_partner = true ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching partners:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/partners', async (req, res) => {
  try {
    const { name, email, password, percentage } = req.body;
    
    // Check if email exists
    const checkRes = await pool.query('SELECT id FROM auth_users WHERE email = $1', [email]);
    if (checkRes.rows.length > 0) return res.status(400).json({ error: 'Email already in use' });

    // Hash password
    const bcrypt = await import('bcrypt');
    const argon2 = await import('argon2');
    const hashedPassword = await argon2.hash(password);

    // Create user
    const insertUser = await pool.query(
      'INSERT INTO auth_users (name, email, is_admin, is_partner, partner_percentage) VALUES ($1, $2, false, true, $3) RETURNING id',
      [name, email, percentage]
    );
    const userId = insertUser.rows[0].id;

    // Create account
    await pool.query(
      'INSERT INTO auth_accounts ("userId", type, provider, "providerAccountId", password) VALUES ($1, $2, $3, $4, $5)',
      [userId, 'credentials', 'credentials', userId.toString(), hashedPassword]
    );

    res.json({ success: true, id: userId });
  } catch (err) {
    console.error('Error creating partner:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
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
      creator_id: row.creator_id,
      creator_name: row.creator_name,
      creator_email: row.creator_email,
      platform: row.platform,
      period: row.earning_date ? new Date(row.earning_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Unknown',
      earning_date: row.earning_date,
      amount: row.amount,
      withholding_tax: row.withholding_tax,
      currency: 'USD',
      status: 'VERIFIED',
      payment_status: row.payout_status ? row.payout_status.toUpperCase() : 'UNPAID'
    })));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/earnings', async (req, res) => {
  try {
    const { creator_id, platform, amount, earning_date, payout_status, withholding_tax } = req.body;
    await pool.query(
      `INSERT INTO earnings (creator_id, platform, amount, earning_date, payout_status, withholding_tax) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [creator_id, platform, parseFloat(amount), earning_date ? new Date(earning_date) : new Date(), payout_status || 'UNPAID', parseFloat(withholding_tax || 0)]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/earnings/:id', async (req, res) => {
  try {
    const { platform, amount, earning_date, payout_status, withholding_tax } = req.body;
    await pool.query(
      `UPDATE earnings SET platform=$1, amount=$2, earning_date=$3, payout_status=$4, withholding_tax=$5 WHERE id=$6`,
      [platform, parseFloat(amount), earning_date ? new Date(earning_date) : new Date(), payout_status || 'UNPAID', parseFloat(withholding_tax || 0), req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

async function analyzeEarningsRecords(records) {
  // Fetch all creators with their profiles and contracts
  const { rows: creators } = await pool.query(`
    SELECT u.id, u.email, u.name, 
           cp.page_name, cp.brand_name, cp.full_name,
           c.revenue_share_percentage
    FROM auth_users u
    LEFT JOIN creator_profiles cp ON u.id = cp.user_id
    LEFT JOIN contracts c ON u.id = c.creator_id AND c.status = 'ACTIVE'
    WHERE u.is_admin = false
  `);

  let perfectMatches = [];
  let similarMatches = [];
  let unmatched = [];

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    // Determine fields whether record is object or array
    let creator_id_input = record.creator_id || record.id || record.creator;
    let page_name = record.page_name || record.email || record[0];
    let amount = record.amount || record[1] || 0;
    let withholding_tax = record.withholding_tax || record[2] || 0;
    let earning_date = record.earning_date || record.period || record[3] || new Date().toISOString();
    let platform = record.platform || record[4] || 'Facebook';
    let status = record.status || record.payout_status || record[5] || 'UNPAID';

    if (page_name === 'page_name' || page_name === 'email' || creator_id_input === 'creator_id' || creator_id_input === 'id') continue; // Skip header row if parsed as array

    const searchString = String(page_name || '').toLowerCase().trim();
    if (!searchString && !creator_id_input) continue;

    // 1. Try exact match
    let exactMatch = null;
    if (creator_id_input) {
      exactMatch = creators.find(c => c.id == creator_id_input);
    }

    if (!exactMatch && searchString) {
      exactMatch = creators.find(c => 
        (c.email && c.email.toLowerCase() === searchString) ||
        (c.page_name && c.page_name.toLowerCase() === searchString) ||
        (c.brand_name && c.brand_name.toLowerCase() === searchString) ||
        (c.name && c.name.toLowerCase() === searchString)
      );
    }

    const parsedRecord = {
      original_id: i,
      search_term: searchString,
      platform,
      amount: parseFloat(amount) || 0,
      withholding_tax: parseFloat(withholding_tax) || 0,
      earning_date: earning_date,
      payout_status: status
    };

    if (exactMatch) {
      perfectMatches.push({
        ...parsedRecord,
        creator: exactMatch
      });
      continue;
    }

    // 2. Try similar match
    let suggestions = creators.filter(c => 
      (c.page_name && c.page_name.toLowerCase().includes(searchString)) ||
      (searchString.includes(c.page_name?.toLowerCase())) ||
      (c.brand_name && c.brand_name.toLowerCase().includes(searchString)) ||
      (c.name && c.name.toLowerCase().includes(searchString))
    );

    if (suggestions.length > 0) {
      similarMatches.push({
        ...parsedRecord,
        suggestions: suggestions.slice(0, 3)
      });
    } else {
      unmatched.push({
        ...parsedRecord,
        suggestions: creators.slice(0, 50) // Return some for dropdown, maybe all if < 100
      });
    }
  }

  return { perfectMatches, similarMatches, unmatched };
}

router.post('/earnings/analyze-import', async (req, res) => {
  const { records } = req.body;
  if (!Array.isArray(records)) return res.status(400).json({ error: 'Invalid data' });
  
  const result = await analyzeEarningsRecords(records);
  res.json(result);
});

router.post('/earnings/analyze-sheet', async (req, res) => {
  const { sheetUrl } = req.body;
  if (!sheetUrl) return res.status(400).json({ error: 'Missing sheet URL' });

  const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (!match) return res.status(400).json({ error: 'Invalid Google Sheets URL' });
  const spreadsheetId = match[1];
  
  const gidMatch = sheetUrl.match(/[#&]gid=([0-9]+)/);
  const gid = gidMatch ? gidMatch[1] : '0';

  try {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
    const response = await axios.get(csvUrl, { 
      responseType: 'text',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    });
    
    Papa.parse(response.data, {
      header: false, // Parse as array so we can handle both strict positional and varied sheets
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const importResult = await analyzeEarningsRecords(results.data);
          res.json(importResult);
        } catch (err) {
          console.error("Analysis Error:", err);
          res.status(500).json({ error: 'Failed to analyze records: ' + err.message });
        }
      },
      error: (error) => {
        res.status(400).json({ error: 'Failed to parse CSV from Google Sheet' });
      }
    });
  } catch (err) {
    console.error("Google Sheets Fetch Error:", err.message);
    res.status(500).json({ error: 'Failed to fetch Google Sheet. Make sure anyone with the link can view.' });
  }
});

router.post('/earnings/confirm-import', async (req, res) => {
  const { records } = req.body;
  if (!Array.isArray(records)) return res.status(400).json({ error: 'Invalid data' });
  
  let imported = 0;
  let failed = 0;

  for (const record of records) {
    try {
      const { creator_id, platform, amount, withholding_tax, earning_date, payout_status } = record;
      
      const contractRes = await pool.query("SELECT revenue_share_percentage FROM contracts WHERE creator_id = $1 AND status = 'ACTIVE' ORDER BY created_at DESC LIMIT 1", [creator_id]);
      const revShare = contractRes.rows.length > 0 ? parseFloat(contractRes.rows[0].revenue_share_percentage) : 100;
      
      // Business Logic: (earnings - withholding_tax) * (revShare / 100)
      const rawAmount = parseFloat(amount) || 0;
      const tax = parseFloat(withholding_tax) || 0;
      const finalAmount = (rawAmount - tax) * (revShare / 100);

      let parsedDate = new Date(earning_date);
      if (isNaN(parsedDate.getTime())) parsedDate = new Date();

      await pool.query(
        `INSERT INTO earnings (creator_id, platform, amount, earning_date, payout_status, withholding_tax) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [creator_id, platform || 'Facebook', finalAmount, parsedDate, payout_status || 'UNPAID', tax]
      );
      imported++;
    } catch (err) {
      console.error("Confirm Import Error:", err);
      failed++;
    }
  }
  
  res.json({ success: true, imported, failed });
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

// Get comprehensive list of creators with their details (for the Creators page)
router.get('/creators/details', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT u.id, u.name, u.email, u.created_at as joined_date, u.partner_id,
             cp.full_name, cp.brand_name, cp.phone_number, cp.primary_platform,
             cp.country, cp.page_name, cp.follower_count, cp.page_urls,
             cp.home_address, cp.bank_name, cp.account_name, cp.bank_account_number,
             COALESCE(e.total_earnings, 0) as total_earnings,
             ct.revenue_share_percentage as contract_percentage,
             ct.signed_at as contract_signed_at
      FROM auth_users u
      LEFT JOIN creator_profiles cp ON u.id = cp.user_id
      LEFT JOIN contracts ct ON u.id = ct.creator_id
      LEFT JOIN (
        SELECT creator_id, SUM(amount) as total_earnings 
        FROM earnings 
        GROUP BY creator_id
      ) e ON u.id = e.creator_id
      WHERE u.is_admin = false
      ORDER BY u.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching creator details:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/creators/:id/partner', async (req, res) => {
  try {
    const { partner_id } = req.body;
    const val = partner_id === '' || partner_id === null ? null : partner_id;
    await pool.query('UPDATE auth_users SET partner_id = $1 WHERE id = $2', [val, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error assigning partner:', err);
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

    // Send email to creator
    const ticketRes = await pool.query(`
      SELECT u.email, u.name, st.subject 
      FROM support_tickets st 
      JOIN auth_users u ON st.creator_id = u.id 
      WHERE st.id = $1
    `, [req.params.id]);
    
    if (ticketRes.rows.length > 0) {
      const creator = ticketRes.rows[0];
      await sendNotificationEmail(
        creator.email,
        `New Message on Ticket: ${creator.subject}`,
        `<p>Hi ${creator.name},</p><p>Your manager has replied to your support ticket <b>"${creator.subject}"</b>:</p><blockquote>${message}</blockquote><p>Login to your portal to reply.</p>`
      );
    }

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

    // Send email to creator
    const creatorRes = await pool.query("SELECT email, name FROM auth_users WHERE id = $1", [req.params.creatorId]);
    if (creatorRes.rows.length > 0) {
      const creator = creatorRes.rows[0];
      await sendNotificationEmail(
        creator.email,
        "New Direct Message from your Manager",
        `<p>Hi ${creator.name},</p><p>Your manager sent you a new message:</p><blockquote>${message}</blockquote><p>Login to your portal to reply.</p>`
      );
    }

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
    
    // Send email to creator
    const creatorRes = await pool.query("SELECT email, name FROM auth_users WHERE id = $1", [creator_id]);
    if (creatorRes.rows.length > 0) {
      const creator = creatorRes.rows[0];
      await sendNotificationEmail(
        creator.email,
        "New Task Assigned: " + title,
        `<p>Hi ${creator.name},</p><p>You have been assigned a new task: <b>${title}</b>.</p><p>${description}</p><p>Due Date: ${due_date || 'N/A'}</p><p>Login to your portal for more details.</p>`
      );
    }

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
    const loansRes = await pool.query("SELECT COALESCE(SUM(remaining_balance), 0) as total FROM loans WHERE status != 'PAID'");
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

// PASSWORD RESET REQUESTS
router.get('/password-requests', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.*, u.name, u.id as user_id 
      FROM password_reset_requests p
      LEFT JOIN auth_users u ON p.email = u.email
      ORDER BY p.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/reset-user-password', async (req, res) => {
  const { requestId, email, newPassword } = req.body;
  if (!email || !newPassword) return res.status(400).json({ error: 'Email and new password required' });
  
  try {
    const { rows } = await pool.query('SELECT id FROM auth_users WHERE email = $1 AND is_admin = false', [email]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found or is admin' });
    
    const userId = rows[0].id;
    const argon2 = await import('argon2');
    const hashedPassword = await argon2.default.hash(newPassword);
    
    await pool.query('UPDATE auth_accounts SET password = $1 WHERE "userId" = $2', [hashedPassword, userId]);
    
    if (requestId) {
      await pool.query("UPDATE password_reset_requests SET status = 'RESOLVED', resolved_at = CURRENT_TIMESTAMP WHERE id = $1", [requestId]);
    }
    
    res.json({ success: true });
  } catch (err) {
    console.error('Reset user password error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================================
// ADMIN INVOICES
// ==========================================

router.get('/invoices', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT i.*, u.name as user_name, u.email as user_email
      FROM invoices i
      LEFT JOIN auth_users u ON i.creator_id = u.id
      ORDER BY i.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching invoices:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/invoices', async (req, res) => {
  const { creator_id, month, year, total_amount, withholding_tax } = req.body;
  if (!creator_id || !month || !year || !total_amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    const tax = parseFloat(withholding_tax) || 0;
    const amount = parseFloat(total_amount);
    const net = amount - tax;
    const invoiceNumber = `INV-${year}${String(month).padStart(2, '0')}-${creator_id}-${Math.floor(Math.random() * 1000)}`;

    const { rows } = await pool.query(`
      INSERT INTO invoices (
        creator_id, month, year, total_amount, withholding_tax, net_amount, invoice_number, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'UNPAID')
      RETURNING *
    `, [creator_id, month, year, amount, tax, net, invoiceNumber]);
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Error creating invoice:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/invoices/auto', async (req, res) => {
  const { month, year } = req.body;
  if (!month || !year) return res.status(400).json({ error: 'Month and year required' });
  
  try {
    // 1. Get all earnings for that month/year grouped by creator
    // 2. Generate an invoice for each creator with sum(amount) and sum(withholding_tax)
    
    const { rows: creatorEarnings } = await pool.query(`
      SELECT 
        creator_id, 
        SUM(amount) as total_amount, 
        SUM(withholding_tax) as total_tax
      FROM earnings
      WHERE EXTRACT(MONTH FROM earning_date) = $1 AND EXTRACT(YEAR FROM earning_date) = $2
      GROUP BY creator_id
    `, [month, year]);
    
    let created = 0;
    let skipped = 0;
    
    for (const record of creatorEarnings) {
      // Check if invoice already exists for this creator, month, year
      const checkRes = await pool.query(
        "SELECT id FROM invoices WHERE creator_id = $1 AND month = $2 AND year = $3",
        [record.creator_id, month, year]
      );
      
      if (checkRes.rows.length > 0) {
        skipped++;
        continue;
      }
      
      const invoiceNumber = `INV-${year}${String(month).padStart(2, '0')}-${record.creator_id}-${Math.floor(Math.random() * 1000)}`;
      const totalAmount = parseFloat(record.total_amount);
      const totalTax = parseFloat(record.total_tax) || 0;
      const netAmount = totalAmount - totalTax;
      
      await pool.query(`
        INSERT INTO invoices (
          creator_id, month, year, total_amount, withholding_tax, net_amount, invoice_number, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'UNPAID')
      `, [record.creator_id, month, year, totalAmount, totalTax, netAmount, invoiceNumber]);
      
      created++;
    }
    
    res.json({ success: true, created, skipped });
  } catch (err) {
    console.error('Error auto-generating invoices:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/invoices/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query("UPDATE invoices SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2", [status, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/invoices/:id', async (req, res) => {
  try {
    await pool.query("DELETE FROM invoices WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/partners/:id', async (req, res) => {
  try {
    const { name, email, password, percentage } = req.body;
    const partnerId = req.params.id;

    // Check if email is used by another user
    const checkRes = await pool.query('SELECT id FROM auth_users WHERE email = $1 AND id != $2', [email, partnerId]);
    if (checkRes.rows.length > 0) return res.status(400).json({ error: 'Email already in use by another account' });

    if (password) {
      const argon2 = await import('argon2');
      const hashedPassword = await argon2.hash(password);
      await pool.query(
        'UPDATE auth_users SET name = $1, email = $2, partner_percentage = $3 WHERE id = $4 AND is_partner = true',
        [name, email, percentage, partnerId]
      );
    } else {
      await pool.query(
        'UPDATE auth_users SET name = $1, email = $2, partner_percentage = $3 WHERE id = $4 AND is_partner = true',
        [name, email, percentage, partnerId]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Error updating partner:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// FB Sheet Live Data
router.get('/fb-sheet', async (req, res) => {
  try {
    const GOOGLE_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbxoiP5zbLO00ZbA9mw6l7jyQ93tCzW2Pg6GrhZ7K0QjiYN9HYP1yKoieH8CKpM2d6kN/exec';
    
    const response = await fetch(GOOGLE_WEBAPP_URL);
    const data = await response.json();
    
    res.json(data);
  } catch (err) {
    console.error("Error fetching from Google Sheet:", err);
    res.status(500).json({ error: 'Failed to fetch from Google Sheet' });
  }
});

// FB Profiles
router.get('/fb-profiles', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM fb_profiles ORDER BY created_at DESC');
    // Also fetch counts of pages per profile
    for (let i = 0; i < rows.length; i++) {
      const pageRes = await pool.query('SELECT * FROM fb_pages WHERE fb_profile_id = $1', [rows[i].id]);
      rows[i].pages = pageRes.rows;
    }
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/fb-profiles', async (req, res) => {
  try {
    const { name, url } = req.body;
    
    // 1. Save to local DB (optional now, but good for tracking)
    const { rows } = await pool.query(
      'INSERT INTO fb_profiles (name, url) VALUES ($1, $2) RETURNING *',
      [name, url]
    );

    // 2. Trigger Google Apps Script to create the tab
    const GOOGLE_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbxoiP5zbLO00ZbA9mw6l7jyQ93tCzW2Pg6GrhZ7K0QjiYN9HYP1yKoieH8CKpM2d6kN/exec';
    
    await fetch(GOOGLE_WEBAPP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profileName: name
      })
    }).catch(err => console.error("Google Web App Sync Error (Profile Create):", err));

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// FB Pages
router.get('/fb-pages', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT *, assigned_profile_name as profile_name 
      FROM fb_pages 
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/fb-pages', async (req, res) => {
  try {
    const { name, url } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO fb_pages (name, url) VALUES ($1, $2) RETURNING *',
      [name, url]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/fb-pages/:id/assign', async (req, res) => {
  try {
    const { profileName } = req.body;
    const pageId = req.params.id;

    const { rows } = await pool.query(
      'UPDATE fb_pages SET assigned_profile_name = $1 WHERE id = $2 RETURNING *',
      [profileName, pageId]
    );

    const page = rows[0];

    // Sync to Google Sheet via Web App URL
    const GOOGLE_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbxoiP5zbLO00ZbA9mw6l7jyQ93tCzW2Pg6GrhZ7K0QjiYN9HYP1yKoieH8CKpM2d6kN/exec';
    
    // Using native fetch since it's available in modern node
    fetch(GOOGLE_WEBAPP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profileName: profileName,
        pageName: page.name,
        pageUrl: page.url
      })
    }).catch(err => console.error("Google Web App Sync Error:", err)); // Non-blocking

    res.json({ success: true, page });
  } catch (err) {
    console.error('Error assigning page:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
