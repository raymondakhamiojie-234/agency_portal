const fs = require('fs');
const { Pool } = require('pg');

async function migrate() {
  const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_34hJdzaoBqAQ@ep-silent-art-ayy6kwrx.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require'
  });
  
  // Disable FK constraints
  await pool.query("SET session_replication_role = 'replica';");

  const content = fs.readFileSync('C:/Users/hp/Desktop/Agency Dashboard/production.sql', 'utf8');
  const lines = content.split('\n');
  
  let inCopy = false;
  let copyTable = '';
  let copyColumns = '';
  
  let insertPromises = [];
  
  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.replace(/\r$/, '');
    
    if (inCopy) {
      if (line === '\\.') {
        inCopy = false;
        continue;
      }
      
      const values = line.split('\t').map(v => {
        if (v === '\\N') return 'NULL';
        if (v === '') return 'NULL'; // fallback for empty strings that might be integers
        
        let str = v.replace(/\\b/g, '\b')
                   .replace(/\\f/g, '\f')
                   .replace(/\\n/g, '\n')
                   .replace(/\\r/g, '\r')
                   .replace(/\\t/g, '\t')
                   .replace(/\\v/g, '\v')
                   .replace(/\\\\/g, '\\');
        return "'" + str.replace(/'/g, "''") + "'";
      });
      
      const insertSql = `INSERT INTO ${copyTable} ${copyColumns} VALUES (${values.join(', ')}) ON CONFLICT DO NOTHING;`;
      
      insertPromises.push(
        pool.query(insertSql).catch(e => {
          if (!e.message.includes('multiple primary keys')) {
            console.error(`Error inserting into ${copyTable}:`, e.message);
          }
        })
      );
      
      if (insertPromises.length >= 50) {
        await Promise.all(insertPromises);
        insertPromises = [];
      }
      continue;
    }
    
    if (line.startsWith('COPY ')) {
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
    
    // We already ran the DDLs, skip them to save time.
  }
  
  if (insertPromises.length > 0) {
    await Promise.all(insertPromises);
  }
  
  await pool.query("SET session_replication_role = 'origin';");
  
  // Also fix sequences so we can insert new users!
  await pool.query(`
    DO $$
    DECLARE
      seq_record RECORD;
      max_val BIGINT;
    BEGIN
      FOR seq_record IN SELECT sequence_schema, sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public' LOOP
        EXECUTE 'SELECT COALESCE(MAX(id), 0) + 1 FROM ' || quote_ident(REPLACE(seq_record.sequence_name, '_id_seq', '')) INTO max_val;
        EXECUTE 'ALTER SEQUENCE ' || quote_ident(seq_record.sequence_name) || ' RESTART WITH ' || max_val;
      END LOOP;
    EXCEPTION WHEN OTHERS THEN
      -- ignore sequence reset errors if table doesn't have id column
    END $$;
  `);

  await pool.end();
  console.log('Migration finished!');
}

migrate().catch(console.error);
