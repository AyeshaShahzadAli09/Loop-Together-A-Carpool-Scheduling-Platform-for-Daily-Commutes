export const DB_CONFIG = {
  ADMIN_EMAIL: 'admin@looptogether.com',
  INDEXES_VERSION: '1.0',
  TTL_NOTIFICATIONS: 2592000 // 30 days in seconds
};

export const USER_ROLES = {
  ADMIN: 'admin',
  DRIVER: 'driver',
  PASSENGER: 'passenger'
};

export const MODEL_NAMES = {
  USER: 'User',
  CARPOOL: 'Carpool',
  RIDE_REQUEST: 'RideRequest',
  VERIFICATION: 'Verification',
  NOTIFICATION: 'Notification',
  CHAT: 'Chat',
  MESSAGE: 'Message',
  FEEDBACK: 'Feedback',
  USER_PREFERENCES: 'UserPreferences'
}; 