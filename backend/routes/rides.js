import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getAvailableRides } from '../controllers/rideController.js';
import { 
  startRide, 
  pickupPassenger, 
  completeRide,
  getActiveRides 
} from '../controllers/rideManagementController.js';
import { 
  submitRating, 
  getDriverRatings 
} from '../controllers/ratingController.js';
import { createRideRequest } from '../controllers/rideRequestController.js';

const router = express.Router();

// GET /api/rides - list available (active) rides
router.get('/', protect, getAvailableRides);

// POST /api/rides/request - create a new ride request
router.post('/request', protect, createRideRequest);

// Ride management routes
router.put('/start/:rideId', protect, startRide);
router.put('/pickup/:requestId', protect, pickupPassenger);
router.put('/complete/:rideId', protect, completeRide);
router.get('/active', protect, getActiveRides);

// Rating routes
router.post('/rate/:rideId', protect, submitRating);
router.get('/ratings', protect, getDriverRatings);

export default router; 