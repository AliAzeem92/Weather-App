import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WeatherBackground from "./components/WeatherBackground.jsx";
import SearchBar from "./components/SearchBar.jsx";
import CurrentWeather from "./components/CurrentWeather.jsx";
import HourlyForecast from "./components/HourlyForecast.jsx";
import DailyForecast from "./components/DailyForecast.jsx";
import WeatherDetails from "./components/WeatherDetails.jsx";
import UnitToggle from "./components/UnitToggle.jsx";
import ThemeDropdown from "./components/ThemeDropdown.jsx";
import RecentSearches from "./components/RecentSearches.jsx";
import ErrorMessage from "./components/ErrorMessage.jsx";
import {
  CurrentWeatherSkeleton,
  HourlyForecastSkeleton,
  DailyForecastSkeleton,
  DetailsSkeleton,
} from "./components/Skeletons.jsx";
import { useWeather } from "./hooks/useWeather.js";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import { useGeolocation } from "./hooks/useGeolocation.js";
import { getWeatherInfo } from "./utils/weatherCodes.js";

// Default city: Faisalabad
const DEFAULT_CITY = {
  id: 1172451,
  name: "Faisalabad",
  latitude: 31.4504,
  longitude: 73.135,
  country: "Pakistan",
  country_code: "PK",
  admin1: "Punjab",
};

// Cursor glow component (desktop only)
function CursorGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (prefersReduced) return;
    const handler = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, [prefersReduced]);

  if (prefersReduced) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 hidden lg:block"
      style={{
        left: pos.x - 200,
        top: pos.y - 200,
        width: 400,
        height: 400,
        background: "radial-gradient(circle, rgba(110,247,247,0.06) 0%, transparent 70%)",
        transition: "left 0.1s ease-out, top 0.1s ease-out",
      }}
    />
  );
}


export default function App() {
  // Persisted state
  const [unit, setUnit] = useLocalStorage("weather-unit", "celsius");
  const [windUnit, setWindUnit] = useLocalStorage("weather-wind-unit", "kmh");
  const [lastCity, setLastCity] = useLocalStorage("weather-last-city", DEFAULT_CITY);
  const [recentSearches, setRecentSearches] = useLocalStorage("weather-recent", []);

  // Current selected city
  const [selectedCity, setSelectedCity] = useState(lastCity ?? DEFAULT_CITY);

  // Dev theme override
  const [devTheme, setDevTheme] = useState(null);

  // Weather data
  const { data, loading, error, retry } = useWeather({
    city: selectedCity,
    temperatureUnit: unit,
    windSpeedUnit: windUnit,
  });

  // Geolocation
  const { loading: locating, error: geoError, coords, getLocation } = useGeolocation();

  // Handle geolocation result
  useEffect(() => {
    if (coords) {
      const geoCity = {
        id: `geo-${coords.latitude}-${coords.longitude}`,
        name: "Current Location",
        latitude: coords.latitude,
        longitude: coords.longitude,
        country: "",
        admin1: "",
      };
      handleCitySelect(geoCity);
    }
  }, [coords]);

  // Derive theme and weather info from weather data
  const liveWeatherInfo = data
    ? getWeatherInfo(data.current.weather_code, data.current.is_day === 1)
    : { label: "Clear Sky", iconName: "Sun", theme: "clear-day" };

  const weatherTheme = devTheme ?? liveWeatherInfo.theme;

  // Handle city selection
  const handleCitySelect = useCallback((city) => {
    setSelectedCity(city);
    setLastCity(city);
    // Update recent searches (avoid duplicates, max 5)
    setRecentSearches((prev) => {
      const filtered = prev.filter((c) => c.id !== city.id && c.name !== city.name);
      return [city, ...filtered].slice(0, 5);
    });
  }, [setLastCity, setRecentSearches]);

  // Handle unit toggle
  const handleUnitToggle = () => {
    const newUnit = unit === "celsius" ? "fahrenheit" : "celsius";
    const newWindUnit = newUnit === "celsius" ? "kmh" : "mph";
    setUnit(newUnit);
    setWindUnit(newWindUnit);
  };

  // Remove from recent searches
  const handleRemoveRecent = (index) => {
    setRecentSearches((prev) => prev.filter((_, i) => i !== index));
  };

  // Geo error display
  const displayError = error || geoError;

  const pageVariants = {
    initial: { opacity: 0, filter: "blur(8px)" },
    animate: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, filter: "blur(8px)", transition: { duration: 0.3 } },
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className="min-h-screen font-sans text-white relative">
      {/* Animated background */}
      <WeatherBackground theme={weatherTheme} />

      {/* Cursor glow (desktop) */}
      <CursorGlow />

      {/* Main layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">

        {/* Header: search + theme dropdown + toggle */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6"
        >
          <div className="flex-1">
            <SearchBar
              onSelect={handleCitySelect}
              onUseLocation={getLocation}
              locating={locating}
              recentSearches={recentSearches}
            />
          </div>
          <div className="flex items-center justify-end gap-2.5">
            <ThemeDropdown
              currentTheme={devTheme}
              onThemeChange={setDevTheme}
              liveWeatherInfo={liveWeatherInfo}
            />
            <UnitToggle unit={unit} onToggle={handleUnitToggle} />
          </div>
        </motion.header>

        {/* Recent searches */}
        {recentSearches.length > 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <RecentSearches
              searches={recentSearches}
              onSelect={handleCitySelect}
              onRemove={handleRemoveRecent}
            />
          </motion.div>
        )}

        {/* Error state */}
        {displayError && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass max-w-lg mx-auto"
          >
            <ErrorMessage message={displayError} onRetry={error ? retry : null} />
          </motion.div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1 flex flex-col gap-4">
              <CurrentWeatherSkeleton />
              <DetailsSkeleton />
            </div>
            <div className="lg:col-span-2 flex flex-col gap-4">
              <HourlyForecastSkeleton />
              <DailyForecastSkeleton />
            </div>
          </div>
        )}

        {/* Main content */}
        <AnimatePresence mode="wait">
          {data && !loading && !displayError && (
            <motion.div
              key={selectedCity?.id ?? selectedCity?.name}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {/* Bento grid layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Left column: current + details */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="lg:col-span-1 flex flex-col gap-4"
                >
                  <CurrentWeather
                    data={data}
                    city={selectedCity}
                    unit={unit}
                    windUnit={windUnit}
                    hourlyData={data.hourly}
                  />
                  <WeatherDetails
                    data={data}
                    timezone={data.timezone}
                    unit={unit}
                  />
                </motion.div>

                {/* Right column: hourly + daily */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="lg:col-span-2 flex flex-col gap-4"
                >
                  <HourlyForecast
                    hourly={data.hourly}
                    timezone={data.timezone}
                    unit={unit}
                    currentIsDay={data.current.is_day === 1}
                  />
                  <DailyForecast
                    daily={data.daily}
                    timezone={data.timezone}
                    unit={unit}
                  />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state (before any city — shouldn't normally show since we default to Faisalabad) */}
        {!data && !loading && !displayError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="text-6xl mb-4">🌤️</div>
            <h2 className="text-white text-2xl font-bold mb-2">Welcome to SkyView</h2>
            <p className="text-white/60 text-sm">Search for a city to see the weather</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
