// Mock implementation of server for tests
export default {
  // Mock express app with minimal implementation 
  listen: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
}; 