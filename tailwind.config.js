/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "soft-cyan": {
          50: "#e7fefe", 100: "#cffcfc", 200: "#9ff9f9", 300: "#6ef7f7", 400: "#3ef4f4",
          500: "#0ef1f1", 600: "#0bc1c1", 700: "#089191", 800: "#066060", 900: "#033030", 950: "#022222",
        },
        "icy-blue": {
          50: "#e7f6fd", 100: "#cfeefc", 200: "#9fdcf9", 300: "#6fcbf6", 400: "#3fbaf3",
          500: "#0fa9f0", 600: "#0c87c0", 700: "#096590", 800: "#064360", 900: "#032230", 950: "#021822",
        },
        "pale-sky": {
          50: "#e8f4fc", 100: "#d2e8f9", 200: "#a5d1f3", 300: "#78baed", 400: "#4aa3e8",
          500: "#1d8de2", 600: "#1770b5", 700: "#125487", 800: "#0c385a", 900: "#061c2d", 950: "#041420",
        },
        thistle: {
          50: "#f3edf7", 100: "#e6dcef", 200: "#cdb8e0", 300: "#b495d0", 400: "#9c71c1",
          500: "#834eb1", 600: "#693e8e", 700: "#4e2f6a", 800: "#341f47", 900: "#1a1023", 950: "#120b19",
        },
        lilac: {
          50: "#f5eff6", 100: "#ebdeed", 200: "#d7beda", 300: "#c49dc8", 400: "#b07cb6",
          500: "#9c5ca3", 600: "#7d4983", 700: "#5e3762", 800: "#3e2541", 900: "#1f1221", 950: "#160d17",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        drift: {
          "0%": { transform: "translateX(-10px)" },
          "100%": { transform: "translateX(10px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.3", transform: "scale(0.8)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 10px rgba(110, 247, 247, 0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(110, 247, 247, 0.8)" },
        },
        aurora: {
          "0%": { transform: "translate(0%, 0%) scale(1)" },
          "33%": { transform: "translate(5%, -5%) scale(1.1)" },
          "66%": { transform: "translate(-3%, 3%) scale(0.95)" },
          "100%": { transform: "translate(0%, 0%) scale(1)" },
        },
        "rain-fall": {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translateY(100vh)", opacity: "0.5" },
        },
        "snow-fall": {
          "0%": { transform: "translateY(-10px) translateX(0px)", opacity: "0" },
          "10%": { opacity: "1" },
          "50%": { transform: "translateY(50vh) translateX(10px)" },
          "100%": { transform: "translateY(100vh) translateX(-10px)", opacity: "0.5" },
        },
        lightning: {
          "0%, 90%, 100%": { opacity: "0" },
          "92%, 96%": { opacity: "0.8" },
          "94%": { opacity: "0" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        sheen: {
          "0%": { transform: "translateX(-100%) skewX(-15deg)" },
          "100%": { transform: "translateX(300%) skewX(-15deg)" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "1" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        "shooting-star": {
          "0%": { transform: "translateX(0) translateY(0)", opacity: "1" },
          "100%": { transform: "translateX(300px) translateY(300px)", opacity: "0" },
        },
        "fog-drift": {
          "0%": { transform: "translateX(-5%)" },
          "100%": { transform: "translateX(5%)" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        drift: "drift 8s ease-in-out infinite alternate",
        twinkle: "twinkle 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        aurora: "aurora 20s ease-in-out infinite",
        "rain-fall": "rain-fall 1s linear infinite",
        "snow-fall": "snow-fall 5s ease-in-out infinite",
        lightning: "lightning 8s ease-in-out infinite",
        "spin-slow": "spin-slow 20s linear infinite",
        sheen: "sheen 0.6s ease-in-out",
        ripple: "ripple 0.6s linear",
        "shooting-star": "shooting-star 1s ease-out forwards",
        "fog-drift": "fog-drift 10s ease-in-out infinite alternate",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.25)",
        "glow-cyan": "0 0 20px rgba(110,247,247,0.4), 0 0 60px rgba(110,247,247,0.1)",
        "glow-thistle": "0 0 20px rgba(180,149,208,0.4), 0 0 60px rgba(180,149,208,0.1)",
      },
      backdropBlur: {
        "3xl": "64px",
        "4xl": "96px",
      },
    },
  },
  plugins: [],
};
