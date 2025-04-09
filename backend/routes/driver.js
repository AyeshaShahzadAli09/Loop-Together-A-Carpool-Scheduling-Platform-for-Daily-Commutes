import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { submitVerification, getVerificationStatus } from '../controllers/verificationController.js';
import { upload } from '../utils/multer.js';

const router = express.Router();

// Configure multer for multiple files
const uploadFields = upload.fields([
  { name: 'licenseImage', maxCount: 1 },
  { name: 'vehicleImage', maxCount: 1 }
]);

router.post('/verify', protect, uploadFields, submitVerification);
router.get('/verification-status', protect, getVerificationStatus);

export default router; 