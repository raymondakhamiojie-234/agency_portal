import express from 'express';
import { pool } from '../server.js';
import { requireAuth } from './auth.js';

const router = express.Router();

// Middleware to check if user is a PARTNER
const requirePartner = (req, res, next) => {
  if (req.user && req.user.role === 'PARTNER') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied: Partners only' });
  }
};

router.use(requireAuth);
router.use(requirePartner);

// Get dashboard stats and referred creators
router.get('/dashboard', async (req, res) => {
  const partnerId = req.user.id;
  try {
    // Get partner info and percentage
    const partnerRes = await pool.query('SELECT name, partner_percentage FROM auth_users WHERE id = $1', [partnerId]);
    if (partnerRes.rows.length === 0) return res.status(404).json({ error: 'Partner not found' });
    const partner = partnerRes.rows[0];
    const percentage = parseFloat(partner.partner_percentage) || 0;

    // Get referred creators
    const creatorsRes = await pool.query(`
      SELECT u.id, u.name, u.email,
             COALESCE(SUM(e.amount), 0) as total_net_earnings
      FROM auth_users u
      LEFT JOIN earnings e ON u.id = e.creator_id
      WHERE u.partner_id = $1
      GROUP BY u.id, u.name, u.email
    `, [partnerId]);

    const referred_creators = creatorsRes.rows;
    let total_agency_net = 0;
    
    for (const c of referred_creators) {
      total_agency_net += parseFloat(c.total_net_earnings) || 0;
    }

    // Partner earnings = (Agency Net Earnings * partner_percentage) / 100
    const partner_earnings = (total_agency_net * percentage) / 100;

    res.json({
      stats: {
        total_creators: referred_creators.length,
        partner_earnings: partner_earnings,
        partner_percentage: percentage
      },
      referred_creators
    });

  } catch (err) {
    console.error('Partner dashboard error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
