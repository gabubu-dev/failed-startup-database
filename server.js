require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { initDatabase, closeDatabase } = require('./database/db');

// Import routes
const startupsRouter = require('./routes/startups');
const foundersRouter = require('./routes/founders');
const investorsRouter = require('./routes/investors');
const metricsRouter = require('./routes/metrics');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Initialize database
try {
  initDatabase();
  console.log('✓ Database initialized');
} catch (error) {
  console.error('✗ Failed to initialize database:', error);
  process.exit(1);
}

// API routes
app.use('/api/startups', startupsRouter);
app.use('/api/founders', foundersRouter);
app.use('/api/investors', investorsRouter);
app.use('/api/metrics', metricsRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Failed Startup Database API',
    version: '1.0.0',
    endpoints: {
      startups: '/api/startups',
      founders: '/api/founders',
      investors: '/api/investors',
      metrics: '/api/metrics',
      stats: '/api/startups/stats'
    },
    documentation: 'See README.md for full API documentation'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║   Failed Startup Database API                  ║
║   Server running on http://localhost:${PORT}     ║
║   Environment: ${process.env.NODE_ENV || 'development'}                   ║
╚════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\nSIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✓ HTTP server closed');
    closeDatabase();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('✓ HTTP server closed');
    closeDatabase();
    process.exit(0);
  });
});

module.exports = app;
