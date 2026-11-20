import {
  Sun, Moon, Cloud, CloudSun, CloudMoon, CloudRain, CloudDrizzle,
  CloudSnow, CloudLightning, CloudFog, Zap, Wind, Snowflake
} from "lucide-react";
import { motion } from "framer-motion";

const ICON_MAP = {
  Sun, Moon, Cloud, CloudSun, CloudMoon, CloudRain, CloudDrizzle,
  CloudSnow, CloudLightning, CloudFog, Zap, Wind, Snowflake,
};

// Animation variants per icon type
const ANIMATIONS = {
  Sun: {
    animate: { rotate: 360 },
    transition: { duration: 20, repeat: Infinity, ease: "linear" },
  },
  Moon: {
    animate: { y: [0, -4, 0] },
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
  Cloud: {
    animate: { x: [0, 4, 0] },
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
  },
  CloudSun: {
    animate: { y: [0, -3, 0] },
    transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
  },
  CloudMoon: {
    animate: { y: [0, -3, 0] },
    transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
  },
  CloudRain: {
    animate: { y: [0, 2, 0] },
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
  },
  CloudDrizzle: {
    animate: { y: [0, 2, 0] },
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
  CloudSnow: {
    animate: { y: [0, -2, 2, 0], rotate: [0, -5, 5, 0] },
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
  CloudLightning: {
    animate: { opacity: [1, 0.4, 1, 0.6, 1] },
    transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
  },
  CloudFog: {
    animate: { x: [0, 3, 0] },
    transition: { duration: 8, repeat: Infinity, ease: "easeInOut" },
  },
};

export default function WeatherIcon({ iconName = "Cloud", size = 48, className = "" }) {
  const IconComponent = ICON_MAP[iconName] ?? Cloud;
  const anim = ANIMATIONS[iconName] ?? { animate: {}, transition: {} };

  return (
    <motion.div
      animate={anim.animate}
      transition={anim.transition}
      className={`inline-flex ${className}`}
      style={{ willChange: "transform" }}
    >
      <IconComponent size={size} strokeWidth={1.5} />
    </motion.div>
  );
}
