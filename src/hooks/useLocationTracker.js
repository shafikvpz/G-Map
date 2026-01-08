import { useState, useEffect } from 'react';

export const useLocationTracker = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    const handleSuccess = (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      setLocation({ lat: latitude, lng: longitude, accuracy });
      setError(null);
    };

    const handleError = (err) => {
      setError(err.message);
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
    };

    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, options);

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { location, error };
};
