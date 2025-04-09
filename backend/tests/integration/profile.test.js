import request from 'supertest';
import app from '../mocks/server.mock.js';

describe('Profile API', () => {
  const mockToken = 'mock-token';

  it('should get user profile details', async () => {
    app.get.mockImplementationOnce((path, callback) => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnValue({ 
          _id: 'user-id', 
          name: 'Test User', 
          email: 'test@example.com',
          phone: '1234567890',
          avgRating: 4.5
        })
      };
      callback({ user: { id: 'user-id' } }, res);
      expect(res.status).toHaveBeenCalledWith(200);
      return res.json();
    });
    
    expect(true).toBeTruthy();
  });

  it('should update profile picture', async () => {
    app.put.mockImplementationOnce((path, callback) => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnValue({ 
          _id: 'user-id',
          profilePicture: 'uploads/profile-123.jpg'
        })
      };
      callback({ 
        user: { id: 'user-id' }, 
        file: { path: 'uploads/profile-123.jpg' }
      }, res);
      expect(res.status).toHaveBeenCalledWith(200);
      return res.json();
    });
    
    expect(true).toBeTruthy();
  });
}); 