import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  getDriverRideRequests, 
  acceptRideRequest, 
  rejectRideRequest,
  getRidePassengers,
  getUserRideRequests,
  // createRideRequest,
  // updateRideRequestStatus,
  getRiderRideRequests
} from '../controllers/rideRequestController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/driver', getDriverRideRequests);
router.get('/ride/:rideId/passengers', getRidePassengers);
router.put('/:requestId/accept', acceptRideRequest);
router.put('/:requestId/reject', rejectRideRequest);
router.get('/user', getUserRideRequests);

// Get passengers for a specific ride
router.get('/ride-passengers/:rideId', getRidePassengers);

// Add this route for rider's ride requests
router.get('/rider', getRiderRideRequests);

export default router; 