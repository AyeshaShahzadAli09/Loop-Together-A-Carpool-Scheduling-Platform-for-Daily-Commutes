import mongoose from 'mongoose';
import config from '../config/config.js';
import logger from './logger.js';
import seedAdmin from './adminSeeder.js';
import { User, Carpool, RideRequest, UserPreferences, Feedback, Notification } from '../models/index.js';

const dropCollectionIndexes = async (collection) => {
  try {
    await collection.collection.dropIndexes();
    logger.debug(`Dropped indexes for ${collection.collection.name}`);
  } catch (error) {
    if (error.code !== 26) { // Ignore "namespace does not exist" errors
      logger.warn(`Warning dropping indexes for ${collection.collection.name}:`, error.message);
    }
  }
};

const createCollectionIndexes = async (collection) => {
  try {
    await collection.createIndexes();
    logger.debug(`Created indexes for ${collection.collection.name}`);
  } catch (error) {
    logger.error(`Error creating indexes for ${collection.collection.name}:`, error.message);
    throw error;
  }
};

const initializeDB = async () => {
  try {
    logger.info('Initializing database...');
    
    // Drop existing indexes one by one
    logger.info('Dropping existing indexes...');
    await Promise.all([
      dropCollectionIndexes(User),
      dropCollectionIndexes(Carpool),
      dropCollectionIndexes(RideRequest),
      dropCollectionIndexes(UserPreferences),
      dropCollectionIndexes(Feedback),
      dropCollectionIndexes(Notification)
    ]);

    // Create indexes one by one
    logger.info('Creating new indexes...');
    await Promise.all([
      createCollectionIndexes(User),
      createCollectionIndexes(Carpool),
      createCollectionIndexes(RideRequest),
      createCollectionIndexes(UserPreferences),
      createCollectionIndexes(Feedback),
      createCollectionIndexes(Notification)
    ]);

    logger.info('Database indexes created successfully');

    // Seed admin user
    await seedAdmin();
    logger.info('Database initialization completed');
  } catch (error) {
    logger.error('Database initialization error:', error.message);
    throw error;
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    await initializeDB();
  } catch (error) {
    logger.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  logger.info('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  logger.error(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('Mongoose disconnected');
});

// Handle application termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    logger.info('Mongoose connection closed through app termination');
    process.exit(0);
  } catch (err) {
    logger.error('Error during database disconnection:', err);
    process.exit(1);
  }
});

export default connectDB; 