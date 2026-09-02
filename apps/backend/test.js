const {Pool} = require('pg'); 
require('dotenv').config(); 
const pool = new Pool({connectionString: process.env.DATABASE_URL, ssl: {rejectUnauthorized: false}}); 
pool.query(`
  SELECT u.id, u.email, u.name, 
         cp.page_name, cp.brand_name, cp.full_name,
         c.revenue_share_percentage
  FROM auth_users u
  LEFT JOIN creator_profiles cp ON u.id = cp.user_id
  LEFT JOIN contracts c ON u.id = c.creator_id AND c.status = 'ACTIVE'
  WHERE u.is_admin = false
`).then(res => { 
  console.log('ROWS:', res.rows.length); 
  process.exit(0); 
}).catch(e => { 
  console.error('ERR:', e.message); 
  process.exit(1); 
});
