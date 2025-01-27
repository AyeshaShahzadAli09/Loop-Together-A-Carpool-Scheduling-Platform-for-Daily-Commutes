import mongoose from 'mongoose';
import config from '../config/config.js';
import logger from './logger.js';
import { User, Carpool, RideRequest, UserPreferences, Feedback, Notification } from '../models/index.js';

const resetDatabase = async () => {
  try {
    logger.info('Connecting to database...');
    await mongoose.connect(config.mongoUri);

    logger.info('Dropping all collections...');
    await Promise.all([
      User.collection.drop(),
      Carpool.collection.drop(),
      RideRequest.collection.drop(),
      UserPreferences.collection.drop(),
      Feedback.collection.drop(),
      Notification.collection.drop()
    ]).catch(err => {
      logger.warn('Drop collections warning (can be ignored for first run):', err.message);
    });

    logger.info('Database reset completed');
    process.exit(0);
  } catch (error) {
    logger.error('Database reset error:', error);
    process.exit(1);
  }
};

resetDatabase(); 