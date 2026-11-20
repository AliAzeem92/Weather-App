import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, ChevronDown } from "lucide-react";
import WeatherIcon from "./icons/WeatherIcon.jsx";
import { getWeatherInfo } from "../utils/weatherCodes.js";
import { formatTempValue, getWeekday, formatTime } from "../utils/formatters.js";

function TempRangeBar({ min, max, dayMin, dayMax, unit }) {
  const totalRange = dayMax - dayMin || 1;
  const leftPct = Math.max(0, Math.min(100, ((min - dayMin) / totalRange) * 100));
  const widthPct = Math.max(4, Math.min(100 - leftPct, ((max - min) / totalRange) * 100));
  const unitSymbol = "°";

  return (
    <div className="flex items-center gap-2 flex-1">
      <span className="text-white/50 text-xs font-medium w-8 text-right">{Math.round(min)}{unitSymbol}</span>
      <div className="flex-1 relative h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${widthPct}%` }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          className="absolute h-full rounded-full"
          style={{
            left: `${leftPct}%`,
            background: "linear-gradient(90deg, #b495d0, #6ef7f7)",
          }}
        />
      </div>
      <span className="text-white text-xs font-semibold w-8">{Math.round(max)}{unitSymbol}</span>
    </div>
  );
}

export default function DailyForecast({ daily, timezone, unit }) {
  const [expanded, setExpanded] = useState(null);

  // Global min/max for relative bar widths
  const allMins = daily.temperature_2m_min;
  const allMaxs = daily.temperature_2m_max;
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 280, damping: 25 }}
      className="glass glass-hover p-4"
    >
      <h3 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-3 px-1">7-Day Forecast</h3>
      <div className="flex flex-col gap-1">
        {daily.time.map((dateStr, i) => {
          const isToday = i === 0;
          const weatherInfo = getWeatherInfo(daily.weather_code[i], true);
          const isExpanded = expanded === i;
          const weekday = isToday ? "Today" : getWeekday(dateStr, timezone, { short: true });

          return (
            <div key={dateStr}>
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                onClick={() => setExpanded(isExpanded ? null : i)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left"
                style={{ background: isExpanded ? "rgba(110,247,247,0.08)" : "transparent" }}
              >
                {/* Day */}
                <span className={`text-sm font-semibold w-12 ${isToday ? "text-soft-cyan-300" : "text-white/80"}`}>
                  {weekday}
                </span>
                {/* Icon */}
                <div className="text-white/70 flex-shrink-0">
                  <WeatherIcon iconName={weatherInfo.iconName} size={20} />
                </div>
                {/* Rain */}
                <div className="flex items-center gap-0.5 w-10">
                  {daily.precipitation_probability_max[i] > 0 && (
                    <>
                      <Droplets size={10} className="text-soft-cyan-300" />
                      <span className="text-soft-cyan-300 text-xs">{daily.precipitation_probability_max[i]}%</span>
                    </>
                  )}
                </div>
                {/* Temp bar */}
                <TempRangeBar
                  min={daily.temperature_2m_min[i]}
                  max={daily.temperature_2m_max[i]}
                  dayMin={globalMin}
                  dayMax={globalMax}
                  unit={unit}
                />
                <ChevronDown
                  size={14}
                  className={`text-white/30 flex-shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                />
              </motion.button>

              {/* Expanded row */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="flex gap-3 px-3 py-2 mx-3 mb-1 rounded-xl text-xs text-white/60"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <span>🌅 Sunrise: {formatTime(daily.sunrise[i], timezone)}</span>
                      <span>🌇 Sunset: {formatTime(daily.sunset[i], timezone)}</span>
                      <span>☀️ UV: {daily.uv_index_max[i]}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
