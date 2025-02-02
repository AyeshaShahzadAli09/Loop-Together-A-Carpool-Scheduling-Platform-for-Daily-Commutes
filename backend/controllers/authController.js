import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { createError } from '../utils/error.js';
import bcrypt from 'bcrypt';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Register User
export const register = async (req, res, next) => {
  try {
    const { name, email, password, gender } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(createError(400, 'User already exists'));
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      gender
    });

    if (user) {
      const token = generateToken(user._id);
      res.status(201).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          gender: user.gender,
          role: user.role,
          isVerified: user.isVerified
        },
        token
      });
    }
  } catch (error) {
    next(error);
  }
};

// Login User
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(401, 'Invalid credentials'));
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(createError(401, 'Invalid credentials'));
    }

    const token = generateToken(user._id);
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        role: user.role,
        isVerified: user.isVerified
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

// Check Auth Status
export const checkAuth = async (req, res) => {
  res.json({ user: req.user });
};

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(404, 'User not found'));
    }

    // Check if user is admin
    if (!user.isAdmin) {
      return next(createError(403, 'Access denied. Admin only.'));
    }

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return next(createError(400, 'Invalid credentials'));
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user._doc;

    res.json({
      success: true,
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    next(error);
  }
}; 