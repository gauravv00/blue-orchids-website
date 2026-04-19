/**
 * Blue Orchids – Server Entry Point
 * Loads environment, initializes database, starts Express
 */

console.log('ENV CHECK:', {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
  PORT: process.env.PORT
});

require('dotenv').config();
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
  process.exit(1);
});
const app = require('./server/app');
const { sequelize } = require('./server/config/database');

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ MySQL connected successfully');

    // Sync models (creates tables if they don't exist)
    await sequelize.sync({ alter: false });
    console.log('✅ Database models synchronized');

    // Start listening
    const server = app.listen(PORT, () => {
      console.log(`\n🌸 Blue Orchids server running on http://localhost:${PORT}`);
      console.log(`📋 Admin dashboard: http://localhost:${PORT}/admin.html`);
      console.log(`📡 API base: http://localhost:${PORT}/api\n`);
    });

    return server;
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Only start if this file is run directly (not imported by tests)
if (require.main === module) {
  start();
}

module.exports = { start };
