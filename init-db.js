const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Read the schema file
const schemaSQL = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf8');

const isLocal = process.env.NODE_ENV !== 'production';
// Connect to database
const pool = new Pool({
  connectionString: isLocal ? process.env.EXTERNAL_DATABASE_URL : process.env.DATABASE_URL,
  ssl: isLocal ? { rejectUnauthorized: false } : false,
  user: process.env.DATABASE_URL ? undefined : process.env.DB_USER,
  host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST,
  database: process.env.DATABASE_URL ? undefined : process.env.DB_NAME,
  password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD,
  port: process.env.DATABASE_URL ? undefined : process.env.DB_PORT || 5432,
});

async function initializeDatabase() {
  try {
    console.log('Running database initialization script...');
    await pool.query(schemaSQL);
    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await pool.end();
  }
}

initializeDatabase();