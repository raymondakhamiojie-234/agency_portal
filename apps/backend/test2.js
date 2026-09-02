import axios from 'axios';
import Papa from 'papaparse';
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({connectionString: process.env.DATABASE_URL, ssl: {rejectUnauthorized: false}});

async function analyzeEarningsRecords(records) {
  const { rows: creators } = await pool.query(`
    SELECT u.id, u.email, u.name, 
           cp.page_name, cp.brand_name, cp.full_name,
           c.revenue_share_percentage
    FROM auth_users u
    LEFT JOIN creator_profiles cp ON u.id = cp.user_id
    LEFT JOIN contracts c ON u.id = c.creator_id AND c.status = 'ACTIVE'
    WHERE u.is_admin = false
  `);

  let perfectMatches = [];
  let similarMatches = [];
  let unmatched = [];

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    let page_name = record.page_name || record.email || record[0];
    let amount = record.amount || record[1] || 0;
    let withholding_tax = record.withholding_tax || record[2] || 0;
    let earning_date = record.earning_date || record.period || record[3] || new Date().toISOString();
    let platform = record.platform || record[4] || 'Facebook';
    let status = record.status || record.payout_status || record[5] || 'UNPAID';

    if (page_name === 'page_name' || page_name === 'email') continue;

    const searchString = String(page_name || '').toLowerCase().trim();
    if (!searchString) continue;

    let exactMatch = creators.find(c => 
      (c.email && c.email.toLowerCase() === searchString) ||
      (c.page_name && c.page_name.toLowerCase() === searchString) ||
      (c.brand_name && c.brand_name.toLowerCase() === searchString) ||
      (c.name && c.name.toLowerCase() === searchString)
    );

    const parsedRecord = {
      original_id: i,
      search_term: searchString,
      platform,
      amount: parseFloat(amount) || 0,
      withholding_tax: parseFloat(withholding_tax) || 0,
      earning_date: earning_date,
      payout_status: status
    };

    if (exactMatch) {
      perfectMatches.push({ ...parsedRecord, creator: exactMatch });
      continue;
    }

    let suggestions = creators.filter(c => 
      (c.page_name && c.page_name.toLowerCase().includes(searchString)) ||
      (searchString.includes(c.page_name?.toLowerCase())) ||
      (c.brand_name && c.brand_name.toLowerCase().includes(searchString)) ||
      (c.name && c.name.toLowerCase().includes(searchString))
    );

    if (suggestions.length > 0) {
      similarMatches.push({ ...parsedRecord, suggestions: suggestions.slice(0, 3) });
    } else {
      unmatched.push({ ...parsedRecord, suggestions: creators.slice(0, 50) });
    }
  }

  return { perfectMatches, similarMatches, unmatched };
}

axios.get('https://docs.google.com/spreadsheets/d/1cPUrbAD5Wl6CzEV4ETEXuKZObSxE7CirY5ebmdn-ZcA/export?format=csv').then(r => {
  Papa.parse(r.data, {
    header: false,
    skipEmptyLines: true,
    complete: async res => {
      try {
        const result = await analyzeEarningsRecords(res.data);
        console.log('SUCCESS! Perfect:', result.perfectMatches.length, 'Similar:', result.similarMatches.length, 'Unmatched:', result.unmatched.length);
        process.exit(0);
      } catch (e) {
        console.error('CRASH:', e);
        process.exit(1);
      }
    }
  })
})
