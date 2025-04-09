import Notification from '../models/Notification.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { createError } from '../utils/error.js';

// @desc    Create a new notification
// @route   POST /api/notifications
// @access  Private
export const createNotification = asyncHandler(async (req, res) => {
  const { userId, message, type, mode, relatedEntity, refModel, actionRequired, actionLink } = req.body;

  const notification = await Notification.create({
    user: userId,
    message,
    type,
    mode,
    relatedEntity,
    refModel,
    actionRequired,
    actionLink
  });

  res.status(201).json({
    success: true,
    data: notification
  });
});

// @desc    Get notifications for current user based on mode
// @route   GET /api/notifications
// @access  Private
export const getNotifications = asyncHandler(async (req, res) => {
  const { mode = 'both', limit = 20, offset = 0, unreadOnly = false } = req.query;
  
  const query = { 
    user: req.user.id,
    $or: [{ mode }, { mode: 'both' }]
  };
  
  if (unreadOnly === 'true') {
    query.read = false;
  }

  const total = await Notification.countDocuments(query);

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .skip(parseInt(offset))
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: notifications.length,
    total,
    data: notifications
  });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req, res, next) => {
  let notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(createError(404, 'Notification not found'));
  }

  // Check if notification belongs to user
  if (notification.user.toString() !== req.user.id) {
    return next(createError(401, 'Not authorized'));      
  }

  notification.read = true;
  await notification.save();

  res.status(200).json({
    success: true,
    data: notification
  });
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = asyncHandler(async (req, res) => {
  const { mode = 'both' } = req.query;

  const query = { 
    user: req.user.id,
    read: false,
    $or: [{ mode }, { mode: 'both' }]
  };

  await Notification.updateMany(query, { read: true });

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read'
  });
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(createError(404, 'Notification not found'));
  }

  // Check if notification belongs to user
  if (notification.user.toString() !== req.user.id) {
    return next(createError(401, 'Not authorized'));
  }

  await notification.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get unread notification count
// @route   GET /api/notifications/count
// @access  Private
export const getUnreadCount = asyncHandler(async (req, res) => {
  const { mode = 'both' } = req.query;

  const query = { 
    user: req.user.id,
    read: false,
    $or: [{ mode }, { mode: 'both' }]
  };

  const count = await Notification.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      count
    }
  });
}); 