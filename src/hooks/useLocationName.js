import { useState, useEffect } from 'react';
import { reverseGeocodeWithDelay } from '../utils/geocoding';

// Create a cache outside the hook to persist across renders
const locationCache = new Map();

export const useLocationName = (latitude, longitude) => {
  const [locationName, setLocationName] = useState('Loading...');
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const coordKey = `${latitude},${longitude}`;

    const fetchLocationName = async () => {
      try {
        // Check cache first
        if (locationCache.has(coordKey)) {
          setLocationName(locationCache.get(coordKey));
          return;
        }

        const name = await reverseGeocodeWithDelay(latitude, longitude);
        
        if (isMounted) {
          setLocationName(name);
          // Store in cache
          locationCache.set(coordKey, name);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          const fallback = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          setLocationName(fallback);
          // Cache the fallback to avoid repeated failed requests
          locationCache.set(coordKey, fallback);
        }
      }
    };

    if (latitude && longitude) {
      fetchLocationName();
    }

    return () => {
      isMounted = false;
    };
  }, [latitude, longitude]);

  return { locationName, error };
}; 