import jwt from 'jsonwebtoken';
import { createError } from '../utils/error.js';

export const adminAuth = async (req, res, next) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return next(createError(403, 'Access denied. Admin only.'));
    }
    next();
  } catch (error) {
    next(error);
  }
}; 