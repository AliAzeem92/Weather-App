import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Droplets, Wind, Gauge, Cloud, Eye, Thermometer } from "lucide-react";
import WeatherIcon from "./icons/WeatherIcon.jsx";
import { getWeatherInfo } from "../utils/weatherCodes.js";
import {
  formatTempValue, formatTemp, formatWind, windDegreesToCompass,
  formatDateTime, getGreeting, generateWeatherSummary, formatPressure
} from "../utils/formatters.js";

// Animated count-up number hook
function useCountUp(value, duration = 800) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    if (start === end) return;
    prevRef.current = end;
    const diff = end - start;
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, duration]);

  return display;
}

function StatCard({ icon: Icon, label, value, className = "" }) {
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 12px 40px rgba(0,0,0,0.4)" }}
      className={`flex flex-col gap-1.5 p-3 rounded-2xl ${className}`}
      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
    >
      <div className="flex items-center gap-1.5 text-white/50">
        <Icon size={13} strokeWidth={2} />
        <span className="text-xs font-semibold uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-white font-semibold text-sm leading-tight">{value}</span>
    </motion.div>
  );
}

export default function CurrentWeather({ data, city, unit, windUnit, hourlyData }) {
  const { current, daily, timezone } = data;
  const weatherInfo = getWeatherInfo(current.weather_code, current.is_day === 1);
  const tempDisplay = useCountUp(Math.round(current.temperature_2m));
  const { date, time } = formatDateTime(timezone);
  const greeting = getGreeting(timezone);
  const summary = generateWeatherSummary(hourlyData, timezone, current.weather_code);
  const unitSymbol = unit === "celsius" ? "°C" : "°F";

  // 3D tilt on desktop
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const isTouchDevice = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
  const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleMouseMove = (e) => {
    if (isTouchDevice || prefersReduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -6, y: dx * 6 });
  };
  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 24 }}
      animate={{
        opacity: 1,
        y: 0,
        rotateX: tilt.x,
        rotateY: tilt.y,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      className="glass glass-hover p-6 relative overflow-hidden group"
    >
      {/* Sheen effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 overflow-hidden rounded-3xl">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)" }} />
      </div>

      {/* Greeting & date */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-sm">{greeting.emoji}</span>
          <span className="text-white/60 text-sm font-medium">{greeting.text}</span>
        </div>
        <h2 className="text-white font-bold text-2xl truncate">{city?.name ?? "Current Location"}</h2>
        <p className="text-white/50 text-xs mt-0.5 truncate">
          {[city?.admin1, city?.country].filter(Boolean).join(", ")}
        </p>
        <p className="text-white/40 text-xs mt-1">{date}</p>
      </div>

      {/* Main temp + icon */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-start">
          <span
            className="font-light tracking-tighter leading-none text-gradient-temp"
            style={{ fontSize: "clamp(5rem, 15vw, 8rem)" }}
          >
            {tempDisplay}
          </span>
          <span className="text-white/70 font-light mt-3 ml-1" style={{ fontSize: "2rem" }}>{unitSymbol}</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="text-white/80">
            <WeatherIcon iconName={weatherInfo.iconName} size={56} />
          </div>
          <span className="text-white/80 text-sm font-semibold text-center leading-tight max-w-24">{weatherInfo.label}</span>
        </div>
      </div>

      {/* Weather summary */}
      {summary && (
        <div className="mb-4 px-3 py-2 rounded-xl text-sm text-white/70" style={{ background: "rgba(255,255,255,0.05)" }}>
          {summary}
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <StatCard
          icon={Thermometer}
          label="Feels like"
          value={formatTemp(current.apparent_temperature, unit)}
        />
        <StatCard
          icon={Droplets}
          label="Humidity"
          value={`${current.relative_humidity_2m}%`}
        />
        <StatCard
          icon={Wind}
          label="Wind"
          value={`${formatWind(current.wind_speed_10m, windUnit)} ${windDegreesToCompass(current.wind_direction_10m)}`}
        />
        <StatCard
          icon={Gauge}
          label="Pressure"
          value={formatPressure(current.pressure_msl)}
        />
        <StatCard
          icon={Cloud}
          label="Cloud Cover"
          value={`${current.cloud_cover}%`}
        />
        <StatCard
          icon={Eye}
          label="Precip."
          value={`${current.precipitation} mm`}
        />
      </div>
    </motion.div>
  );
}
