const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

// Add a cache to store previously fetched locations
const locationCache = new Map();

export const reverseGeocode = async (lat, lng) => {
  // Create a cache key from coordinates
  const cacheKey = `${lat},${lng}`;
  
  // Check cache first
  if (locationCache.has(cacheKey)) {
    return locationCache.get(cacheKey);
  }

  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    const data = await response.json();
    
    let result;
    if (data.address) {
      const { road, suburb, city, state, country } = data.address;
      const addressParts = [];
      if (road) addressParts.push(road);
      if (suburb) addressParts.push(suburb);
      if (city) addressParts.push(city);
      if (state) addressParts.push(state);
      if (country) addressParts.push(country);

      result = addressParts.length > 0 
        ? addressParts.join(', ') 
        : `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } else {
      result = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }

    // Store in cache before returning
    locationCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    const fallback = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    locationCache.set(cacheKey, fallback);
    return fallback;
  }
};

// Optimize the delay function to handle multiple requests more efficiently
export const reverseGeocodeWithDelay = (() => {
  let lastCall = 0;
  const minDelay = 250; // Reduced delay to 250ms
  const queue = [];
  let isProcessing = false;

  const processQueue = async () => {
    if (isProcessing || queue.length === 0) return;
    
    isProcessing = true;
    
    while (queue.length > 0) {
      const { lat, lng, resolve } = queue.shift();
      const now = Date.now();
      const timeSinceLastCall = now - lastCall;
      
      if (timeSinceLastCall < minDelay) {
        await new Promise(r => setTimeout(r, minDelay - timeSinceLastCall));
      }
      
      lastCall = Date.now();
      const result = await reverseGeocode(lat, lng);
      resolve(result);
    }
    
    isProcessing = false;
  };

  return (lat, lng) => {
    return new Promise(resolve => {
      queue.push({ lat, lng, resolve });
      processQueue();
    });
  };
})(); 