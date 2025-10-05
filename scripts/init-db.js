/**
 * Initialize database schema
 * Run with: node scripts/init-db.js
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function initDatabase() {
  try {
    console.log('[DB Init] Connecting to database...');
    
    // Read SQL file
    const sqlPath = path.join(__dirname, '..', 'lib', 'init-db.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('[DB Init] Creating tables...');
    await pool.query(sql);
    
    console.log('[DB Init] ✅ Database schema initialized successfully!');
    
    // Show tables
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('[DB Init] Tables created:');
    result.rows.forEach(row => console.log(`  - ${row.table_name}`));
    
    process.exit(0);
  } catch (error) {
    console.error('[DB Init] ❌ Error:', error.message);
    console.error('[DB Init] Full error:', error);
    process.exit(1);
  }
}

initDatabase();
