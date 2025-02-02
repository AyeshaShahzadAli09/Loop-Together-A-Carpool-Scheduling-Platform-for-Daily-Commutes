import User from '../models/User.js';
import { createError } from '../utils/error.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return next(createError(404, 'User not found'));
    }

    // If no profile picture, use default
    if (!user.profilePicture?.url) {
      user.profilePicture = {
        url: '/public/default-profile.jpg'
      };
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, gender } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(createError(404, 'User not found'));
    }

    // Update fields if provided
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (gender) user.gender = gender;

    await user.save();

    // Don't send password in response
    const userResponse = user.toObject();
    delete userResponse.password;

    // Ensure default profile picture
    if (!userResponse.profilePicture?.url) {
      userResponse.profilePicture = {
        url: '/public/default-profile.jpg'
      };
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userResponse
    });
  } catch (error) {
    next(error);
  }
};

export const uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(createError(400, 'Please upload an image'));
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return next(createError(404, 'User not found'));
    }

    // Delete old image from Cloudinary if exists and not default
    if (user.profilePicture?.publicId) {
      await deleteFromCloudinary(user.profilePicture.publicId);
    }

    // Upload new image to Cloudinary
    const result = await uploadToCloudinary(req.file.path, 'profile_pictures');
    
    // Delete file from local storage
    fs.unlinkSync(req.file.path);

    // Update user profile
    user.profilePicture = {
      url: result.secure_url,
      publicId: result.public_id
    };
    await user.save();

    res.json({
      success: true,
      message: 'Profile picture updated successfully',
      profilePicture: user.profilePicture
    });
  } catch (error) {
    // Delete uploaded file if exists
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
}; 