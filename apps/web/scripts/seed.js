import { neon } from '@neondatabase/serverless';

async function seed() {
  const sql = neon(process.env.DATABASE_URL);

  try {
    // 1. Get the first user
    const userRes = await sql("SELECT id FROM auth_users LIMIT 1");
    if (userRes.length === 0) {
      console.log("No users found. Please create an account via the frontend first.");
      return;
    }
    const userId = userRes[0].id;
    console.log(`Seeding data for user ${userId}...`);

    // 2. Insert Earnings
    await sql(`
      INSERT INTO earnings (user_id, platform, period, amount, currency, status, payment_status)
      VALUES 
      ($1, 'YouTube', 'August 2026', 150000.00, 'NGN', 'VERIFIED', 'UNPAID'),
      ($1, 'TikTok', 'July 2026', 85000.00, 'NGN', 'VERIFIED', 'PAID'),
      ($1, 'Instagram', 'July 2026', 45000.00, 'NGN', 'VERIFIED', 'PAID')
    `, [userId]);

    // 3. Insert Payments
    await sql(`
      INSERT INTO payments (user_id, amount, payment_date, payment_method, status)
      VALUES 
      ($1, 130000.00, NOW() - INTERVAL '10 days', 'Bank Transfer', 'COMPLETED')
    `, [userId]);

    // 4. Insert Active Loan
    await sql(`
      INSERT INTO loans (user_id, requested_amount, approved_amount, interest, remaining_balance, status)
      VALUES 
      ($1, 50000.00, 50000.00, 7500.00, 57500.00, 'ACTIVE')
    `, [userId]);

    console.log("Seeding complete!");
  } catch (error) {
    console.error("Seeding error:", error.message || error);
  }
}

seed();
