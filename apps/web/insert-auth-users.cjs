const fs = require('fs');
const { Pool } = require('pg');

async function m() {
  const p = new Pool({connectionString: 'postgresql://neondb_owner:npg_34hJdzaoBqAQ@ep-silent-art-ayy6kwrx.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require'});
  
  const content = fs.readFileSync('C:/Users/hp/Desktop/Agency Dashboard/production.sql', 'utf8');
  const lines = content.split('\n');
  
  let inAuthUsers = false;
  let inserts = [];
  
  for (let line of lines) {
    if (line.startsWith('COPY "auth_users" FROM stdin;')) {
      inAuthUsers = true;
      continue;
    }
    
    if (inAuthUsers) {
      if (line === '\\.' || line === '\\.\r') {
        break;
      }
      
      const v = line.replace(/\r$/, '').split('\t');
      
      const id = v[0];
      const name = v[1] === '\\N' ? 'NULL' : `'${v[1].replace(/'/g, "''")}'`;
      const email = v[2] === '\\N' ? 'NULL' : `'${v[2].replace(/'/g, "''")}'`;
      const email_verified = v[3] === '\\N' ? 'NULL' : `'${v[3].replace(/'/g, "''")}'`;
      const image = v[4] === '\\N' ? 'NULL' : `'${v[4].replace(/'/g, "''")}'`;
      const two_factor_enabled = v[5] === 't' ? 'true' : 'false';
      const last_login = v[6] === '\\N' ? 'NULL' : `'${v[6].replace(/'/g, "''")}'`;
      const total_earnings = v[7] === '\\N' ? 'NULL' : v[7];
      const is_banned = v[9] === 't' ? 'true' : 'false';
      const is_admin = v[11] === 't' ? 'true' : 'false';
      
      inserts.push(`(${id}, ${name}, ${email}, ${email_verified}, ${image}, ${two_factor_enabled}, ${last_login}, ${total_earnings}, ${is_banned}, ${is_admin})`);
    }
  }
  
  if (inserts.length > 0) {
    const q = `INSERT INTO auth_users (id, name, email, email_verified, image, two_factor_enabled, last_login, total_earnings, is_banned, is_admin) VALUES ${inserts.join(', ')} ON CONFLICT DO NOTHING;`;
    await p.query(q);
    console.log('auth_users inserted!');
  } else {
    console.log('No auth_users found to insert.');
  }
  
  await p.end();
}
m().catch(console.error);
