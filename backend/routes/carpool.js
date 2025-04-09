import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createCarpool, getCarpools, updateCarpool, deleteCarpool } from '../controllers/carpoolController.js';

const router = express.Router();

router.post('/create', protect, createCarpool);
router.get('/', protect, getCarpools);
router.put('/:id', protect, updateCarpool);
router.delete('/:id', protect, deleteCarpool);

export default router; 