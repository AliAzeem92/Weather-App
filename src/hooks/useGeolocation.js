import { useState, useCallback } from "react";

/**
 * Hook for browser Geolocation API with graceful error handling
 */
export function useGeolocation() {
  const [state, setState] = useState({
    loading: false,
    error: null,
    coords: null,
  });

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState({ loading: false, error: "Geolocation is not supported by your browser.", coords: null });
      return;
    }

    setState({ loading: true, error: null, coords: null });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          loading: false,
          error: null,
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
      },
      (error) => {
        let message = "Unable to retrieve your location.";
        if (error.code === error.PERMISSION_DENIED) {
          message = "Location access was denied. Please allow location access in your browser settings.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = "Location information is unavailable.";
        } else if (error.code === error.TIMEOUT) {
          message = "Location request timed out.";
        }
        setState({ loading: false, error: message, coords: null });
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  return { ...state, getLocation };
}
