import app from './app.js';
import config from './config/config.js';
import logger from './utils/logger.js';
import connectDB from './utils/db.js';

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start the server
    app.listen(config.port, () => {
      logger.info(`
=================================
🚀 Server running in ${config.env} mode
📡 Port: ${config.port}
=================================
      `);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err);
  process.exit(1);
});

startServer(); 