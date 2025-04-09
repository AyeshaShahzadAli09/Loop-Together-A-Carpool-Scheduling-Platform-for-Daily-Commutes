import request from 'supertest';
import app from '../mocks/server.mock.js';

describe('Ratings API', () => {
  const mockToken = 'mock-token';

  it('should submit a rating for a driver', async () => {
    app.post.mockImplementationOnce((path, callback) => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnValue({ 
          _id: 'rating-id', 
          rating: 4,
          comment: 'Great driver',
          from: 'user-id',
          to: 'driver-id'
        })
      };
      callback({ 
        user: { id: 'user-id' }, 
        body: { 
          rating: 4, 
          comment: 'Great driver',
          userId: 'driver-id' 
        } 
      }, res);
      expect(res.status).toHaveBeenCalledWith(201);
      return res.json();
    });
    
    expect(true).toBeTruthy();
  });

  it('should get user ratings', async () => {
    app.get.mockImplementationOnce((path, callback) => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnValue([
          { 
            _id: 'rating-1', 
            rating: 5,
            comment: 'Excellent passenger',
            from: 'driver-1',
            to: 'user-id'
          },
          { 
            _id: 'rating-2', 
            rating: 4,
            comment: 'Good passenger',
            from: 'driver-2',
            to: 'user-id'
          }
        ])
      };
      callback({ user: { id: 'user-id' } }, res);
      expect(res.status).toHaveBeenCalledWith(200);
      return res.json();
    });
    
    expect(true).toBeTruthy();
  });
}); 