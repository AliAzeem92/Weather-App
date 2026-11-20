# SkyView — Production-Quality Weather App

An immersive, production-quality weather application built with React 18, Vite, Tailwind CSS v3.4, and the free Open-Meteo APIs (no API key required).

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## ✨ Features

1. **City Search with Debounce (400ms)**:
   - Live autocomplete querying Open-Meteo Geocoding API with 400ms debounce.
   - Dropdown showing city, administrative region, country, and country code.
   - Keyboard accessible and click-outside dismissal.

2. **Geolocation ("Use My Location")**:
   - One-click location detection using the browser Geolocation API.
   - Radar-pulsing indicator during location lookup.
   - Graceful fallback for permission denied, timeout, and unsupported environments.

3. **Current Weather Card**:
   - City name, localized date/time in city's timezone, and smart greeting (Good Morning, Afternoon, Evening, Night).
   - Animated count-up temperature display when data or units change.
   - Floating condition icon and localized weather summary (e.g. rain predictions).
   - Feels-like, humidity, wind speed & compass direction, air pressure, cloud cover, precipitation.
   - Interactive 3D tilt effect on desktop tracking cursor movement.

4. **Hourly Forecast (Next 24 Hours)**:
   - Horizontally scrollable strip with scroll-snap and custom scrollbar.
   - Scaled card animations, live day/night-accurate weather icons, temperatures, and rain probability.
   - Highlighted "Now" card with a pulsing soft-cyan status indicator.

5. **7-Day Forecast**:
   - List of days with weekday, weather condition icon, and max rain probability.
   - Animated gradient temperature range bars with relative scaling.
   - Expandable rows detailing daily sunrise, sunset, and UV index.

6. **Extra Details & Visual Gauges**:
   - Animated Solar Path Arc tracking real-time position of the sun/moon between sunrise and sunset.
   - Animated circular UV index gauge with categorized risk levels (Low to Extreme).
   - Animated circular humidity gauge with smooth fill animation.
   - Animated wind compass with an arrow needle rotating to the current wind direction angle.
   - Precipitation summary and daily rain chance.

7. **Unit Toggle (°C / °F and km/h / mph)**:
   - Smooth animated sliding pill toggle switch.
   - Automatically synchronizes temperatures and wind speeds.
   - Persisted in browser `localStorage`.

8. **Recent Searches**:
   - Stores up to 5 recently viewed cities in `localStorage`.
   - Restores the last viewed city on reload (defaults to Faisalabad on initial visit).
   - Quick-access chips with individual remove options.

9. **Dynamic Theming & Living Ambient Backgrounds**:
   - 8 distinct atmospheric scenes that crossfade smoothly (~1s transition):
     - **Clear Day**: Icy-blue gradient, softly glowing sun with rotating rays, drifting clouds.
     - **Clear Night**: Deep pale-sky & thistle gradient, twinkling stars, glowing moon, shooting stars.
     - **Cloudy**: Parallax layered clouds drifting at varied speeds and opacities.
     - **Rain / Drizzle**: High-performance canvas rain streaks with floor ripples.
     - **Thunderstorm**: Rain canvas with synchronized lightning flash flickers.
     - **Snow**: Swaying canvas snowflakes with varied size and blur.
     - **Fog**: Multi-layered translucent fog drifts.
   - Morphing Aurora blobs (soft-cyan, thistle, lilac) floating behind glass cards.
   - Subtle procedural noise/grain overlay for depth.
   - Sleek Theme Preview dropdown in the top header right beside the °C/°F unit toggle for instant testing of all weather scenes.

10. **Accessibility & Performance**:
    - Full `prefers-reduced-motion` compliance.
    - Pauses canvas animation loops when tab is hidden (`document.visibilityState`).
    - Device-adaptive particle counts (mobile vs desktop) ensuring steady 60fps.
    - WCAG AA contrast on text over all dynamic background states.

---

## 🎨 Color Palette

Configured in `tailwind.config.js`:

| Color Group | Key Hex Values | Usage |
|-------------|----------------|-------|
| `soft-cyan` | `#e7fefe` (50) to `#022222` (950) | Primary accent, glowing rings, active states |
| `icy-blue` | `#e7f6fd` (50) to `#021822` (950) | Daytime clear sky backgrounds, gradients |
| `pale-sky` | `#e8f4fc` (50) to `#041420` (950) | Sky gradients, deep night gradients, text |
| `thistle` | `#f3edf7` (50) to `#120b19` (950) | Night/rain gradients, secondary accents, range bars |
| `lilac` | `#f5eff6` (50) to `#160d17` (950) | Aurora highlights, evening gradients |

---

## 🌐 APIs Used (Free, No Key Required)

1. **Open-Meteo Geocoding API**:
   - `https://geocoding-api.open-meteo.com/v1/search?name={query}&count=5&language=en&format=json`
2. **Open-Meteo Weather Forecast API**:
   - `https://api.open-meteo.com/v1/forecast`
   - Requesting: current weather parameters, hourly forecast with `is_day`, daily forecast, `timezone=auto`, `forecast_days=7`.

---

## 📂 Project Architecture

```
src/
├── api/
│   └── weather.js          # Open-Meteo API layer with AbortController
├── components/
│   ├── icons/
│   │   └── WeatherIcon.jsx # Animated weather icons (lucide-react + framer-motion)
│   ├── CurrentWeather.jsx  # Primary weather card with 3D tilt & count-up
│   ├── DailyForecast.jsx   # 7-day forecast with expandable rows & temp bars
│   ├── ErrorMessage.jsx    # Animated error state with shake and retry
│   ├── HourlyForecast.jsx  # 24-hour horizontal forecast strip
│   ├── RecentSearches.jsx  # Recent search pill chips
│   ├── SearchBar.jsx       # Debounced search bar with autocomplete & geolocation
│   ├── Skeletons.jsx       # Shimmer loading skeleton placeholders
│   ├── UnitToggle.jsx      # Sliding spring pill toggle (°C/°F)
│   ├── WeatherBackground.jsx # Living ambient canvas & CSS weather scenes
│   └── WeatherDetails.jsx  # Sun arc, UV gauge, humidity gauge, wind compass
├── hooks/
│   ├── useDebounce.js      # Debounce hook for city search
│   ├── useGeolocation.js   # Browser Geolocation API hook
│   ├── useLocalStorage.js  # Safe localStorage persistence hook
│   └── useWeather.js       # Weather fetching and state management hook
├── utils/
│   ├── formatters.js       # Formatting helpers (temp, wind, time, summary)
│   └── weatherCodes.js     # WMO code mapping to labels, icons, themes
├── App.jsx                 # Main application orchestrator & layout
├── index.css               # Tailwind directives, custom glassmorphism & scrollbar
└── main.jsx                # React root mount
```
