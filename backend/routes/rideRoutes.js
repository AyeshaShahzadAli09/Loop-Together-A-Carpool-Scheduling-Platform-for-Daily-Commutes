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

// Ride management routes
router.put('/start/:rideId', authMiddleware, startRide);
router.put('/pickup/:requestId', authMiddleware, pickupPassenger);
router.put('/complete/:rideId', authMiddleware, completeRide);

// Active rides for driver
router.get('/active', authMiddleware, getActiveRides);

// Rating routes
router.post('/rate/:rideId', authMiddleware, submitRating);
router.get('/ratings', authMiddleware, getDriverRatings); 