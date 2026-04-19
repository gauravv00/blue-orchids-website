const app = require('../server/app');
const { sequelize } = require('../server/config/database');

// Vercel Serverless Function Entrypoint
module.exports = async (req, res) => {
  try {
    // Authenticate with DB on cold start (Vercel uses connection pooling usually, but this is simple)
    await sequelize.authenticate();
    // Do NOT sync on every request in production, assuming DB is already seeded.
  } catch (error) {
    console.error('Database connection failed. Please ensure DB_HOST and credentials in Vercel Environment Variables are correct for a remote DB:', error.message);
  }
  
  return app(req, res);
};
