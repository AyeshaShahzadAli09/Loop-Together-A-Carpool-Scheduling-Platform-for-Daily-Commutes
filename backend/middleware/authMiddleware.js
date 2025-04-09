import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { createError } from '../utils/error.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(createError(401, 'Not authorized, no token'));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return next(createError(401, 'Not authorized, user not found'));
      }

      // Check if token is expired
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        return next(createError(401, 'Token expired'));
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return next(createError(401, 'Invalid token'));
      }
      if (error.name === 'TokenExpiredError') {
        return next(createError(401, 'Token expired'));
      }
      throw error;
    }
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    next(createError(401, 'Authentication failed'));
  }
}; 