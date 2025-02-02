import { createError } from '../utils/error.js';

export const isAdmin = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(createError(403, 'Access denied. Admin only.'));
  }
  next();
}; 