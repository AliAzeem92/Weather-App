import { motion } from "framer-motion";

export default function UnitToggle({ unit, onToggle }) {
  const isCelsius = unit === "celsius";

  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        className="relative flex items-center rounded-full p-1 cursor-pointer"
        style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", width: 72, height: 36 }}
        aria-label={`Switch to ${isCelsius ? "Fahrenheit" : "Celsius"}`}
        role="switch"
        aria-checked={!isCelsius}
      >
        {/* Sliding pill */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
          className="absolute rounded-full"
          style={{
            width: 28,
            height: 28,
            background: "linear-gradient(135deg, #6ef7f7, #3ef4f4)",
            boxShadow: "0 0 12px rgba(110,247,247,0.6)",
            left: isCelsius ? 4 : 38,
          }}
        />
        {/* Labels */}
        <span className={`relative z-10 text-xs font-bold w-8 text-center transition-colors duration-200 ${isCelsius ? "text-pale-sky-950" : "text-white/60"}`}>
          °C
        </span>
        <span className={`relative z-10 text-xs font-bold w-8 text-center transition-colors duration-200 ${!isCelsius ? "text-pale-sky-950" : "text-white/60"}`}>
          °F
        </span>
      </motion.button>
    </div>
  );
}
