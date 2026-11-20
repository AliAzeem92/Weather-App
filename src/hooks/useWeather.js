import { useState, useEffect, useCallback, useRef } from "react";
import { fetchWeather } from "../api/weather.js";

/**
 * Hook for fetching and managing weather data
 */
export function useWeather({ city, temperatureUnit, windSpeedUnit }) {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
  });
  const abortRef = useRef(null);

  const load = useCallback(async (cityData, tempUnit, windUnit) => {
    if (!cityData) return;

    // Cancel any in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();

    setState({ data: null, loading: true, error: null });

    try {
      const data = await fetchWeather({
        latitude: cityData.latitude,
        longitude: cityData.longitude,
        temperatureUnit: tempUnit,
        windSpeedUnit: windUnit,
        signal: abortRef.current.signal,
      });
      setState({ data, loading: false, error: null });
    } catch (err) {
      if (err.name === "AbortError") return; // Ignore cancelled requests
      setState({
        data: null,
        loading: false,
        error: err.message || "Failed to load weather data. Please try again.",
      });
    }
  }, []);

  useEffect(() => {
    if (city) {
      load(city, temperatureUnit, windSpeedUnit);
    }
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [city, temperatureUnit, windSpeedUnit, load]);

  const retry = useCallback(() => {
    if (city) {
      load(city, temperatureUnit, windSpeedUnit);
    }
  }, [city, temperatureUnit, windSpeedUnit, load]);

  return { ...state, retry };
}
