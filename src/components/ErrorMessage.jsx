import { motion } from "framer-motion";
import { CloudOff, RefreshCw } from "lucide-react";

export default function ErrorMessage({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, x: [0, -8, 8, -5, 5, 0] }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center justify-center gap-6 py-16 px-8 text-center"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <CloudOff size={64} className="text-white/40" strokeWidth={1} />
      </motion.div>
      <div>
        <h3 className="text-white text-xl font-semibold mb-2">Something went wrong</h3>
        <p className="text-white/60 text-sm max-w-sm">{message || "Failed to load weather data. Check your connection and try again."}</p>
      </div>
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
          style={{ background: "rgba(110,247,247,0.2)", border: "1px solid rgba(110,247,247,0.4)", color: "#6ef7f7" }}
        >
          <RefreshCw size={16} />
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
}
