import express from 'express';
import { register, login, checkAuth, adminLogin } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.get('/check', protect, checkAuth);

export default router; 