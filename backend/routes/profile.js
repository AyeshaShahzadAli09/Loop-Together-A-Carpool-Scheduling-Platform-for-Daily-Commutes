import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  updateProfile,
  uploadProfilePicture,
  getProfile
} from '../controllers/profileController.js';
import { upload } from '../utils/multer.js';

const router = express.Router();

router.get('/', protect, getProfile);
router.put('/update', protect, updateProfile);
router.post('/picture', protect, upload.single('image'), uploadProfilePicture);

export default router; 