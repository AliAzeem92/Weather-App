import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Sunrise, Sunset, Shield, Droplets } from "lucide-react";
import { formatTime, getUVLabel } from "../utils/formatters.js";

// Animated circular gauge
function CircularGauge({ value, max, label, color, size = 80 }) {
  const r = 32;
  const circumference = 2 * Math.PI * r;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(value / max), 300);
    return () => clearTimeout(timer);
  }, [value, max]);

  const strokeDash = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" style={{ willChange: "transform" }}>
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="6"
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDash}
            style={{ transition: "stroke-dashoffset 1s ease-out", willChange: "stroke-dashoffset" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-white font-bold text-sm">{Math.round(value)}</span>
          <span className="text-white/40 text-xs">{label}</span>
        </div>
      </div>
    </div>
  );
}

// Sun arc component
function SunArc({ sunrise, sunset, timezone }) {
  const [sunPos, setSunPos] = useState(0);

  useEffect(() => {
    const calculatePos = () => {
      const now = new Date();
      const riseTime = new Date(sunrise);
      const setTime = new Date(sunset);
      const total = setTime - riseTime;
      const elapsed = now - riseTime;
      const pos = Math.max(0, Math.min(1, elapsed / total));
      setSunPos(pos);
    };
    calculatePos();
    const interval = setInterval(calculatePos, 60000);
    return () => clearInterval(interval);
  }, [sunrise, sunset]);

  const W = 240, H = 80;
  const cx = W / 2, cy = H + 10;
  const rx = W / 2 - 10, ry = H;

  // Point on ellipse at angle
  const getPoint = (t) => ({
    x: cx + rx * Math.cos(Math.PI - t * Math.PI),
    y: cy - ry * Math.sin(Math.PI - t * Math.PI),
  });
  const sunPoint = getPoint(sunPos);
  const arcPath = `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`;

  return (
    <div className="w-full">
      <svg width={W} height={H + 20} viewBox={`0 0 ${W} ${H + 20}`} className="w-full">
        {/* Arc track */}
        <path d={arcPath} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
        {/* Sunrise label */}
        <text x={cx - rx + 2} y={cy + 16} fill="rgba(255,255,255,0.4)" fontSize="10" textAnchor="start">
          {formatTime(sunrise, timezone)}
        </text>
        {/* Sunset label */}
        <text x={cx + rx - 2} y={cy + 16} fill="rgba(255,255,255,0.4)" fontSize="10" textAnchor="end">
          {formatTime(sunset, timezone)}
        </text>
        {/* Sun or Night Moon indicator */}
        {sunPos > 0 && sunPos < 1 ? (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
            <circle cx={sunPoint.x} cy={sunPoint.y} r="10" fill="rgba(255,215,0,0.2)" />
            <circle cx={sunPoint.x} cy={sunPoint.y} r="6" fill="#ffd700"
              style={{ filter: "drop-shadow(0 0 6px rgba(255,215,0,0.8))" }} />
          </motion.g>
        ) : (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
            <circle cx={cx} cy={cy - ry} r="9" fill="rgba(180,149,208,0.25)" />
            <circle cx={cx} cy={cy - ry} r="5" fill="#e8f4fc"
              style={{ filter: "drop-shadow(0 0 6px rgba(232,244,252,0.7))" }} />
          </motion.g>
        )}
      </svg>
    </div>
  );
}

// Wind compass
function WindCompass({ direction }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-16 h-16">
        <svg width="64" height="64" viewBox="0 0 64 64">
          {/* Compass circle */}
          <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
          {/* Cardinal points */}
          {[["N", 32, 8], ["S", 32, 58], ["E", 58, 34], ["W", 6, 34]].map(([label, x, y]) => (
            <text key={label} x={x} y={y} fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="middle" fontWeight="600">{label}</text>
          ))}
          {/* Needle */}
          <motion.g
            animate={{ rotate: direction }}
            transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.3 }}
            style={{ originX: "32px", originY: "32px" }}
          >
            <polygon points="32,10 29,32 32,38 35,32" fill="#6ef7f7" opacity="0.9" />
            <polygon points="32,54 29,32 32,38 35,32" fill="rgba(255,255,255,0.2)" />
            <circle cx="32" cy="32" r="3" fill="white" />
          </motion.g>
        </svg>
      </div>
    </div>
  );
}

export default function WeatherDetails({ data, timezone, unit }) {
  const { current, daily } = data;
  const uvLabel = getUVLabel(daily.uv_index_max[0]);

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, type: "spring", stiffness: 300, damping: 25 } }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, type: "spring", stiffness: 280, damping: 25 }}
      className="glass glass-hover p-4"
    >
      <h3 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-3 px-1">Details</h3>
      <div className="grid grid-cols-2 gap-3">

        {/* Sunrise/Sunset */}
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="col-span-2 p-4 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div className="flex items-center gap-1.5 text-white/50 mb-3">
            <Sunrise size={13} />
            <span className="text-xs font-semibold uppercase tracking-widest">Sun</span>
          </div>
          <SunArc sunrise={daily.sunrise[0]} sunset={daily.sunset[0]} timezone={timezone} />
        </motion.div>

        {/* UV Index */}
        <motion.div
          custom={1}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="p-4 rounded-2xl flex flex-col items-center gap-2"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div className="flex items-center gap-1.5 text-white/50 self-start">
            <Shield size={13} />
            <span className="text-xs font-semibold uppercase tracking-widest">UV Index</span>
          </div>
          <CircularGauge value={daily.uv_index_max[0]} max={11} label="UV" color="#6ef7f7" />
          <span className={`text-xs font-semibold ${uvLabel.color}`}>{uvLabel.label}</span>
        </motion.div>

        {/* Humidity gauge */}
        <motion.div
          custom={2}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="p-4 rounded-2xl flex flex-col items-center gap-2"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div className="flex items-center gap-1.5 text-white/50 self-start">
            <Droplets size={13} />
            <span className="text-xs font-semibold uppercase tracking-widest">Humidity</span>
          </div>
          <CircularGauge value={current.relative_humidity_2m} max={100} label="%" color="#b495d0" />
        </motion.div>

        {/* Wind compass */}
        <motion.div
          custom={3}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="p-4 rounded-2xl flex flex-col items-center gap-2"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div className="flex items-center gap-1.5 text-white/50 self-start">
            <span className="text-xs font-semibold uppercase tracking-widest">Wind Dir.</span>
          </div>
          <WindCompass direction={current.wind_direction_10m} />
          <span className="text-white/70 text-xs font-medium">{current.wind_direction_10m}°</span>
        </motion.div>

        {/* Precipitation */}
        <motion.div
          custom={4}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="p-4 rounded-2xl flex flex-col gap-2"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div className="flex items-center gap-1.5 text-white/50">
            <Droplets size={13} />
            <span className="text-xs font-semibold uppercase tracking-widest">Precip.</span>
          </div>
          <span className="text-white font-bold text-xl">{current.precipitation} mm</span>
          <span className="text-white/40 text-xs">Max today: {daily.precipitation_probability_max[0]}%</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
