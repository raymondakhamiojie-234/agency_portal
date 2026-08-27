import express from 'express';
import { pool } from '../server.js';
import { requireAuth } from './auth.js';

const router = express.Router();

router.use(requireAuth);

router.get('/dashboard/creator', async (req, res) => {
  const userId = req.user.id;
  try {
    const earningsRes = await pool.query(
      "SELECT SUM(amount) as total FROM earnings WHERE user_id = $1", [userId]
    );
    const loansRes = await pool.query(
      "SELECT SUM(remaining_balance) as outstanding FROM loans WHERE user_id = $1 AND status = 'ACTIVE'", [userId]
    );
    
    const totalEarnings = parseFloat(earningsRes.rows[0]?.total || 0);
    const outstandingLoan = parseFloat(loansRes.rows[0]?.outstanding || 0);
    const availableLoan = Math.max(0, (totalEarnings * 0.5) - outstandingLoan);

    res.json({
      totalEarnings,
      currentEarnings: totalEarnings, // mock unpaid balance
      outstandingLoan,
      availableLoan
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/loans', async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM loans WHERE user_id = $1 ORDER BY request_date DESC", 
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
      "SELECT SUM(amount) as total FROM earnings WHERE user_id = $1", [userId]
    );
    const loansRes = await pool.query(
      "SELECT SUM(remaining_balance) as outstanding FROM loans WHERE user_id = $1 AND status = 'ACTIVE'", [userId]
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
    
    await pool.query(
      `INSERT INTO loans (user_id, creator_name, creator_email, requested_amount, interest, remaining_balance) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, req.user.name, req.user.email, amount, interest, remainingBalance]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

router.get('/invoices', async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM invoices WHERE user_id = $1 ORDER BY issue_date DESC", 
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/monetization', async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM monetization WHERE user_id = $1", 
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
