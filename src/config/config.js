import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  clerkPublishableKey: process.env.VITE_CLERK_PUBLISHABLE_KEY,
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  clientUrl: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : process.env.CLIENT_URL
};

export default config; 