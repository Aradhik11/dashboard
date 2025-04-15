// File: app.js
const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');
const accountRoutes = require('./routes/accountRoutes');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Set up PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || null,
    // If DATABASE_URL is not provided, use individual connection parameters
    user: process.env.DATABASE_URL ? undefined : process.env.DB_USER,
    host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST,
    database: process.env.DATABASE_URL ? undefined : process.env.DB_NAME,
    password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD,
    port: process.env.DATABASE_URL ? undefined : process.env.DB_PORT || 5432,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

// Export pool for use in other modules
app.locals.pool = pool;

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging
app.use(bodyParser.json()); // Parse JSON bodies
app.use(cors());

// Routes
app.use('/api/accounts', accountRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;