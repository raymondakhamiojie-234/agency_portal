import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pg from 'pg';

import authRoutes from './routes/auth.js';
import creatorRoutes from './routes/creators.js';
import managerRoutes from './routes/manager.js';
import adminRoutes from './routes/admin.js';
import partnerRoutes from './routes/partner.js';
import portfolioRoutes from './routes/portfolio.js';

const { Pool } = pg;
const app = express();
const port = process.env.PORT || 4000;

// PostgreSQL Connection
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
});

pool.connect()
  .then(async () => {
    console.log('Connected to PostgreSQL');
    try {
      const idTypeRes = await pool.query(`
        SELECT data_type 
        FROM information_schema.columns 
        WHERE table_name = 'auth_users' AND column_name = 'id'
      `);
      
      let idType = 'UUID'; // fallback
      if (idTypeRes.rows.length > 0) {
        idType = idTypeRes.rows[0].data_type;
      }

      await pool.query(`
        ALTER TABLE auth_users 
        ADD COLUMN IF NOT EXISTS is_partner BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS partner_percentage DECIMAL(5,2) DEFAULT 0.00;
      `);

      // Try adding partner_id separately to avoid failing the whole block if something goes wrong
      try {
        await pool.query(`
          ALTER TABLE auth_users 
          ADD COLUMN IF NOT EXISTS partner_id ${idType} REFERENCES auth_users(id);
        `);
      } catch(err) {
        console.error('Failed to add partner_id:', err);
      }

      // Try adding assigned_profile_name to creator_profiles
      try {
        await pool.query(`
          ALTER TABLE creator_profiles 
          ADD COLUMN IF NOT EXISTS assigned_profile_name VARCHAR(255);
        `);
      } catch(err) {
        console.error('Failed to add assigned_profile_name to creator_profiles:', err);
      }

      // Try adding account_name to earnings for specific page/channel tracking
      try {
        await pool.query(`
          ALTER TABLE earnings
          ADD COLUMN IF NOT EXISTS account_name VARCHAR(255);
        `);
      } catch(err) {
        console.error('Failed to add account_name to earnings:', err);
      }

      // Portfolio Tables Migrations
      try {
        await pool.query(`
          CREATE TABLE IF NOT EXISTS creator_portfolios (
            id SERIAL PRIMARY KEY,
            user_id ${idType} UNIQUE REFERENCES auth_users(id) ON DELETE CASCADE,
            slug VARCHAR(100) UNIQUE NOT NULL,
            is_published BOOLEAN DEFAULT true,
            display_name VARCHAR(255),
            tagline VARCHAR(255),
            bio TEXT,
            avatar_url TEXT,
            banner_url TEXT,
            theme_color VARCHAR(50) DEFAULT '#6366f1',
            primary_platform VARCHAR(100),
            follower_count BIGINT DEFAULT 0,
            social_links JSONB DEFAULT '[]'::jsonb,
            featured_media JSONB DEFAULT '[]'::jsonb,
            services JSONB DEFAULT '[]'::jsonb,
            contact_email VARCHAR(255),
            created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
          );

          CREATE TABLE IF NOT EXISTS portfolio_inquiries (
            id SERIAL PRIMARY KEY,
            portfolio_id INTEGER REFERENCES creator_portfolios(id) ON DELETE CASCADE,
            creator_id ${idType} REFERENCES auth_users(id) ON DELETE CASCADE,
            brand_name VARCHAR(255) NOT NULL,
            contact_name VARCHAR(255) NOT NULL,
            contact_email VARCHAR(255) NOT NULL,
            budget VARCHAR(100),
            campaign_details TEXT NOT NULL,
            status VARCHAR(50) DEFAULT 'NEW',
            created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
          );
        `);
        console.log('Portfolio tables migration successful');
      } catch(err) {
        console.error('Failed to create portfolio tables:', err);
      }
      
      console.log('DB migrations successful');
    } catch (e) {
      console.error('DB migrations failed', e);
    }
  })
  .catch(err => console.error('PostgreSQL connection error', err));

let frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
if (frontendUrl.endsWith('/')) {
  frontendUrl = frontendUrl.slice(0, -1);
}

const allowedOrigins = [
  frontendUrl,
  'https://agency-creators-portal.vercel.app',
  'https://creators.falcusmedia.com',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.falcusmedia.com') ||
      origin.endsWith('.vercel.app')
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/partner', partnerRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api', creatorRoutes);
app.use('/api/admin', adminRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
