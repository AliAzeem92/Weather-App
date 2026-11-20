import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Noise/grain overlay as SVG data URI for texture
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`;

// Theme gradient configs
const THEME_CONFIGS = {
  "clear-day": {
    gradient: "linear-gradient(160deg, #3fbaf3 0%, #0fa9f0 40%, #1770b5 100%)",
    auroraColors: ["rgba(110,247,247,0.15)", "rgba(63,186,243,0.1)", "rgba(29,141,226,0.08)"],
  },
  "clear-night": {
    gradient: "linear-gradient(160deg, #041420 0%, #1a1023 50%, #160d17 100%)",
    auroraColors: ["rgba(110,247,247,0.08)", "rgba(180,149,208,0.12)", "rgba(156,92,163,0.08)"],
  },
  "cloudy": {
    gradient: "linear-gradient(160deg, #125487 0%, #0c385a 60%, #341f47 100%)",
    auroraColors: ["rgba(74,163,232,0.1)", "rgba(110,247,247,0.06)", "rgba(180,149,208,0.08)"],
  },
  "rain": {
    gradient: "linear-gradient(160deg, #0c385a 0%, #061c2d 50%, #1a1023 100%)",
    auroraColors: ["rgba(12,56,90,0.2)", "rgba(110,247,247,0.06)", "rgba(180,149,208,0.08)"],
  },
  "drizzle": {
    gradient: "linear-gradient(160deg, #125487 0%, #0c385a 50%, #341f47 100%)",
    auroraColors: ["rgba(18,84,135,0.15)", "rgba(110,247,247,0.06)", "rgba(180,149,208,0.08)"],
  },
  "snow": {
    gradient: "linear-gradient(160deg, #9fdcf9 0%, #3fbaf3 50%, #1d8de2 100%)",
    auroraColors: ["rgba(159,220,249,0.2)", "rgba(110,247,247,0.15)", "rgba(29,141,226,0.1)"],
  },
  "thunderstorm": {
    gradient: "linear-gradient(160deg, #061c2d 0%, #1a1023 50%, #160d17 100%)",
    auroraColors: ["rgba(6,28,45,0.3)", "rgba(110,247,247,0.1)", "rgba(180,149,208,0.12)"],
  },
  "fog": {
    gradient: "linear-gradient(160deg, #1770b5 0%, #125487 50%, #4e2f6a 100%)",
    auroraColors: ["rgba(23,112,181,0.15)", "rgba(110,247,247,0.08)", "rgba(78,47,106,0.1)"],
  },
};

// Aurora blob component
function AuroraBlob({ color, style, duration = 20 }) {
  return (
    <div
      className="absolute rounded-full blur-3xl pointer-events-none"
      style={{
        background: color,
        animation: `aurora ${duration}s ease-in-out infinite`,
        willChange: "transform",
        ...style,
      }}
    />
  );
}

// Star field for clear night
function StarField() {
  const stars = useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 60,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 4,
      duration: 2 + Math.random() * 3,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
            willChange: "opacity, transform",
          }}
        />
      ))}
      {/* Moon */}
      <div
        className="absolute"
        style={{ right: "12%", top: "8%" }}
      >
        <div
          className="rounded-full"
          style={{
            width: 60,
            height: 60,
            background: "radial-gradient(circle at 35% 35%, #e8f4fc, #cffcfc)",
            boxShadow: "0 0 40px rgba(207,252,252,0.4), 0 0 80px rgba(207,252,252,0.15)",
          }}
        />
      </div>
      {/* Shooting star */}
      <ShootingStar />
    </div>
  );
}

function ShootingStar() {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 20, y: 10 });

  useEffect(() => {
    const schedule = () => {
      const delay = 6000 + Math.random() * 10000;
      const timer = setTimeout(() => {
        setPos({ x: Math.random() * 60, y: Math.random() * 20 });
        setVisible(true);
        setTimeout(() => { setVisible(false); schedule(); }, 1000);
      }, delay);
      return timer;
    };
    const t = schedule();
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;
  return (
    <div
      className="absolute w-1 h-1 rounded-full bg-white"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        animation: "shooting-star 1s ease-out forwards",
        boxShadow: "0 0 6px 2px rgba(255,255,255,0.8), 100px 100px 0 rgba(255,255,255,0)",
        willChange: "transform, opacity",
      }}
    />
  );
}

// Sun component for clear day
function AnimatedSun() {
  return (
    <div className="absolute" style={{ right: "10%", top: "5%" }}>
      {/* Glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: 160,
          height: 160,
          top: -40,
          left: -40,
          background: "radial-gradient(circle, rgba(255,220,100,0.3) 0%, transparent 70%)",
          animation: "pulse-glow 4s ease-in-out infinite",
        }}
      />
      {/* Sun disc */}
      <div
        className="rounded-full"
        style={{
          width: 80,
          height: 80,
          background: "radial-gradient(circle at 40% 40%, #fff7d6, #ffd700)",
          boxShadow: "0 0 40px rgba(255,215,0,0.6), 0 0 80px rgba(255,215,0,0.2)",
          animation: "float 6s ease-in-out infinite",
        }}
      />
      {/* Rotating rays */}
      <div
        className="absolute rounded-full"
        style={{
          width: 100,
          height: 100,
          top: -10,
          left: -10,
          border: "2px dashed rgba(255,215,0,0.3)",
          animation: "spin-slow 20s linear infinite",
          borderRadius: "50%",
        }}
      />
    </div>
  );
}

// Drifting clouds
function DriftingClouds({ count = 3, opacity = 0.6 }) {
  const clouds = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i,
    top: 5 + i * 12,
    duration: 30 + i * 20,
    delay: -i * 10,
    scale: 0.6 + i * 0.3,
    opacity: opacity - i * 0.1,
  })), [count, opacity]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {clouds.map((c) => (
        <div
          key={c.id}
          className="absolute"
          style={{
            top: `${c.top}%`,
            animation: `drift ${c.duration}s ease-in-out ${c.delay}s infinite alternate`,
            transform: `scale(${c.scale})`,
            opacity: c.opacity,
            left: c.id % 2 === 0 ? "5%" : "60%",
            willChange: "transform",
          }}
        >
          <CloudShape />
        </div>
      ))}
    </div>
  );
}

function CloudShape() {
  return (
    <svg width="200" height="80" viewBox="0 0 200 80" fill="none">
      <ellipse cx="100" cy="60" rx="90" ry="30" fill="white" fillOpacity="0.15" />
      <ellipse cx="70" cy="45" rx="50" ry="35" fill="white" fillOpacity="0.15" />
      <ellipse cx="130" cy="48" rx="45" ry="30" fill="white" fillOpacity="0.12" />
    </svg>
  );
}

// Rain canvas
function RainCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (prefersReduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const isMobile = window.innerWidth < 768;
    const drops = Array.from({ length: isMobile ? 60 : 140 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: 15 + Math.random() * 20,
      speed: 8 + Math.random() * 12,
      opacity: 0.3 + Math.random() * 0.4,
    }));

    // Floor ripples pool
    const ripples = [];

    let visible = true;
    const handleVisibility = () => { visible = document.visibilityState === "visible"; };
    document.addEventListener("visibilitychange", handleVisibility);

    const draw = () => {
      if (!visible) { animRef.current = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw & update falling drops
      drops.forEach((d) => {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 1, d.y + d.length);
        ctx.strokeStyle = `rgba(159, 220, 249, ${d.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        d.y += d.speed;

        if (d.y > canvas.height - 15) {
          // Trigger subtle ripple at the bottom
          if (ripples.length < 35 && Math.random() > 0.4) {
            ripples.push({
              x: d.x,
              y: canvas.height - 5 - Math.random() * 15,
              radius: 1,
              maxRadius: 10 + Math.random() * 10,
              opacity: 0.4,
            });
          }
          d.y = -d.length;
          d.x = Math.random() * canvas.width;
        }
      });

      // Draw & update subtle ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        ctx.beginPath();
        ctx.ellipse(r.x, r.y, r.radius, r.radius * 0.35, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(110, 247, 247, ${r.opacity})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        r.radius += 0.6;
        r.opacity -= 0.015;

        if (r.opacity <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [prefersReduced]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ opacity: 0.6 }} />;
}

// Snow canvas
function SnowCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (prefersReduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const isMobile = window.innerWidth < 768;
    const flakes = Array.from({ length: isMobile ? 40 : 100 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 1 + Math.random() * 3,
      speed: 1 + Math.random() * 2,
      sway: Math.random() * 2 - 1,
      swaySpeed: 0.5 + Math.random(),
      swayPhase: Math.random() * Math.PI * 2,
      opacity: 0.5 + Math.random() * 0.5,
    }));

    let t = 0;
    let visible = true;
    const handleVisibility = () => { visible = document.visibilityState === "visible"; };
    document.addEventListener("visibilitychange", handleVisibility);

    const draw = () => {
      if (!visible) { animRef.current = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.01;
      flakes.forEach((f) => {
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`;
        ctx.fill();
        f.y += f.speed;
        f.x += Math.sin(t * f.swaySpeed + f.swayPhase) * 0.5;
        if (f.y > canvas.height) {
          f.y = -5;
          f.x = Math.random() * canvas.width;
        }
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [prefersReduced]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}

// Lightning flash
function LightningFlash() {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const schedule = () => {
      const delay = 4000 + Math.random() * 5000;
      const t = setTimeout(() => {
        setFlash(true);
        setTimeout(() => { setFlash(false); schedule(); }, 300);
      }, delay);
      return t;
    };
    const t = schedule();
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="absolute inset-0 pointer-events-none transition-opacity duration-100"
      style={{ opacity: flash ? 0.15 : 0, background: "rgba(110, 247, 247, 0.9)" }}
    />
  );
}

// Fog layers
function FogLayers() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute w-full"
          style={{
            height: "30%",
            top: `${20 + i * 20}%`,
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,${0.04 + i * 0.02}), transparent)`,
            animation: `fog-drift ${15 + i * 8}s ease-in-out ${i * 2}s infinite alternate`,
            filter: `blur(${8 + i * 4}px)`,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}

export default function WeatherBackground({ theme = "clear-day" }) {
  const config = THEME_CONFIGS[theme] ?? THEME_CONFIGS["clear-day"];
  const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={theme}
        className="fixed inset-0 -z-10 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        style={{ background: config.gradient }}
      >
        {/* Aurora blobs */}
        {!prefersReduced && (
          <>
            <AuroraBlob
              color={config.auroraColors[0]}
              duration={18}
              style={{ width: "60vw", height: "60vw", top: "-20%", left: "-10%", maxWidth: 700, maxHeight: 700 }}
            />
            <AuroraBlob
              color={config.auroraColors[1]}
              duration={25}
              style={{ width: "50vw", height: "50vw", bottom: "-15%", right: "-5%", maxWidth: 600, maxHeight: 600 }}
            />
            <AuroraBlob
              color={config.auroraColors[2]}
              duration={22}
              style={{ width: "40vw", height: "40vw", top: "30%", left: "30%", maxWidth: 500, maxHeight: 500 }}
            />
          </>
        )}

        {/* Theme-specific scenes */}
        {theme === "clear-day" && !prefersReduced && (
          <>
            <AnimatedSun />
            <DriftingClouds count={2} opacity={0.4} />
          </>
        )}

        {theme === "clear-night" && !prefersReduced && <StarField />}

        {(theme === "cloudy") && !prefersReduced && <DriftingClouds count={4} opacity={0.7} />}

        {(theme === "rain" || theme === "drizzle") && !prefersReduced && <RainCanvas />}

        {theme === "thunderstorm" && !prefersReduced && (
          <>
            <RainCanvas />
            <LightningFlash />
          </>
        )}

        {theme === "snow" && !prefersReduced && <SnowCanvas />}

        {theme === "fog" && !prefersReduced && <FogLayers />}

        {/* Noise/grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{ backgroundImage: NOISE_SVG, backgroundRepeat: "repeat" }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
