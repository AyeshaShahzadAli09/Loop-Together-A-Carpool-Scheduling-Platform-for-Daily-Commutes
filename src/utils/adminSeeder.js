import { User } from '../models/index.js';
import bcrypt from 'bcryptjs';

const seedAdmin = async () => {
  try {
    // Check if admin exists
    const adminExists = await User.findOne({ isAdmin: true });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const admin = await User.create({
        name: 'Admin',
        email: 'admin@looptogether.com',
        password: hashedPassword,
        isAdmin: true,
        isVerified: true,
        gender: 'Other'
      });

      console.log('Admin user created successfully');
      return admin;
    }
    
    console.log('Admin user already exists');
    return adminExists;
  } catch (error) {
    console.error('Error seeding admin:', error.message);
    throw error;
  }
};

export default seedAdmin; 