import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getAvailableRides } from '../controllers/rideController.js';
import { createRideRequest } from '../controllers/rideRequestController.js';

const router = express.Router();

// GET /api/rides - list available (active) rides
router.get('/', protect, getAvailableRides);

// POST /api/rides/request - create a new ride request
router.post('/request', protect, createRideRequest);

export default router; 