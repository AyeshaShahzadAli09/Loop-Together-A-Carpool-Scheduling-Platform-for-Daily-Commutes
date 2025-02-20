import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

// Create axios instance with default config
const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (credentials) => {
  try {
    const response = await authApi.post('/login', credentials);
    if (response.data.token) {
      localStorage.setItem('userToken', response.data.token);
      // Set default auth header for future requests
      authApi.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred during login' };
  }
};

export const signup = async (userData) => {
  try {
    const response = await authApi.post('/signup', userData);
    // Don't set token or update headers
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred during signup' };
  }
};

export const logout = () => {
  localStorage.removeItem('userToken');
  delete authApi.defaults.headers.common['Authorization'];
};

export const checkAuth = async () => {
  try {
    const response = await authApi.get('/check');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Authentication check failed' };
  }
};

export default authApi; 