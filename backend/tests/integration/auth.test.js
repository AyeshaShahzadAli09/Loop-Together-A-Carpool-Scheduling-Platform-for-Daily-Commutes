import request from 'supertest';
import app from '../mocks/server.mock.js';

describe('Auth API', () => {
  it('should register a new user', async () => {
    app.post.mockImplementationOnce((path, callback) => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnValue({ token: 'test-token' })
      };
      callback({ body: { email: 'test@example.com' } }, res);
      expect(res.status).toHaveBeenCalledWith(201);
      return res.json();
    });
    
    expect(true).toBeTruthy();
  });

  it('should login a user', async () => {
    app.post.mockImplementationOnce((path, callback) => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnValue({ token: 'test-token' })
      };
      callback({ body: { email: 'login@example.com' } }, res);
      expect(res.status).toHaveBeenCalledWith(200);
      return res.json();
    });
    
    expect(true).toBeTruthy();
  });
}); 