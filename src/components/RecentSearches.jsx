import { Clock, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RecentSearches({ searches, onSelect, onRemove }) {
  if (!searches || searches.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <Clock size={12} className="text-white/40" />
        <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">Recent</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {searches.map((city, i) => (
            <motion.div
              key={city.id ?? `r-${i}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-1.5 rounded-full pr-2 pl-3 py-1.5 group cursor-pointer hover:border-soft-cyan-300/50 transition-all"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <button
                onClick={() => onSelect(city)}
                className="text-white/80 hover:text-white text-sm font-medium transition-colors"
              >
                {city.name}
              </button>
              {onRemove && (
                <button
                  onClick={(e) => { e.stopPropagation(); onRemove(i); }}
                  className="text-white/30 hover:text-white/70 transition-colors ml-0.5"
                  aria-label={`Remove ${city.name} from recent searches`}
                >
                  <X size={12} />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
