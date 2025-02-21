import { useState, useEffect } from 'react';
import { reverseGeocodeWithDelay } from '../utils/geocoding';

export const useLocationName = (latitude, longitude) => {
  const [locationName, setLocationName] = useState('Loading...');
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchLocationName = async () => {
      try {
        const name = await reverseGeocodeWithDelay(latitude, longitude);
        if (isMounted) {
          setLocationName(name);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setLocationName(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
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