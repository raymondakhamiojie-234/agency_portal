const { Pool } = require('pg');
async function m() {
  const p = new Pool({connectionString: 'postgresql://neondb_owner:npg_34hJdzaoBqAQ@ep-silent-art-ayy6kwrx.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require'});
  await p.query(`INSERT INTO admin_users (username, email, password, full_name, role, is_active) VALUES ('testadmin', 'testadmin@example.com', '$argon2id$v=19$m=65536,t=3,p=4$JQHtbzSf01E+Motim/jJrA$9QEM6HSio1Iyo9zYDHt2yWGtF3zTIdJqz4POHlCbxVI', 'Test Admin', 'admin', true) ON CONFLICT DO NOTHING;`);
  console.log('Test admin created!');
  await p.end();
}
m().catch(console.error);
