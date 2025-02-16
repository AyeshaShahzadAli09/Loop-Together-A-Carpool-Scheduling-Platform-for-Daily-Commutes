import { Chat, Message } from '../models/Chat.js';
import RideRequest from '../models/RideRequest.js';
import { ApiError } from '../utils/ApiError.js';

// Initialize or get chat for a ride request
export const initializeChat = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    
    // Verify ride request exists and is accepted
    const rideRequest = await RideRequest.findById(requestId)
      .populate('passenger')
      .populate('carpool');
      
    if (!rideRequest) {
      throw new ApiError(404, 'Ride request not found');
    }
    
    if (rideRequest.status !== 'Accepted') {
      throw new ApiError(400, 'Chat can only be initiated for accepted rides');
    }
    
    // Verify user is either passenger or driver
    const isPassenger = rideRequest.passenger._id.equals(req.user._id);
    const isDriver = rideRequest.carpool.driver.equals(req.user._id);
    
    if (!isPassenger && !isDriver) {
      throw new ApiError(403, 'Not authorized to access this chat');
    }
    
    // Find existing chat or create new one
    let chat = await Chat.findOne({ rideRequest: requestId })
      .populate({
        path: 'participants',
        select: 'name profilePicture'
      })
      .populate('lastMessage');
      
    if (!chat) {
      chat = await Chat.create({
        participants: [rideRequest.passenger._id, rideRequest.carpool.driver],
        rideRequest: requestId
      });
      
      chat = await chat.populate({
        path: 'participants',
        select: 'name profilePicture'
      });
    }
    
    res.status(200).json({
      success: true,
      data: chat
    });
  } catch (error) {
    next(error);
  }
};

// Get messages for a chat
export const getChatMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId);
    
    if (!chat) {
      throw new ApiError(404, 'Chat not found');
    }
    
    // Verify user is participant
    if (!chat.participants.includes(req.user._id)) {
      throw new ApiError(403, 'Not authorized to access these messages');
    }
    
    const messages = await Message.find({ chat: chatId })
      .sort('createdAt')
      .populate('sender', 'name profilePicture');
      
    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

// Send a message
export const sendMessage = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;
    
    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new ApiError(404, 'Chat not found');
    }
    
    // Verify user is participant
    if (!chat.participants.includes(req.user._id)) {
      throw new ApiError(403, 'Not authorized to send messages in this chat');
    }
    
    const message = await Message.create({
      chat: chatId,
      sender: req.user._id,
      content
    });
    
    // Update last message
    chat.lastMessage = message._id;
    await chat.save();
    
    const populatedMessage = await message.populate('sender', 'name profilePicture');
    
    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (error) {
    next(error);
  }
};

// Add this new controller function
export const getDriverChats = async (req, res, next) => {
  try {
    // Find all chats where the driver is a participant
    const chats = await Chat.find({
      participants: req.user._id,
      status: 'active'
    })
    .populate({
      path: 'participants',
      select: 'name profilePicture'
    })
    .populate('lastMessage')
    .populate({
      path: 'rideRequest',
      select: 'status',
      populate: {
        path: 'carpool',
        select: 'route schedule'
      }
    })
    .sort('-updatedAt');

    res.status(200).json({
      success: true,
      data: chats
    });
  } catch (error) {
    next(error);
  }
}; 