import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Update this function to match the same pattern used in your working APIs
const getAuthConfig = () => {
  // Use 'token' instead of 'userToken' to match your other API calls
  const token = localStorage.getItem('token');
  console.log('Auth token available:', !!token); // Log if token exists, not the actual token
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

/**
 * Get notifications for current user based on mode
 * @param {string} mode - Mode (rider/driver/both)
 * @param {number} limit - Limit of notifications to fetch
 * @param {number} offset - Offset for pagination
 * @param {boolean} unreadOnly - Only fetch unread notifications
 * @returns {Promise<Object>} Notifications data
 */
export const getNotifications = async (mode = 'both', limit = 20, offset = 0, unreadOnly = false) => {
  const response = await axios.get(`${API_URL}/notifications`, {
    params: { mode, limit, offset, unreadOnly },
    ...getAuthConfig()
  });
  return response.data;
};

/**
 * Get count of unread notifications
 * @param {string} mode - Mode (rider/driver/both)
 * @returns {Promise<number>} Count of unread notifications
 */
export const getUnreadCount = async (mode = 'both') => {
  const response = await axios.get(`${API_URL}/notifications/count`, {
    params: { mode },
    ...getAuthConfig()
  });
  return response.data.data.count; // Adjusted to match your backend response structure
};

/**
 * Mark notification as read
 * @param {string} id - Notification ID
 * @returns {Promise<Object>} Response data
 */
export const markAsRead = async (id) => {
  const response = await axios.put(`${API_URL}/notifications/${id}/read`, {}, getAuthConfig());
  return response.data;
};

/**
 * Mark all notifications as read
 * @param {string} mode - Mode (rider/driver/both)
 * @returns {Promise<Object>} Response data
 */
export const markAllAsRead = async (mode = 'both') => {
  const response = await axios.put(
    `${API_URL}/notifications/read-all`, 
    {}, 
    {
      params: { mode },
      ...getAuthConfig()
    }
  );
  return response.data;
};

/**
 * Delete notification
 * @param {string} id - Notification ID
 * @returns {Promise<Object>} Response data
 */
export const deleteNotification = async (id) => {
  const response = await axios.delete(`${API_URL}/notifications/${id}`, getAuthConfig());
  return response.data;
}; 