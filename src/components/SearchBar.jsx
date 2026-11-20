import { useState, useRef, useEffect, useCallback } from "react";
import { Search, MapPin, Loader2, X, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "../hooks/useDebounce.js";
import { searchCities } from "../api/weather.js";

export default function SearchBar({ onSelect, onUseLocation, locating, recentSearches = [] }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [focused, setFocused] = useState(false);
  const debouncedQuery = useDebounce(query, 400);
  const abortRef = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Search cities when debounced query changes
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setSearching(true);
    searchCities(debouncedQuery, abortRef.current.signal)
      .then((cities) => {
        setResults(cities);
        setOpen(cities.length > 0);
        setSearching(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setSearching(false);
      });
    return () => { if (abortRef.current) abortRef.current.abort(); };
  }, [debouncedQuery]);

  // Show recent searches when focused with empty query
  const showRecent = focused && !query && recentSearches.length > 0;

  // Click outside to close
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = useCallback((city) => {
    setQuery(city.name);
    setOpen(false);
    setFocused(false);
    onSelect(city);
    setTimeout(() => setQuery(""), 200);
  }, [onSelect]);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  };

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -8 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.15, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, y: -8, transition: { duration: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.04, duration: 0.15 } }),
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto">
      {/* Search input */}
      <motion.div
        animate={{ boxShadow: focused ? "0 0 0 2px rgba(110,247,247,0.5), 0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.2)" }}
        transition={{ duration: 0.2 }}
        className="relative flex items-center rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.2)" }}
      >
        <div className="pl-4 pr-2 flex-shrink-0">
          <AnimatePresence mode="wait">
            {searching ? (
              <motion.div key="loader" initial={{ opacity: 0, rotate: 0 }} animate={{ opacity: 1, rotate: 360 }} exit={{ opacity: 0 }}>
                <Loader2 size={20} className="text-soft-cyan-300 animate-spin" />
              </motion.div>
            ) : (
              <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Search size={20} className="text-white/60" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { setFocused(true); if (query.length >= 2) setOpen(true); else if (recentSearches.length > 0) setOpen(true); }}
          placeholder="Search city..."
          className="flex-1 py-3.5 px-2 bg-transparent text-white placeholder-white/40 outline-none text-base font-medium"
          aria-label="Search for a city"
          aria-autocomplete="list"
          aria-expanded={open}
          role="combobox"
        />
        <div className="flex items-center pr-3 gap-1">
          {query && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleClear}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Clear search"
            >
              <X size={16} />
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.94 }}
            onClick={onUseLocation}
            disabled={locating}
            className="relative p-1.5 rounded-lg text-soft-cyan-300 hover:text-soft-cyan-200 hover:bg-white/10 transition-colors disabled:opacity-50"
            aria-label="Use my location"
            title="Use my location"
          >
            {locating && (
              <div className="absolute inset-0 rounded-lg">
                <div className="absolute inset-0 rounded-lg border border-soft-cyan-300 opacity-50 animate-ping" />
              </div>
            )}
            <MapPin size={18} />
          </motion.button>
        </div>
      </motion.div>

      {/* Dropdown */}
      <AnimatePresence>
        {(open && (results.length > 0 || showRecent)) && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden z-50"
            style={{ background: "rgba(4,20,32,0.9)", backdropFilter: "blur(32px)", border: "1px solid rgba(255,255,255,0.15)" }}
            role="listbox"
            aria-label="Search results"
          >
            {showRecent && (
              <>
                <div className="px-4 pt-3 pb-1">
                  <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">Recent</span>
                </div>
                {recentSearches.map((city, i) => (
                  <motion.button
                    key={city.id ?? `recent-${i}`}
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    onClick={() => handleSelect(city)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-left group"
                    role="option"
                  >
                    <Clock size={14} className="text-white/40 flex-shrink-0" />
                    <div>
                      <div className="text-white text-sm font-medium">{city.name}</div>
                      <div className="text-white/50 text-xs">{[city.admin1, city.country].filter(Boolean).join(", ")}</div>
                    </div>
                  </motion.button>
                ))}
                {results.length > 0 && <div className="mx-4 my-1 border-t border-white/10" />}
              </>
            )}
            {results.map((city, i) => (
              <motion.button
                key={city.id ?? i}
                custom={i}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                onClick={() => handleSelect(city)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left group"
                role="option"
              >
                <MapPin size={14} className="text-soft-cyan-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-semibold truncate">{city.name}</div>
                  <div className="text-white/50 text-xs truncate">{[city.admin1, city.country].filter(Boolean).join(", ")}</div>
                </div>
                {city.country_code && (
                  <span className="text-xs font-mono text-white/30 flex-shrink-0">{city.country_code}</span>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
