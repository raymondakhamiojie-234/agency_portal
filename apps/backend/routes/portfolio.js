import express from 'express';
import { pool } from '../server.js';
import { requireAuth } from './auth.js';

const router = express.Router();

// Helper to generate a clean URL slug from a string
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}

// ==========================================
// CREATOR PROTECTED ROUTES
// ==========================================

// GET /api/portfolio - Fetch or auto-initialize creator portfolio
router.get('/', requireAuth, async (req, res) => {
  const userId = req.user.id;
  try {
    // 1. Check if portfolio already exists
    const { rows: existing } = await pool.query(
      'SELECT * FROM creator_portfolios WHERE user_id = $1',
      [userId]
    );

    if (existing.length > 0) {
      return res.json({ portfolio: existing[0] });
    }

    // 2. If not found, fetch existing profile data to pre-populate defaults
    const { rows: profileRows } = await pool.query(
      'SELECT * FROM creator_profiles WHERE user_id = $1',
      [userId]
    );
    const { rows: userRows } = await pool.query(
      'SELECT name, email FROM auth_users WHERE id = $1',
      [userId]
    );

    const profile = profileRows[0] || {};
    const user = userRows[0] || {};

    const displayName = profile.brand_name || profile.page_name || profile.full_name || user.name || 'Creator';
    let rawSlug = profile.page_name || profile.brand_name || user.name || `creator-${userId}`;
    let baseSlug = slugify(rawSlug) || `creator-${userId}`;
    let uniqueSlug = baseSlug;

    // Check slug collision
    const { rows: slugCheck } = await pool.query(
      'SELECT id FROM creator_portfolios WHERE slug = $1',
      [uniqueSlug]
    );
    if (slugCheck.length > 0) {
      uniqueSlug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // Build initial social links array
    const socialLinks = [];
    if (profile.primary_platform) {
      socialLinks.push({
        platform: profile.primary_platform,
        url: Array.isArray(profile.page_urls) && profile.page_urls.length > 0 ? profile.page_urls[0] : '',
        followers: profile.follower_count ? String(profile.follower_count) : ''
      });
    }

    // Create default portfolio record
    const { rows: newPortfolio } = await pool.query(
      `INSERT INTO creator_portfolios (
        user_id, slug, is_published, display_name, tagline, bio,
        primary_platform, follower_count, social_links, featured_media,
        services, contact_email, theme_color
      ) VALUES ($1, $2, true, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        userId,
        uniqueSlug,
        displayName,
        `${profile.primary_platform || 'Digital'} Content Creator`,
        `Welcome to my official media kit & creator portfolio! Contact for brand deals, sponsorships, and collaborations.`,
        profile.primary_platform || 'Facebook',
        profile.follower_count || 0,
        JSON.stringify(socialLinks),
        JSON.stringify([]),
        JSON.stringify([
          { title: 'Sponsored Integration', description: '60s product feature in main content video', price: '$500' },
          { title: 'Dedicated Promotion', description: 'Full dedicated video review and pinned comment', price: '$1,200' }
        ]),
        user.email || '',
        '#6366f1'
      ]
    );

    res.json({ portfolio: newPortfolio[0] });
  } catch (err) {
    console.error('Error in GET /api/portfolio:', err);
    res.status(500).json({ error: 'Server error loading portfolio' });
  }
});

// PUT /api/portfolio - Update creator portfolio
router.put('/', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const {
    slug,
    is_published,
    display_name,
    tagline,
    bio,
    avatar_url,
    banner_url,
    theme_color,
    primary_platform,
    follower_count,
    social_links,
    featured_media,
    services,
    contact_email
  } = req.body;

  if (!slug) {
    return res.status(400).json({ error: 'URL slug is required' });
  }

  const cleanSlug = slugify(slug);

  try {
    // Check if cleanSlug is already taken by another creator
    const { rows: existing } = await pool.query(
      'SELECT id, user_id FROM creator_portfolios WHERE slug = $1',
      [cleanSlug]
    );
    if (existing.length > 0 && String(existing[0].user_id) !== String(userId)) {
      return res.status(409).json({ error: 'This portfolio URL handle is already taken. Please choose another.' });
    }

    const { rows } = await pool.query(
      `UPDATE creator_portfolios SET
        slug = $1,
        is_published = $2,
        display_name = $3,
        tagline = $4,
        bio = $5,
        avatar_url = $6,
        banner_url = $7,
        theme_color = $8,
        primary_platform = $9,
        follower_count = $10,
        social_links = $11,
        featured_media = $12,
        services = $13,
        contact_email = $14,
        updated_at = NOW()
      WHERE user_id = $15
      RETURNING *`,
      [
        cleanSlug,
        is_published !== false,
        display_name || '',
        tagline || '',
        bio || '',
        avatar_url || '',
        banner_url || '',
        theme_color || '#6366f1',
        primary_platform || '',
        parseInt(follower_count, 10) || 0,
        JSON.stringify(social_links || []),
        JSON.stringify(featured_media || []),
        JSON.stringify(services || []),
        contact_email || '',
        userId
      ]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    res.json({ success: true, portfolio: rows[0] });
  } catch (err) {
    console.error('Error updating portfolio:', err);
    res.status(500).json({ error: 'Server error updating portfolio' });
  }
});

// GET /api/portfolio/inquiries - List brand inquiries received by creator
router.get('/inquiries', requireAuth, async (req, res) => {
  const userId = req.user.id;
  try {
    const { rows } = await pool.query(
      `SELECT i.* 
       FROM portfolio_inquiries i
       WHERE i.creator_id = $1
       ORDER BY i.created_at DESC`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching inquiries:', err);
    res.status(500).json({ error: 'Server error fetching inquiries' });
  }
});

// PUT /api/portfolio/inquiries/:id/status - Update inquiry status
router.put('/inquiries/:id/status', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { status } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE portfolio_inquiries 
       SET status = $1 
       WHERE id = $2 AND creator_id = $3 
       RETURNING *`,
      [status || 'CONTACTED', id, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    res.json({ success: true, inquiry: rows[0] });
  } catch (err) {
    console.error('Error updating inquiry status:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================================
// PUBLIC UNPROTECTED ROUTES (for creators.falcusmedia.com)
// ==========================================

// GET /api/portfolio/public/:slug - Public media kit data
router.get('/public/:slug', async (req, res) => {
  const { slug } = req.params;
  const cleanSlug = slugify(slug);

  try {
    const { rows } = await pool.query(
      `SELECT 
        p.id, p.slug, p.is_published, p.display_name, p.tagline, p.bio,
        p.avatar_url, p.banner_url, p.theme_color, p.primary_platform,
        p.follower_count, p.social_links, p.featured_media, p.services,
        p.created_at,
        u.name as agency_verified_name
       FROM creator_portfolios p
       JOIN auth_users u ON p.user_id = u.id
       WHERE LOWER(p.slug) = LOWER($1)`,
      [cleanSlug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    const portfolio = rows[0];
    if (!portfolio.is_published) {
      return res.status(404).json({ error: 'This portfolio is currently in draft mode.' });
    }

    res.json({
      portfolio,
      agency: {
        name: 'Falcus Media',
        verified: true,
        logo: '/favicon.jpg'
      }
    });
  } catch (err) {
    console.error('Error fetching public portfolio:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/portfolio/public/:slug/inquiry - Submit brand inquiry
router.post('/public/:slug/inquiry', async (req, res) => {
  const { slug } = req.params;
  const cleanSlug = slugify(slug);
  const { brand_name, contact_name, contact_email, budget, campaign_details } = req.body;

  if (!brand_name || !contact_name || !contact_email || !campaign_details) {
    return res.status(400).json({ error: 'Brand name, contact name, email, and campaign details are required.' });
  }

  try {
    const { rows: portfolioRows } = await pool.query(
      'SELECT id, user_id FROM creator_portfolios WHERE LOWER(slug) = LOWER($1)',
      [cleanSlug]
    );

    if (portfolioRows.length === 0) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    const portfolio = portfolioRows[0];

    const { rows } = await pool.query(
      `INSERT INTO portfolio_inquiries (
        portfolio_id, creator_id, brand_name, contact_name, contact_email,
        budget, campaign_details, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'NEW', NOW())
      RETURNING *`,
      [
        portfolio.id,
        portfolio.user_id,
        brand_name,
        contact_name,
        contact_email,
        budget || 'Flexible',
        campaign_details
      ]
    );

    res.json({
      success: true,
      message: 'Inquiry submitted successfully! The creator and their management team will review your proposal.',
      inquiry_id: rows[0].id
    });
  } catch (err) {
    console.error('Error submitting inquiry:', err);
    res.status(500).json({ error: 'Server error submitting inquiry' });
  }
});

export default router;
