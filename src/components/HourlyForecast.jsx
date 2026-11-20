import { useRef } from "react";
import { motion } from "framer-motion";
import { Droplets } from "lucide-react";
import WeatherIcon from "./icons/WeatherIcon.jsx";
import { getWeatherInfo } from "../utils/weatherCodes.js";
import { formatTempValue, formatHourLabel } from "../utils/formatters.js";

export default function HourlyForecast({ hourly, timezone, unit, currentIsDay }) {
  const scrollRef = useRef(null);

  // Find current hour index and show next 24 hours
  const now = new Date();
  const rawIdx = hourly?.time ? hourly.time.findIndex((t) => new Date(t) >= now) : 0;
  const startIdx = rawIdx >= 0 ? rawIdx : 0;
  const hours = hourly?.time ? hourly.time.slice(startIdx, startIdx + 24) : [];
  const temps = hourly?.temperature_2m ? hourly.temperature_2m.slice(startIdx, startIdx + 24) : [];
  const precips = hourly?.precipitation_probability ? hourly.precipitation_probability.slice(startIdx, startIdx + 24) : [];
  const codes = hourly?.weather_code ? hourly.weather_code.slice(startIdx, startIdx + 24) : [];
  const isDays = hourly?.is_day ? hourly.is_day.slice(startIdx, startIdx + 24) : null;

  const unitSymbol = unit === "celsius" ? "°" : "°";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, type: "spring", stiffness: 280, damping: 25 }}
      className="glass glass-hover p-4"
    >
      <h3 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-3 px-1">Hourly Forecast</h3>
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-2 scroll-smooth"
        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
      >
        {hours.map((time, i) => {
          const isDay = isDays ? isDays[i] === 1 : currentIsDay;
          const weatherInfo = getWeatherInfo(codes[i], isDay);
          const isNow = i === 0;
          return (
            <motion.div
              key={time}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-3 py-3 rounded-2xl cursor-default transition-all ${
                isNow ? "border-soft-cyan-300/50" : "border-transparent"
              }`}
              style={{
                scrollSnapAlign: "start",
                minWidth: 64,
                background: isNow ? "rgba(110,247,247,0.15)" : "rgba(255,255,255,0.06)",
                border: `1px solid ${isNow ? "rgba(110,247,247,0.4)" : "rgba(255,255,255,0.08)"}`,
              }}
            >
              {/* Time */}
              <span className={`text-xs font-semibold ${isNow ? "text-soft-cyan-300" : "text-white/50"}`}>
                {isNow ? (
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-soft-cyan-400 animate-pulse" />
                    Now
                  </span>
                ) : (
                  formatHourLabel(time, timezone)
                )}
              </span>
              {/* Icon */}
              <div className="text-white/80">
                <WeatherIcon iconName={weatherInfo.iconName} size={22} />
              </div>
              {/* Temp */}
              <span className="text-white font-semibold text-sm">{Math.round(temps[i])}{unitSymbol}</span>
              {/* Rain chance */}
              {precips[i] > 0 && (
                <div className="flex items-center gap-0.5">
                  <Droplets size={10} className="text-soft-cyan-300" />
                  <span className="text-soft-cyan-300 text-xs">{precips[i]}%</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
