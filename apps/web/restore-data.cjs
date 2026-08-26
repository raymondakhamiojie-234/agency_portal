const fs = require('fs');
const { Pool } = require('pg');

async function restore() {
  const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_34hJdzaoBqAQ@ep-silent-art-ayy6kwrx.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require'
  });
  
  console.log('Fetching foreign keys...');
  const res = await pool.query("SELECT table_name, constraint_name FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY' AND table_schema = 'public'");
  const fks = res.rows;
  
  console.log(`Dropping ${fks.length} foreign keys...`);
  for (const fk of fks) {
    await pool.query(`ALTER TABLE "${fk.table_name}" DROP CONSTRAINT "${fk.constraint_name}"`);
  }
  
  console.log('Truncating tables...');
  const tableRes = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
  for (const table of tableRes.rows) {
    try {
      await pool.query(`TRUNCATE TABLE "${table.table_name}" CASCADE`);
    } catch (e) {
      // Ignore if table cannot be truncated (like spatial_ref_sys)
    }
  }

  console.log('Reading dump...');
  const content = fs.readFileSync('C:/Users/hp/Desktop/Agency Dashboard/production.sql', 'utf8');
  const lines = content.split('\n');
  
  let inCopy = false;
  let copyTable = '';
  let copyColumns = '';
  let insertPromises = [];
  
  console.log('Inserting data...');
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
        if (v === '') return 'NULL'; 
        
        let str = v.replace(/\\b/g, '\b')
                   .replace(/\\f/g, '\f')
                   .replace(/\\n/g, '\n')
                   .replace(/\\r/g, '\r')
                   .replace(/\\t/g, '\t')
                   .replace(/\\v/g, '\v')
                   .replace(/\\\\/g, '\\');
        return "'" + str.replace(/'/g, "''") + "'";
      });
      
      const insertSql = `INSERT INTO "${copyTable.replace(/"/g, '')}" ${copyColumns} VALUES (${values.join(', ')}) ON CONFLICT DO NOTHING;`;
      
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
  }
  
  if (insertPromises.length > 0) {
    await Promise.all(insertPromises);
  }
  
  console.log('Re-adding foreign keys...');
  let currentSql = '';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].replace(/\r$/, '');
    if (line.startsWith('ALTER TABLE ONLY') || currentSql !== '') {
      currentSql += line + '\n';
      if (line.endsWith(';')) {
        if (currentSql.includes('ADD CONSTRAINT') && currentSql.includes('FOREIGN KEY')) {
          try {
            await pool.query(currentSql);
          } catch (e) {
            console.error('Error re-adding FK:', e.message);
          }
        }
        currentSql = '';
      }
    }
  }

  // Also fix sequences
  console.log('Fixing sequences...');
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
    END $$;
  `);

  await pool.end();
  console.log('Restore finished!');
}

restore().catch(console.error);
