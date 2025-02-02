import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  submitVerification,
  getVerificationStatus,
  updateVerificationStatus // Admin only
} from '../controllers/verificationController.js';
import { isAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/submit', protect, submitVerification);
router.get('/status', protect, getVerificationStatus);
router.put('/:id/status', protect, isAdmin, updateVerificationStatus);

export default router; 