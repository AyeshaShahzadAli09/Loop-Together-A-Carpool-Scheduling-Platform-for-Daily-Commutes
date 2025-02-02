import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { adminAuth } from '../middleware/adminAuthMiddleware.js';
import { 
  getVerificationRequests,
  getVerificationDetails,
  updateVerificationStatus
} from '../controllers/adminController.js';

const router = express.Router();

router.use(protect); // Protect all admin routes
router.use(adminAuth); // Ensure user is admin

router.get('/verifications', getVerificationRequests);
router.get('/verifications/:id', getVerificationDetails);
router.put('/verifications/:id', updateVerificationStatus);

export default router; 