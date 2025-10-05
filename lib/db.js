/**
 * Database connection utility
 * Connects to Heroku Postgres
 */

const { Pool } = require('pg');

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});

// Test connection
pool.on('connect', () => {
  console.log('[DB] Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('[DB] Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
