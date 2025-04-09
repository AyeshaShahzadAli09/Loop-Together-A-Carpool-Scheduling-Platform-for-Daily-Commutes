import Verification from '../models/Verification.js';
import User from '../models/User.js';
import { createError } from '../utils/error.js';
import { uploadToCloudinary } from '../utils/cloudinary.js'; // You'll need to implement this
import fs from 'fs';
import notificationService from '../services/notificationService.js';

export const submitVerification = async (req, res, next) => {
  try {
    const { driverLicense, vehiclePlate } = req.body;
    
    // Validate if files exist
    if (!req.files || !req.files.licenseImage || !req.files.vehicleImage) {
      return next(createError(400, 'Both license and vehicle images are required'));
    }

    const licenseImage = req.files.licenseImage[0];
    const vehicleImage = req.files.vehicleImage[0];

    // Check if user already has a pending verification
    const existingVerification = await Verification.findOne({
      user: req.user._id,
      status: 'Pending'
    });

    if (existingVerification) {
      // Clean up uploaded files
      if (licenseImage) fs.unlinkSync(licenseImage.path);
      if (vehicleImage) fs.unlinkSync(vehicleImage.path);
      return next(createError(400, 'You already have a pending verification request'));
    }

    try {
      // Upload images to cloudinary
      const [licenseDoc, vehicleDoc] = await Promise.all([
        uploadToCloudinary(licenseImage.path, 'driver_documents'),
        uploadToCloudinary(vehicleImage.path, 'driver_documents')
      ]);

      // Create verification request
      const verification = await Verification.create({
        user: req.user._id,
        documents: [
          {
            type: 'Driver License',
            url: licenseDoc.secure_url
          },
          {
            type: 'Vehicle',
            url: vehicleDoc.secure_url
          }
        ],
        status: 'Pending'
      });

      // Update user
      await User.findByIdAndUpdate(req.user._id, {
        driverLicense,
        vehiclePlate,
        isDriver: true,
        isVerified: false
      });

      // Create notification for user
      await notificationService.verificationNotification(
        req.user._id, 
        'driver_license', 
        'pending'
      );

      res.status(201).json({
        success: true,
        message: 'Verification request submitted successfully',
        verification
      });
    } catch (error) {
      // Clean up files if cloudinary upload fails
      if (licenseImage && fs.existsSync(licenseImage.path)) fs.unlinkSync(licenseImage.path);
      if (vehicleImage && fs.existsSync(vehicleImage.path)) fs.unlinkSync(vehicleImage.path);
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

export const getVerificationStatus = async (req, res, next) => {
  try {
    const verification = await Verification.findOne({
      user: req.user._id
    }).sort('-createdAt');

    if (!verification) {
      return next(createError(404, 'No verification request found'));
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
    const { id } = req.params;
    const { status, feedback } = req.body;

    const verification = await Verification.findById(id);
    if (!verification) {
      return next(createError(404, 'Verification request not found'));
    }

    verification.status = status;
    verification.feedback = feedback;
    verification.processedBy = req.user._id;
    await verification.save();

    // If approved, update user's verification status
    if (status === 'Approved') {
      await User.findByIdAndUpdate(verification.user, {
        isVerified: true
      });
    }

    res.json({
      success: true,
      message: 'Verification status updated successfully',
      verification
    });
  } catch (error) {
    next(error);
  }
}; 