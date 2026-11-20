import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, Check, Sun, Moon, Cloud, CloudSun, CloudMoon,
  CloudRain, CloudDrizzle, CloudSnow, CloudLightning, CloudFog
} from "lucide-react";

const ICON_MAP = {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
  CloudFog,
};

const PRESET_OPTIONS = [
  { id: "clear-day", label: "Clear Day", icon: Sun },
  { id: "clear-night", label: "Clear Night", icon: Moon },
  { id: "cloudy", label: "Cloudy", icon: Cloud },
  { id: "rain", label: "Rain", icon: CloudRain },
  { id: "drizzle", label: "Drizzle", icon: CloudDrizzle },
  { id: "snow", label: "Snow", icon: CloudSnow },
  { id: "thunderstorm", label: "Thunderstorm", icon: CloudLightning },
  { id: "fog", label: "Fog", icon: CloudFog },
];

export default function ThemeDropdown({ currentTheme, onThemeChange, liveWeatherInfo }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Real-time live condition icon and label
  const LiveIcon = (liveWeatherInfo?.iconName && ICON_MAP[liveWeatherInfo.iconName]) || Sun;
  const liveLabel = `${liveWeatherInfo?.label || "Clear Sky"} (Live)`;

  const allOptions = [
    { id: "auto", label: liveLabel, icon: LiveIcon },
    ...PRESET_OPTIONS,
  ];

  const activeOption = allOptions.find((t) => (currentTheme ? t.id === currentTheme : t.id === "auto")) || allOptions[0];
  const ActiveIcon = activeOption.icon;

  const handleSelect = (id) => {
    onThemeChange(id === "auto" ? null : id);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Dropdown Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 h-9 rounded-full text-xs font-semibold text-white/90 hover:text-white transition-all cursor-pointer whitespace-nowrap"
        style={{
          background: "rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(20px)",
          border: open ? "1px solid rgba(110, 247, 247, 0.5)" : "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: open ? "0 0 16px rgba(110, 247, 247, 0.25)" : "0 4px 16px rgba(0, 0, 0, 0.2)",
        }}
        aria-label="Weather Theme Selection"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <ActiveIcon size={14} className={currentTheme ? "text-soft-cyan-300" : "text-soft-cyan-200"} />
        <span className="truncate max-w-[130px] sm:max-w-none">{activeOption.label}</span>
        <ChevronDown
          size={14}
          className={`text-white/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-52 rounded-2xl p-1.5 z-50 overflow-hidden"
            style={{
              background: "rgba(4, 20, 32, 0.94)",
              backdropFilter: "blur(32px)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              boxShadow: "0 16px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(110, 247, 247, 0.1)",
            }}
            role="listbox"
          >
            <div className="px-2.5 py-1.5 text-[10px] font-bold text-white/40 uppercase tracking-widest border-b border-white/10 mb-1">
              Weather Theme
            </div>

            <div className="flex flex-col gap-0.5 max-h-64 overflow-y-auto no-scrollbar">
              {allOptions.map((item) => {
                const isSelected = item.id === "auto" ? !currentTheme : currentTheme === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`flex items-center justify-between w-full px-2.5 py-2 rounded-xl text-xs font-medium text-left transition-all ${
                      isSelected
                        ? "bg-soft-cyan-400/20 text-soft-cyan-300 font-semibold"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="flex items-center gap-2 truncate pr-1">
                      <Icon size={14} className={isSelected ? "text-soft-cyan-300" : "text-white/50"} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {isSelected && <Check size={14} className="text-soft-cyan-300 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
