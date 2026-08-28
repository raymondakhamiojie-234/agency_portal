import express from 'express';
import { pool } from '../server.js';
import { requireAuth } from './auth.js';

const router = express.Router();

router.use(requireAuth);

// Get Dashboard Overview
router.get('/dashboard', async (req, res) => {
  try {
    const creatorId = req.user.id;
    
    // Open Issues
    const ticketsRes = await pool.query(
      "SELECT COUNT(*) FROM support_tickets WHERE creator_id = $1 AND status NOT IN ('Resolved', 'Closed')",
      [creatorId]
    );
    
    // Unread Updates
    const updatesRes = await pool.query(
      "SELECT COUNT(*) FROM manager_updates WHERE creator_id = $1 AND is_read = false",
      [creatorId]
    );
    
    // Pending Tasks
    const tasksRes = await pool.query(
      "SELECT COUNT(*) FROM manager_tasks WHERE creator_id = $1 AND status != 'Completed'",
      [creatorId]
    );
    
    // Next Meeting
    const nextMeetingRes = await pool.query(
      "SELECT * FROM meetings WHERE creator_id = $1 AND status = 'Confirmed' AND meeting_date >= CURRENT_DATE ORDER BY meeting_date ASC, meeting_time ASC LIMIT 1",
      [creatorId]
    );
    
    // Manager Details (we try to get from any meeting or update, or join with profile if assigned_manager exists)
    // For now, let's just try to extract the manager_name from the last meeting or update
    const managerRes = await pool.query(
      "SELECT manager_name FROM meetings WHERE creator_id = $1 AND manager_name IS NOT NULL ORDER BY id DESC LIMIT 1",
      [creatorId]
    );
    
    let managerName = managerRes.rows[0]?.manager_name;
    if (!managerName) {
      const altManagerRes = await pool.query(
        "SELECT assigned_manager FROM support_tickets WHERE creator_id = $1 AND assigned_manager IS NOT NULL ORDER BY id DESC LIMIT 1",
        [creatorId]
      );
      managerName = altManagerRes.rows[0]?.assigned_manager || null;
    }

    res.json({
      openIssues: parseInt(ticketsRes.rows[0].count),
      unreadUpdates: parseInt(updatesRes.rows[0].count),
      pendingTasks: parseInt(tasksRes.rows[0].count),
      nextMeeting: nextMeetingRes.rows[0] || null,
      managerName: managerName
    });
  } catch (err) {
    console.error('Manager Dashboard Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// TICKETS
router.get('/tickets', async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM support_tickets WHERE creator_id = $1 ORDER BY updated_at DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/tickets', async (req, res) => {
  try {
    const { subject, category, platform, priority, message } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO support_tickets (creator_id, subject, category, platform, priority, message, status, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, 'Open', NOW(), NOW()) RETURNING *`,
      [req.user.id, subject, category, platform, priority || 'Normal', message]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/tickets/:id/messages', async (req, res) => {
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

router.post('/tickets/:id/messages', async (req, res) => {
  try {
    const { message } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO support_ticket_messages (ticket_id, sender_id, sender_role, message) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.params.id, req.user.id, 'CREATOR', message]
    );
    await pool.query("UPDATE support_tickets SET updated_at = NOW() WHERE id = $1", [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATES
router.get('/updates', async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM manager_updates WHERE creator_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/updates/:id/read', async (req, res) => {
  try {
    await pool.query("UPDATE manager_updates SET is_read = true WHERE id = $1 AND creator_id = $2", [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// TASKS (Recommendations)
router.get('/tasks', async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM manager_tasks WHERE creator_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/tasks/:id/complete', async (req, res) => {
  try {
    await pool.query(
      "UPDATE manager_tasks SET status = 'Completed', completed_at = NOW() WHERE id = $1 AND creator_id = $2", 
      [req.params.id, req.user.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DIRECT CHAT
router.get('/chat', async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM manager_chat_messages WHERE creator_id = $1 ORDER BY created_at ASC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO manager_chat_messages (creator_id, sender_id, sender_role, message) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.user.id, req.user.id, 'CREATOR', message]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// MEETINGS
router.get('/meetings', async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM meetings WHERE creator_id = $1 ORDER BY meeting_date DESC, meeting_time DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/meetings/request', async (req, res) => {
  try {
    const { purpose, customPurpose, meeting_date, meeting_time, notes } = req.body;
    
    // User can either select a predefined purpose or type a custom one.
    const finalPurpose = purpose === 'Other' && customPurpose ? customPurpose : purpose;

    const { rows } = await pool.query(
      `INSERT INTO meetings (creator_id, title, purpose, meeting_date, meeting_time, notes, status) 
       VALUES ($1, $2, $3, $4, $5, $6, 'Requested') RETURNING *`,
      [req.user.id, `Meeting Request: ${finalPurpose}`, finalPurpose, meeting_date, meeting_time, notes]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
