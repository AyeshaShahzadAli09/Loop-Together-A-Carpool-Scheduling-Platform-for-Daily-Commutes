import express from 'express';
import connectDB from './utils/db.js';

const app = express();

// Connect to database
connectDB();

// Add your other middleware and routes here

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}); 