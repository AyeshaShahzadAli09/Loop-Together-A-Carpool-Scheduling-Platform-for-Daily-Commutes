// Environment variables
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper for API calls to avoid duplicate "/api" paths
export const apiRequest = (endpoint) => {
  // Remove any leading slash from the endpoint
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  
  // If API_URL already ends with /api, make sure we don't add it again
  if (normalizedEndpoint.startsWith('api/')) {
    console.warn('Warning: Endpoint should not start with "api/" as it\'s already included in the base URL');
    return `${API_URL}/${normalizedEndpoint.substring(4)}`;
  }
  
  return `${API_URL}/${normalizedEndpoint}`;
};

// Helper function to handle ride status for displaying to riders
export const getRideStatusForDisplay = (statusFromDatabase) => {
  const statusMappings = {
    'Scheduled': 'Upcoming',
    'InProgress': 'In Progress',
    'Completed': 'Completed',
    'Cancelled': 'Cancelled',
    'Active': 'Available' // For backward compatibility
  };
  
  return statusMappings[statusFromDatabase] || statusFromDatabase;
}; 