import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedAdmin from './adminSeeder.js';
import { User, Carpool, RideRequest, UserPreferences, Feedback, Notification } from '../models/index.js';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await initializeDB();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const initializeDB = async () => {
  try {
    // Create indexes for all collections
    await Promise.all([
      // User indexes
      User.createIndexes(),
      
      // Carpool indexes
      Carpool.createIndexes(),
      
      // RideRequest indexes
      RideRequest.createIndexes(),
      
      // UserPreferences indexes
      UserPreferences.createIndexes(),
      
      // Feedback indexes
      Feedback.createIndexes(),
      
      // Notification TTL index
      Notification.createIndexes()
    ]);

    // Seed admin user
    await seedAdmin();
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error.message);
    throw error;
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.log(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

export default connectDB; 