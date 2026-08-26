const fs = require('fs');
const { Pool } = require('pg');

async function migrate() {
  const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_34hJdzaoBqAQ@ep-silent-art-ayy6kwrx.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require'
  });
  
  const content = fs.readFileSync('C:/Users/hp/Desktop/Agency Dashboard/production.sql', 'utf8');
  const lines = content.split('\n');
  
  let currentSql = '';
  let inCopy = false;
  let copyTable = '';
  let copyColumns = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (inCopy) {
      if (line === '\\.') {
        inCopy = false;
        continue;
      }
      // Parse COPY data to INSERT
      const values = line.split('\t').map(v => {
        if (v === '\\N') return 'NULL';
        // handle postgres dump escapes
        let str = v.replace(/\\b/g, '\b')
                   .replace(/\\f/g, '\f')
                   .replace(/\\n/g, '\n')
                   .replace(/\\r/g, '\r')
                   .replace(/\\t/g, '\t')
                   .replace(/\\v/g, '\v')
                   .replace(/\\\\/g, '\\');
        return "'" + str.replace(/'/g, "''") + "'";
      });
      const insertSql = `INSERT INTO ${copyTable} ${copyColumns} VALUES (${values.join(', ')});`;
      try {
        await pool.query(insertSql);
      } catch (e) {
        console.error(`Error inserting into ${copyTable}:`, e.message);
      }
      continue;
    }
    
    if (line.startsWith('COPY ')) {
      // COPY public.admin_users (id, username, email) FROM stdin;
      const match = line.match(/COPY (.*?) \((.*?)\) FROM stdin;/);
      if (match) {
        copyTable = match[1];
        copyColumns = `(${match[2]})`;
      } else {
        const match2 = line.match(/COPY (.*?) FROM stdin;/);
        if (match2) {
          copyTable = match2[1];
          copyColumns = '';
        }
      }
      inCopy = true;
      continue;
    }
    
    // Ignore comments
    if (line.startsWith('--') || line.trim() === '') {
      continue;
    }
    
    currentSql += line + '\n';
    
    if (line.trim().endsWith(';')) {
      try {
        await pool.query(currentSql);
      } catch (e) {
        if (!e.message.includes('already exists') && !e.message.includes('does not exist') && !e.message.includes('multiple primary keys')) {
          console.error('Error executing DDL:', currentSql.substring(0, 50), e.message);
        }
      }
      currentSql = '';
    }
  }
  
  await pool.end();
  console.log('Migration finished!');
}

migrate().catch(console.error);
