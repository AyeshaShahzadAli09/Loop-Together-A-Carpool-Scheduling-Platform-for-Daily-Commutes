import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  getDriverRideRequests, 
  acceptRideRequest, 
  rejectRideRequest,
  getRidePassengers,
  getUserRideRequests
} from '../controllers/rideRequestController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/driver', getDriverRideRequests);
router.get('/ride/:rideId/passengers', getRidePassengers);
router.put('/:requestId/accept', acceptRideRequest);
router.put('/:requestId/reject', rejectRideRequest);
router.get('/user', getUserRideRequests);

export default router; 