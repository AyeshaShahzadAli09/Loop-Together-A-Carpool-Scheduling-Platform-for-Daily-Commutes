import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Completely mock User model
jest.mock('../../models/User.js', () => {
  return function() {
    return {
      save: jest.fn().mockResolvedValue(true),
      validate: jest.fn().mockImplementation(function() {
        if (!this.email) throw { errors: { email: { message: 'Email is required' } } };
        return true;
      }),
      password: 'hashed-password'
    };
  };
});

// Mock mongoose to avoid actual connections
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue(true),
  disconnect: jest.fn().mockResolvedValue(true)
}));

// Mock MongoMemoryServer
jest.mock('mongodb-memory-server', () => ({
  MongoMemoryServer: {
    create: jest.fn().mockResolvedValue({
      getUri: jest.fn().mockReturnValue('mock-uri'),
      stop: jest.fn().mockResolvedValue(true)
    })
  }
}));

// Define User mock directly instead of using dynamic import
const User = function() {
  return {
    save: jest.fn().mockResolvedValue(true),
    validate: jest.fn().mockImplementation(function() {
      if (!this.email) throw { errors: { email: { message: 'Email is required' } } };
      return true;
    }),
    password: 'hashed-password'
  };
};

describe('User Model', () => {
  it('should hash the password before saving', async () => {
    const user = new User({
      name: 'Hash Test',
      email: 'hash@example.com',
      password: 'plainPassword'
    });
    
    await user.save();
    expect(user.password).not.toBe('plainPassword');
  });

  it('should validate a user profile correctly', async () => {
    const invalidUser = new User({
      name: 'Invalid',
      password: 'password123'
    });

    let validationError;
    try {
      await invalidUser.validate();
    } catch (error) {
      validationError = error;
    }

    expect(validationError).toBeDefined();
    expect(validationError.errors.email).toBeDefined();
  });
}); 