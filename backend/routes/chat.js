import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  initializeChat,
  getChatMessages,
  sendMessage,
  getDriverChats
} from '../controllers/chatController.js';

const router = express.Router();

router.use(protect);

router.get('/ride-request/:requestId', initializeChat);
router.get('/:chatId/messages', getChatMessages);
router.post('/:chatId/messages', sendMessage);
router.get('/driver-chats', getDriverChats);

export default router; 