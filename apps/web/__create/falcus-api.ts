import { Hono } from 'hono';
import { getAuthUser } from '@hono/auth-js';
import { Pool } from '@neondatabase/serverless';

// Create a separate Hono app for all our custom Falcus Media endpoints
export const falcusApi = new Hono();

// Shared pool instance
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middleware to ensure user is logged in
falcusApi.use('*', async (c, next) => {
  const authUser = await getAuthUser(c);
  if (!authUser || !authUser.session?.user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  // Store user in context
  c.set('user', authUser.session.user);
  await next();
});

// Admin Middleware
const requireAdmin = async (c: any, next: any) => {
  const user = c.get('user');
  if (user.role !== 'ADMIN') {
    return c.json({ error: 'Forbidden: Admin access required' }, 403);
  }
  await next();
};

// ==========================================
// CREATOR ENDPOINTS
// ==========================================

falcusApi.get('/dashboard/creator', async (c) => {
  try {
    const user = c.get('user');
    const userId = user.id;
    
    // 1. Total Earnings
    const totalEarningsRes = await pool.query(
      "SELECT SUM(amount) FROM earnings WHERE user_id = $1", 
      [userId]
    );
    const totalEarnings = parseFloat(totalEarningsRes.rows[0]?.sum || '0');
    
    // 2. Current Earnings (Unpaid)
    const currentEarningsRes = await pool.query(
      "SELECT SUM(amount) FROM earnings WHERE user_id = $1 AND payment_status = 'UNPAID'", 
      [userId]
    );
    const currentEarnings = parseFloat(currentEarningsRes.rows[0]?.sum || '0');
    
    // 3. Total Paid
    const totalPaidRes = await pool.query(
      "SELECT SUM(amount) FROM payments WHERE user_id = $1 AND status = 'COMPLETED'", 
      [userId]
    );
    const totalPaid = parseFloat(totalPaidRes.rows[0]?.sum || '0');
    
    // 4. Outstanding Loan
    const loanRes = await pool.query(
      "SELECT SUM(remaining_balance) FROM loans WHERE user_id = $1 AND status = 'ACTIVE'", 
      [userId]
    );
    const outstandingLoan = parseFloat(loanRes.rows[0]?.sum || '0');
    
    // 5. Available Loan (50% of Total Earnings minus outstanding)
    const availableLoan = Math.max((totalEarnings * 0.5) - outstandingLoan, 0);

    return c.json({
      totalEarnings,
      currentEarnings,
      totalPaid,
      outstandingLoan,
      availableLoan
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

// Creator Payments
falcusApi.get('/payments', async (c) => {
  try {
    const user = c.get('user');
    const res = await pool.query(
      "SELECT * FROM payments WHERE user_id = $1 ORDER BY payment_date DESC",
      [user.id]
    );
    return c.json(res.rows);
  } catch (error) {
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

// Creator Earnings
falcusApi.get('/earnings', async (c) => {
  try {
    const user = c.get('user');
    const res = await pool.query(
      "SELECT * FROM earnings WHERE user_id = $1 ORDER BY date_uploaded DESC",
      [user.id]
    );
    return c.json(res.rows);
  } catch (error) {
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

// ==========================================
// ADMIN ENDPOINTS
// ==========================================

// Get all creators
falcusApi.get('/admin/creators', requireAdmin, async (c) => {
  try {
    const res = await pool.query(
      "SELECT id, name, email, image, role, status FROM auth_users WHERE role = 'CREATOR' ORDER BY created_at DESC"
    );
    return c.json(res.rows);
  } catch (error) {
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

// Get all earnings
falcusApi.get('/admin/earnings', requireAdmin, async (c) => {
  try {
    const res = await pool.query(`
      SELECT e.*, u.name as creator_name, u.email as creator_email 
      FROM earnings e
      JOIN auth_users u ON e.user_id = u.id
      ORDER BY e.date_uploaded DESC
    `);
    return c.json(res.rows);
  } catch (error) {
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

// Create single earning
falcusApi.post('/admin/earnings', requireAdmin, async (c) => {
  try {
    const body = await c.req.json();
    const { user_id, platform, period, amount, currency, status, payment_status, notes } = body;
    
    const res = await pool.query(`
      INSERT INTO earnings (user_id, platform, period, amount, currency, status, payment_status, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [user_id, platform, period, amount, currency || 'NGN', status || 'PENDING', payment_status || 'UNPAID', notes]);
    
    return c.json(res.rows[0]);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
});

// Update single earning
falcusApi.put('/admin/earnings/:id', requireAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { platform, period, amount, currency, status, payment_status, notes } = body;
    
    const res = await pool.query(`
      UPDATE earnings
      SET platform = COALESCE($1, platform),
          period = COALESCE($2, period),
          amount = COALESCE($3, amount),
          currency = COALESCE($4, currency),
          status = COALESCE($5, status),
          payment_status = COALESCE($6, payment_status),
          notes = COALESCE($7, notes),
          updated_at = NOW()
      WHERE id = $8
      RETURNING *
    `, [platform, period, amount, currency, status, payment_status, notes, id]);
    
    return c.json(res.rows[0]);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
});

// Delete single earning
falcusApi.delete('/admin/earnings/:id', requireAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    await pool.query("DELETE FROM earnings WHERE id = $1", [id]);
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
});

// CSV Import Earnings
falcusApi.post('/admin/earnings/import', requireAdmin, async (c) => {
  try {
    const body = await c.req.json();
    const { records } = body; // Array of validated objects
    
    if (!Array.isArray(records)) {
      return c.json({ error: 'Records must be an array' }, 400);
    }
    
    let imported = 0;
    let failed = 0;
    const errors: any[] = [];
    
    // We do this serially for safety, could be optimized with a transaction block
    for (const record of records) {
      try {
        const { email, platform, period, amount, currency, status } = record;
        
        // Find user_id by email
        const userRes = await pool.query("SELECT id FROM auth_users WHERE email = $1", [email]);
        if (userRes.rowCount === 0) {
          failed++;
          errors.push({ email, error: 'User not found' });
          continue;
        }
        const user_id = userRes.rows[0].id;
        
        await pool.query(`
          INSERT INTO earnings (user_id, platform, period, amount, currency, status, payment_status)
          VALUES ($1, $2, $3, $4, $5, $6, 'UNPAID')
        `, [user_id, platform, period, amount, currency || 'NGN', status || 'PENDING']);
        
        imported++;
      } catch (err: any) {
        failed++;
        errors.push({ record, error: err.message });
      }
    }
    
    return c.json({ imported, failed, errors });
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
});

// Get all payments (Admin)
falcusApi.get('/admin/payments', requireAdmin, async (c) => {
  try {
    const res = await pool.query(`
      SELECT p.*, u.name as creator_name, u.email as creator_email 
      FROM payments p
      JOIN auth_users u ON p.user_id = u.id
      ORDER BY p.payment_date DESC
    `);
    return c.json(res.rows);
  } catch (error) {
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

// ==========================================
// LOANS API
// ==========================================

falcusApi.get('/loans/eligibility', async (c) => {
  try {
    const user = c.get('user');
    const userId = user.id;

    // Total Earnings (verified)
    const totalEarningsRes = await pool.query(
      "SELECT SUM(amount) FROM earnings WHERE user_id = $1 AND status = 'VERIFIED'", 
      [userId]
    );
    const totalEarnings = parseFloat(totalEarningsRes.rows[0]?.sum || '0');

    // Outstanding Loan
    const loanRes = await pool.query(
      "SELECT SUM(remaining_balance) FROM loans WHERE user_id = $1 AND status = 'ACTIVE'", 
      [userId]
    );
    const outstandingLoan = parseFloat(loanRes.rows[0]?.sum || '0');

    // Available Loan is 50% of Total Earnings minus outstanding
    const availableLoan = Math.max((totalEarnings * 0.5) - outstandingLoan, 0);

    return c.json({ totalEarnings, outstandingLoan, availableLoan });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

falcusApi.get('/loans', async (c) => {
  try {
    const user = c.get('user');
    const res = await pool.query(
      "SELECT * FROM loans WHERE user_id = $1 ORDER BY request_date DESC",
      [user.id]
    );
    return c.json(res.rows);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

falcusApi.post('/loans/apply', async (c) => {
  try {
    const user = c.get('user');
    const { amount } = await c.req.json();
    const requestedAmount = parseFloat(amount);

    if (isNaN(requestedAmount) || requestedAmount <= 0) {
      return c.json({ error: 'Invalid amount' }, 400);
    }

    // Double check eligibility
    const totalEarningsRes = await pool.query(
      "SELECT SUM(amount) FROM earnings WHERE user_id = $1 AND status = 'VERIFIED'", 
      [user.id]
    );
    const totalEarnings = parseFloat(totalEarningsRes.rows[0]?.sum || '0');

    const loanRes = await pool.query(
      "SELECT SUM(remaining_balance) FROM loans WHERE user_id = $1 AND status = 'ACTIVE'", 
      [user.id]
    );
    const outstandingLoan = parseFloat(loanRes.rows[0]?.sum || '0');
    const availableLoan = Math.max((totalEarnings * 0.5) - outstandingLoan, 0);

    if (requestedAmount > availableLoan) {
      return c.json({ error: 'Requested amount exceeds eligible loan balance' }, 400);
    }

    const interest = requestedAmount * 0.15; // 15% interest
    const totalToRepay = requestedAmount + interest;

    const res = await pool.query(`
      INSERT INTO loans (user_id, requested_amount, approved_amount, interest, remaining_balance, status)
      VALUES ($1, $2, 0, $3, $4, 'PENDING')
      RETURNING *
    `, [user.id, requestedAmount, interest, totalToRepay]);

    return c.json(res.rows[0]);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Admin get loans
falcusApi.get('/admin/loans', requireAdmin, async (c) => {
  try {
    const res = await pool.query(`
      SELECT l.*, u.name as creator_name, u.email as creator_email
      FROM loans l
      JOIN auth_users u ON l.user_id = u.id
      ORDER BY l.request_date DESC
    `);
    return c.json(res.rows);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

falcusApi.put('/admin/loans/:id/status', requireAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    const { status, approved_amount } = await c.req.json();
    
    // Fetch loan
    const loanQuery = await pool.query("SELECT * FROM loans WHERE id = $1", [id]);
    if (loanQuery.rowCount === 0) return c.json({ error: 'Not found' }, 404);
    
    let query = "UPDATE loans SET status = $1, updated_at = NOW()";
    const values: any[] = [status, id];
    
    if (status === 'ACTIVE') {
      // Approve it
      const amount = parseFloat(approved_amount) || parseFloat(loanQuery.rows[0].requested_amount);
      const interest = amount * 0.15;
      const balance = amount + interest;
      
      query = "UPDATE loans SET status = $1, approved_amount = $3, interest = $4, remaining_balance = $5, updated_at = NOW() WHERE id = $2 RETURNING *";
      values.push(amount, interest, balance);
      
      const res = await pool.query(query, values);
      return c.json(res.rows[0]);
    } else {
      query += " WHERE id = $2 RETURNING *";
      const res = await pool.query(query, values);
      return c.json(res.rows[0]);
    }
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// ==========================================
// INVOICES API
// ==========================================

falcusApi.get('/invoices', async (c) => {
  try {
    const user = c.get('user');
    const res = await pool.query(
      "SELECT * FROM invoices WHERE user_id = $1 ORDER BY issue_date DESC",
      [user.id]
    );
    return c.json(res.rows);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

falcusApi.get('/invoices/:id/download', async (c) => {
  try {
    const user = c.get('user');
    const id = c.req.param('id');
    
    // We must check if the invoice belongs to the user, or if they are admin
    const res = await pool.query(`
      SELECT i.*, u.name, u.email 
      FROM invoices i 
      JOIN auth_users u ON i.user_id = u.id 
      WHERE i.id = $1
    `, [id]);
    
    if (res.rowCount === 0) return c.text('Invoice not found', 404);
    
    const invoice = res.rows[0];
    if (invoice.user_id !== user.id && user.role !== 'ADMIN') {
      return c.text('Forbidden', 403);
    }
    
    // Return HTML printable invoice
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${invoice.invoice_number}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #6366FF; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #6366FF; }
          .invoice-details { text-align: right; }
          .parties { display: flex; justify-content: space-between; margin-bottom: 40px; }
          table { w-full: 100%; width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f9f9f9; }
          .total { font-size: 20px; font-weight: bold; text-align: right; margin-top: 20px; color: #6366FF; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">Falcus Media Ltd</div>
            <p>123 Creator Lane<br>Lagos, Nigeria</p>
          </div>
          <div class="invoice-details">
            <h2>INVOICE</h2>
            <p><strong>Invoice #:</strong> ${invoice.invoice_number}</p>
            <p><strong>Date:</strong> ${new Date(invoice.issue_date).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${invoice.status}</p>
          </div>
        </div>
        
        <div class="parties">
          <div>
            <h3>Bill To:</h3>
            <p><strong>${invoice.name}</strong><br>${invoice.email}</p>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align:right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Creator Earnings Payout - ${invoice.period || 'Period'}</td>
              <td style="text-align:right">₦${parseFloat(invoice.amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="total">
          Total: ₦${parseFloat(invoice.amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
        </div>
      </body>
      </html>
    `;
    
    return c.html(html);
  } catch (error: any) {
    return c.text(error.message, 500);
  }
});

// ==========================================
// ADMIN DASHBOARD STATS API
// ==========================================

falcusApi.get('/admin/stats', requireAdmin, async (c) => {
  try {
    const creatorsRes = await pool.query("SELECT COUNT(*) FROM auth_users WHERE role = 'CREATOR'");
    const totalCreators = parseInt(creatorsRes.rows[0].count, 10);

    const loansRes = await pool.query("SELECT COALESCE(SUM(remaining_balance), 0) as total FROM loans WHERE status = 'ACTIVE'");
    const totalActiveLoans = parseFloat(loansRes.rows[0].total);

    const paymentsRes = await pool.query("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'COMPLETED'");
    const totalPayments = parseFloat(paymentsRes.rows[0].total);

    const earningsRes = await pool.query("SELECT COALESCE(SUM(amount), 0) as total FROM earnings");
    const platformEarnings = parseFloat(earningsRes.rows[0].total);

    return c.json({
      totalCreators,
      totalActiveLoans,
      totalPayments,
      platformEarnings
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// ==========================================
// MONETIZATION API
// ==========================================

falcusApi.get('/monetization', async (c) => {
  try {
    const user = c.get('user');
    let userId = user.id;
    
    // If admin is requesting a specific user's monetization
    const queryUserId = c.req.query('userId');
    if (user.role === 'ADMIN' && queryUserId) {
      userId = queryUserId;
    }

    const res = await pool.query(
      "SELECT * FROM monetization WHERE user_id = $1 ORDER BY platform",
      [userId]
    );
    return c.json(res.rows);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

falcusApi.post('/admin/monetization', requireAdmin, async (c) => {
  try {
    const { user_id, platform, handle, current_followers, status } = await c.req.json();
    const res = await pool.query(`
      INSERT INTO monetization (user_id, platform, handle, current_followers, status)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id, platform) 
      DO UPDATE SET handle = $3, current_followers = $4, status = $5, updated_at = NOW()
      RETURNING *
    `, [user_id, platform, handle, current_followers, status]);
    return c.json(res.rows[0]);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// ==========================================
// NOTIFICATIONS API
// ==========================================

falcusApi.get('/notifications', async (c) => {
  try {
    const user = c.get('user');
    const res = await pool.query(
      "SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC",
      [user.id]
    );
    return c.json(res.rows);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

falcusApi.post('/notifications/read', async (c) => {
  try {
    const user = c.get('user');
    await pool.query("UPDATE notifications SET is_read = true WHERE user_id = $1", [user.id]);
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

falcusApi.post('/admin/notifications', requireAdmin, async (c) => {
  try {
    const { user_id, type, title, message } = await c.req.json();
    
    // If user_id is 'ALL', we need to insert for all creators (broadcasting)
    if (user_id === 'ALL') {
      await pool.query(`
        INSERT INTO notifications (user_id, type, title, message)
        SELECT id, $1, $2, $3 FROM auth_users WHERE role = 'CREATOR'
      `, [type, title, message]);
    } else {
      await pool.query(`
        INSERT INTO notifications (user_id, type, title, message)
        VALUES ($1, $2, $3, $4)
      `, [user_id, type, title, message]);
    }
    
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});
