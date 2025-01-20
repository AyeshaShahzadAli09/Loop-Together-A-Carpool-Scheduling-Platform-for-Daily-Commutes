import { useState } from "react";

export function useGeoLocation(defaultOrigin = null, defaultDestination = null) {
  const [isLoading, setIsLoading] = useState(false);
  const [origin, setOrigin] = useState(defaultOrigin);  // Origin Location
  const [destination, setDestination] = useState(defaultDestination);  // Destination Location
  const [error, setError] = useState(null);

  function getPosition() {
    if (!navigator.geolocation)
      return setError("Your browser does not support geolocation");

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const currentPosition = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setOrigin(currentPosition);  // Set Origin location to current position
        setDestination(currentPosition);  
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
    );
  }

  function setOriginLocation(lat, lng) {
    setOrigin({ lat, lng });
  }

  function setDestinationLocation(lat, lng) {
    setDestination({ lat, lng });
  }

  return { 
    isLoading, 
    origin, 
    destination, 
    error, 
    getPosition, 
    setOriginLocation, 
    setDestinationLocation 
  };
}
