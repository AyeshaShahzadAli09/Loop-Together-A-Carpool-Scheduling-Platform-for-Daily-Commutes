const request = require('supertest');
const app = require('../../server');
const User = require('../../models/user.model');

async function getAuthToken() {
  // Create test user
  const email = `test-${Date.now()}@example.com`;
  
  await User.create({
    name: 'Test User',
    email,
    password: 'testpassword',
    phone: '1234567890'
  });

  // Login and get token
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email,
      password: 'testpassword'
    });

  return response.body.token;
}

module.exports = { getAuthToken }; 