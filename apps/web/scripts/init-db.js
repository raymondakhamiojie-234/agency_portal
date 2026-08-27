import { Pool } from '@neondatabase/serverless';


async function initDb() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Connecting to database...');
    
    // 1. Update auth_users to include role and status
    console.log('Updating auth_users...');
    await pool.query(`
      ALTER TABLE auth_users 
      ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'CREATOR',
      ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'ACTIVE',
      ADD COLUMN IF NOT EXISTS phone_number VARCHAR(50),
      ADD COLUMN IF NOT EXISTS manager_id UUID,
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);

    // 2. Earnings Table
    console.log('Creating earnings table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS earnings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id INTEGER REFERENCES auth_users(id) ON DELETE CASCADE,
        platform VARCHAR(100) NOT NULL,
        period VARCHAR(100) NOT NULL,
        amount DECIMAL(12, 2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'NGN',
        status VARCHAR(50) DEFAULT 'PENDING',
        payment_status VARCHAR(50) DEFAULT 'UNPAID',
        notes TEXT,
        date_uploaded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Monetization Table
    console.log('Creating monetization table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS monetization (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id INTEGER REFERENCES auth_users(id) ON DELETE CASCADE,
        platform VARCHAR(100) NOT NULL,
        monetization_status VARCHAR(50) DEFAULT 'Not Eligible',
        eligibility_status VARCHAR(50) DEFAULT 'Pending',
        monetization_date TIMESTAMP,
        revenue DECIMAL(12, 2) DEFAULT 0,
        requirements TEXT,
        notes TEXT,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Payments Table
    console.log('Creating payments table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id INTEGER REFERENCES auth_users(id) ON DELETE CASCADE,
        amount DECIMAL(12, 2) NOT NULL,
        payment_date TIMESTAMP,
        payment_cycle VARCHAR(100),
        payment_method VARCHAR(100),
        reference_number VARCHAR(100),
        status VARCHAR(50) DEFAULT 'Pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Loans Table
    console.log('Creating loans table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS loans (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id INTEGER REFERENCES auth_users(id) ON DELETE CASCADE,
        requested_amount DECIMAL(12, 2) NOT NULL,
        approved_amount DECIMAL(12, 2) DEFAULT 0,
        interest DECIMAL(12, 2) DEFAULT 0,
        penalty DECIMAL(12, 2) DEFAULT 0,
        total_repayment DECIMAL(12, 2) DEFAULT 0,
        amount_paid DECIMAL(12, 2) DEFAULT 0,
        remaining_balance DECIMAL(12, 2) DEFAULT 0,
        due_date TIMESTAMP,
        days_overdue INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'Pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Invoices Table
    console.log('Creating invoices table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id INTEGER REFERENCES auth_users(id) ON DELETE CASCADE,
        invoice_number VARCHAR(100) UNIQUE NOT NULL,
        billing_period VARCHAR(100),
        earnings_amount DECIMAL(12, 2) DEFAULT 0,
        deductions DECIMAL(12, 2) DEFAULT 0,
        loan_deductions DECIMAL(12, 2) DEFAULT 0,
        final_amount DECIMAL(12, 2) DEFAULT 0,
        payment_status VARCHAR(50) DEFAULT 'Unpaid',
        pdf_url TEXT,
        date_generated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 7. Notifications Table
    console.log('Creating notifications table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id INTEGER REFERENCES auth_users(id) ON DELETE CASCADE, -- NULL means broadcast
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50),
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 8. Announcements Table
    console.log('Creating announcements table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS announcements (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 9. Audit Logs Table
    console.log('Creating audit logs table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id INTEGER REFERENCES auth_users(id) ON DELETE SET NULL,
        action VARCHAR(255) NOT NULL,
        entity VARCHAR(100),
        entity_id UUID,
        previous_value JSONB,
        new_value JSONB,
        ip_address VARCHAR(50),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Database initialization complete!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await pool.end();
  }
}

initDb();
