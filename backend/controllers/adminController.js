import Verification from '../models/Verification.js';
import User from '../models/User.js';
import { createError } from '../utils/error.js';
import notificationService from '../services/notificationService.js';

export const getVerificationRequests = async (req, res, next) => {
  try {
    const verifications = await Verification.find()
      .populate('user', 'name email')
      .sort('-createdAt');

    res.json({
      success: true,
      verifications
    });
  } catch (error) {
    next(error);
  }
};

export const getVerificationDetails = async (req, res, next) => {
  try {
    const verification = await Verification.findById(req.params.id)
      .populate('user', 'name email driverLicense vehiclePlate');

    if (!verification) {
      return next(createError(404, 'Verification request not found'));
    }

    res.json({
      success: true,
      verification
    });
  } catch (error) {
    next(error);
  }
};

export const updateVerificationStatus = async (req, res, next) => {
  try {
    const { status, feedback } = req.body;
    
    const verification = await Verification.findById(req.params.id);
    if (!verification) {
      return next(createError(404, 'Verification request not found'));
    }

    verification.status = status;
    verification.feedback = feedback;
    verification.processedBy = req.user._id;
    await verification.save();

    // Update user's verification status if approved
    if (status === 'Approved') {
      await User.findByIdAndUpdate(verification.user, {
        isVerified: true
      });
    }
    
    // Create notification for the user about their verification status
    await notificationService.verificationNotification(
      verification.user,
      'driver_license',
      status.toLowerCase()
    );

    res.json({
      success: true,
      message: 'Verification status updated successfully',
      verification
    });
  } catch (error) {
    next(error);
  }
}; 