import 'dotenv/config';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function createTables() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Support Ticket Messages (replies to a ticket)
    await client.query(`
      CREATE TABLE IF NOT EXISTS support_ticket_messages (
        id SERIAL PRIMARY KEY,
        ticket_id INTEGER REFERENCES support_tickets(id) ON DELETE CASCADE,
        sender_id INTEGER NOT NULL, -- can be creator or admin
        sender_role VARCHAR(50) NOT NULL, -- 'CREATOR' or 'ADMIN' or 'MANAGER'
        message TEXT NOT NULL,
        attachments TEXT[],
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // 2. Manager Updates (announcements from manager)
    await client.query(`
      CREATE TABLE IF NOT EXISTS manager_updates (
        id SERIAL PRIMARY KEY,
        creator_id INTEGER NOT NULL,
        manager_id INTEGER,
        manager_name VARCHAR(255),
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        priority VARCHAR(50) DEFAULT 'Normal',
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // 3. Manager Tasks / Recommendations
    await client.query(`
      CREATE TABLE IF NOT EXISTS manager_tasks (
        id SERIAL PRIMARY KEY,
        creator_id INTEGER NOT NULL,
        manager_id INTEGER,
        platform VARCHAR(100),
        area VARCHAR(100),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        expected_goal TEXT,
        action_required TEXT,
        status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'In Progress', 'Completed'
        created_at TIMESTAMP DEFAULT NOW(),
        completed_at TIMESTAMP
      );
    `);

    // 4. Direct Chat Messages (Creator <-> Manager)
    await client.query(`
      CREATE TABLE IF NOT EXISTS manager_chat_messages (
        id SERIAL PRIMARY KEY,
        creator_id INTEGER NOT NULL,
        manager_id INTEGER,
        sender_id INTEGER NOT NULL,
        sender_role VARCHAR(50) NOT NULL, -- 'CREATOR' or 'MANAGER'
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // 5. Meetings
    await client.query(`
      CREATE TABLE IF NOT EXISTS meetings (
        id SERIAL PRIMARY KEY,
        creator_id INTEGER NOT NULL,
        manager_id INTEGER,
        manager_name VARCHAR(255),
        title VARCHAR(255) NOT NULL,
        purpose VARCHAR(255),
        meeting_date DATE NOT NULL,
        meeting_time VARCHAR(50) NOT NULL,
        notes TEXT,
        google_meet_link TEXT,
        status VARCHAR(50) DEFAULT 'Requested', -- 'Requested', 'Confirmed', 'Rescheduled', 'Cancelled', 'Completed'
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // If support_tickets doesn't have platform and category, add them.
    // Also, creator_profiles needs an assigned_manager field if we want to store it, but let's check first.
    // We'll alter support_tickets safely:
    await client.query(`
      ALTER TABLE support_tickets 
      ADD COLUMN IF NOT EXISTS platform VARCHAR(100),
      ADD COLUMN IF NOT EXISTS category VARCHAR(100);
    `);

    await client.query('COMMIT');
    console.log("Successfully created all Support & Manager tables.");
  } catch (err) {
    await client.query('ROLLBACK');
    console.error("Error creating tables:", err);
  } finally {
    client.release();
    pool.end();
  }
}

createTables();
