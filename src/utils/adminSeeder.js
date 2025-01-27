import { User } from '../models/index.js';
import bcrypt from 'bcryptjs';
import logger from './logger.js';
import config from '../config/config.js';

const seedAdmin = async () => {
  try {
    logger.info('Checking for admin user...');
    const adminExists = await User.findOne({ isAdmin: true });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
      
      const admin = await User.create({
        name: 'Admin',
        email: config.adminEmail || 'admin@looptogether.com',
        password: hashedPassword,
        isAdmin: true,
        isVerified: true,
        gender: 'Other'
      });

      logger.info('Admin user created successfully');
      return admin;
    }
    
    logger.info('Admin user already exists');
    return adminExists;
  } catch (error) {
    logger.error('Error seeding admin:', error.message);
    throw error;
  }
};

export default seedAdmin; 