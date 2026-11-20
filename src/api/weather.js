// Weather API layer using Open-Meteo (no API key required)

const GEO_BASE = "https://geocoding-api.open-meteo.com/v1";
const WEATHER_BASE = "https://api.open-meteo.com/v1";

/**
 * Search cities by name
 * @param {string} query - City name to search
 * @param {AbortSignal} signal - AbortController signal for cancellation
 * @returns {Promise<Array>} Array of city results
 */
export async function searchCities(query, signal) {
  if (!query || query.trim().length < 2) return [];
  
  const url = new URL(`${GEO_BASE}/search`);
  url.searchParams.set("name", query.trim());
  url.searchParams.set("count", "5");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");
  
  const res = await fetch(url.toString(), { signal });
  if (!res.ok) throw new Error(`City search failed: ${res.status}`);
  
  const data = await res.json();
  return data.results ?? [];
}

/**
 * Fetch weather data for a location
 * @param {Object} params
 * @param {number} params.latitude
 * @param {number} params.longitude
 * @param {string} params.temperatureUnit - 'celsius' or 'fahrenheit'
 * @param {string} params.windSpeedUnit - 'kmh' or 'mph'
 * @param {AbortSignal} params.signal
 * @returns {Promise<Object>} Weather data
 */
export async function fetchWeather({ latitude, longitude, temperatureUnit = "celsius", windSpeedUnit = "kmh", signal }) {
  const url = new URL(`${WEATHER_BASE}/forecast`);
  
  url.searchParams.set("latitude", latitude);
  url.searchParams.set("longitude", longitude);
  url.searchParams.set("current", [
    "temperature_2m",
    "relative_humidity_2m",
    "apparent_temperature",
    "is_day",
    "precipitation",
    "weather_code",
    "cloud_cover",
    "pressure_msl",
    "wind_speed_10m",
    "wind_direction_10m",
  ].join(","));
  url.searchParams.set("hourly", [
    "temperature_2m",
    "precipitation_probability",
    "weather_code",
    "is_day",
  ].join(","));
  url.searchParams.set("daily", [
    "weather_code",
    "temperature_2m_max",
    "temperature_2m_min",
    "sunrise",
    "sunset",
    "uv_index_max",
    "precipitation_probability_max",
  ].join(","));
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "7");
  url.searchParams.set("temperature_unit", temperatureUnit);
  url.searchParams.set("wind_speed_unit", windSpeedUnit);
  
  const res = await fetch(url.toString(), { signal });
  if (!res.ok) throw new Error(`Weather fetch failed: ${res.status} ${res.statusText}`);
  
  return res.json();
}
