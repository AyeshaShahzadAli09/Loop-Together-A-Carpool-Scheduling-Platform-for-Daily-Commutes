import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import dotenv from 'dotenv';
import colors from 'colors';

dotenv.config();

const DEFAULT_ADMIN = {
  email: 'admin@looptogether.com',
  password: 'Admin@54321'
};

export const seedAdmin = async () => {
  try {
    console.log('Starting admin seeding process...'.yellow);

    // Use default admin credentials if env vars are not set
    const adminEmail = process.env.ADMIN_EMAIL || DEFAULT_ADMIN.email;
    const adminPassword = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN.password;

    // Check if admin already exists
    const adminExists = await User.findOne({ email: adminEmail });
    
    if (adminExists) {
      console.log('Admin user already exists'.blue);
      return;
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: adminEmail,
      password: adminPassword,
      isAdmin: true,
      isVerified: true
    });

    console.log('Admin user created successfully'.green);
    console.log(`Email: ${adminEmail}`.cyan);
    console.log('Password: [HIDDEN]'.cyan);
  } catch (error) {
    console.error('Error seeding admin:'.red, error);
  }
}; 