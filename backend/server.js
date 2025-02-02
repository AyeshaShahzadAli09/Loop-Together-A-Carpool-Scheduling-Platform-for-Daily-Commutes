import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import { errorHandler } from './middleware/errorHandler.js';
import verificationRoutes from './routes/verification.js';
import profileRoutes from './routes/profile.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import driverRoutes from './routes/driver.js';
import { seedAdmin } from './seeders/adminSeeder.js';
import colors from 'colors';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create uploads directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'uploads'));
}

// Update CORS options to include Authorization header
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS with options
app.use(cors(corsOptions));

// Parse JSON bodies
app.use(express.json());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public', express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users/profile', profileRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/driver', driverRoutes);

// Error handling should be last
app.use(errorHandler);

// Database connection with admin seeding
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB'.green);
    // Seed admin user after successful database connection
    try {
      await seedAdmin();
    } catch (error) {
      console.error('Error seeding admin:'.red, error);
    }
  })
  .catch((err) => console.error('MongoDB connection error:'.red, err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.cyan);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`.cyan);
});

export default app; 