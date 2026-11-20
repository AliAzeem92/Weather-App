// WMO Weather Code mapping for Open-Meteo API
// https://open-meteo.com/en/docs/weathercode

const weatherCodeMap = {
  0: { label: "Clear Sky", dayIcon: "Sun", nightIcon: "Moon", theme: { day: "clear-day", night: "clear-night" } },
  1: { label: "Mainly Clear", dayIcon: "Sun", nightIcon: "Moon", theme: { day: "clear-day", night: "clear-night" } },
  2: { label: "Partly Cloudy", dayIcon: "CloudSun", nightIcon: "CloudMoon", theme: { day: "cloudy", night: "clear-night" } },
  3: { label: "Overcast", dayIcon: "Cloud", nightIcon: "Cloud", theme: { day: "cloudy", night: "cloudy" } },
  45: { label: "Foggy", dayIcon: "CloudFog", nightIcon: "CloudFog", theme: { day: "fog", night: "fog" } },
  48: { label: "Icy Fog", dayIcon: "CloudFog", nightIcon: "CloudFog", theme: { day: "fog", night: "fog" } },
  51: { label: "Light Drizzle", dayIcon: "CloudDrizzle", nightIcon: "CloudDrizzle", theme: { day: "drizzle", night: "drizzle" } },
  53: { label: "Moderate Drizzle", dayIcon: "CloudDrizzle", nightIcon: "CloudDrizzle", theme: { day: "drizzle", night: "drizzle" } },
  55: { label: "Dense Drizzle", dayIcon: "CloudDrizzle", nightIcon: "CloudDrizzle", theme: { day: "drizzle", night: "drizzle" } },
  56: { label: "Freezing Drizzle", dayIcon: "CloudDrizzle", nightIcon: "CloudDrizzle", theme: { day: "rain", night: "rain" } },
  57: { label: "Heavy Freezing Drizzle", dayIcon: "CloudDrizzle", nightIcon: "CloudDrizzle", theme: { day: "rain", night: "rain" } },
  61: { label: "Light Rain", dayIcon: "CloudRain", nightIcon: "CloudRain", theme: { day: "rain", night: "rain" } },
  63: { label: "Moderate Rain", dayIcon: "CloudRain", nightIcon: "CloudRain", theme: { day: "rain", night: "rain" } },
  65: { label: "Heavy Rain", dayIcon: "CloudRain", nightIcon: "CloudRain", theme: { day: "rain", night: "rain" } },
  66: { label: "Freezing Rain", dayIcon: "CloudRain", nightIcon: "CloudRain", theme: { day: "rain", night: "rain" } },
  67: { label: "Heavy Freezing Rain", dayIcon: "CloudRain", nightIcon: "CloudRain", theme: { day: "rain", night: "rain" } },
  71: { label: "Light Snow", dayIcon: "CloudSnow", nightIcon: "CloudSnow", theme: { day: "snow", night: "snow" } },
  73: { label: "Moderate Snow", dayIcon: "CloudSnow", nightIcon: "CloudSnow", theme: { day: "snow", night: "snow" } },
  75: { label: "Heavy Snow", dayIcon: "CloudSnow", nightIcon: "CloudSnow", theme: { day: "snow", night: "snow" } },
  77: { label: "Snow Grains", dayIcon: "CloudSnow", nightIcon: "CloudSnow", theme: { day: "snow", night: "snow" } },
  80: { label: "Light Showers", dayIcon: "CloudRain", nightIcon: "CloudRain", theme: { day: "rain", night: "rain" } },
  81: { label: "Moderate Showers", dayIcon: "CloudRain", nightIcon: "CloudRain", theme: { day: "rain", night: "rain" } },
  82: { label: "Heavy Showers", dayIcon: "CloudRain", nightIcon: "CloudRain", theme: { day: "rain", night: "rain" } },
  85: { label: "Snow Showers", dayIcon: "CloudSnow", nightIcon: "CloudSnow", theme: { day: "snow", night: "snow" } },
  86: { label: "Heavy Snow Showers", dayIcon: "CloudSnow", nightIcon: "CloudSnow", theme: { day: "snow", night: "snow" } },
  95: { label: "Thunderstorm", dayIcon: "CloudLightning", nightIcon: "CloudLightning", theme: { day: "thunderstorm", night: "thunderstorm" } },
  96: { label: "Thunderstorm with Hail", dayIcon: "CloudLightning", nightIcon: "CloudLightning", theme: { day: "thunderstorm", night: "thunderstorm" } },
  99: { label: "Heavy Thunderstorm with Hail", dayIcon: "CloudLightning", nightIcon: "CloudLightning", theme: { day: "thunderstorm", night: "thunderstorm" } },
};

const defaultWeather = { label: "Unknown", dayIcon: "Cloud", nightIcon: "Cloud", theme: { day: "cloudy", night: "cloudy" } };

export function getWeatherInfo(code, isDay = true) {
  const info = weatherCodeMap[code] ?? defaultWeather;
  return {
    label: info.label,
    iconName: isDay ? info.dayIcon : info.nightIcon,
    theme: isDay ? info.theme.day : info.theme.night,
  };
}

export function getThemeColors(theme) {
  const themes = {
    "clear-day": {
      bgGradient: "from-icy-blue-400 via-icy-blue-500 to-pale-sky-600",
      bgFrom: "#3fbaf3",
      bgTo: "#1770b5",
      accent: "#6ef7f7",
      overlay: "rgba(63, 186, 243, 0.1)",
    },
    "clear-night": {
      bgGradient: "from-pale-sky-950 via-thistle-900 to-lilac-950",
      bgFrom: "#041420",
      bgTo: "#160d17",
      accent: "#6ef7f7",
      overlay: "rgba(180, 149, 208, 0.1)",
    },
    "cloudy": {
      bgGradient: "from-pale-sky-700 via-pale-sky-800 to-thistle-800",
      bgFrom: "#125487",
      bgTo: "#341f47",
      accent: "#6ef7f7",
      overlay: "rgba(74, 163, 232, 0.1)",
    },
    "rain": {
      bgGradient: "from-pale-sky-800 via-pale-sky-900 to-thistle-900",
      bgFrom: "#0c385a",
      bgTo: "#1a1023",
      accent: "#6ef7f7",
      overlay: "rgba(12, 56, 90, 0.2)",
    },
    "drizzle": {
      bgGradient: "from-pale-sky-700 via-pale-sky-800 to-thistle-800",
      bgFrom: "#125487",
      bgTo: "#341f47",
      accent: "#6ef7f7",
      overlay: "rgba(18, 84, 135, 0.2)",
    },
    "snow": {
      bgGradient: "from-icy-blue-200 via-icy-blue-400 to-pale-sky-500",
      bgFrom: "#9fdcf9",
      bgTo: "#1d8de2",
      accent: "#6ef7f7",
      overlay: "rgba(159, 220, 249, 0.2)",
    },
    "thunderstorm": {
      bgGradient: "from-pale-sky-900 via-thistle-900 to-lilac-950",
      bgFrom: "#061c2d",
      bgTo: "#160d17",
      accent: "#6ef7f7",
      overlay: "rgba(6, 28, 45, 0.3)",
    },
    "fog": {
      bgGradient: "from-pale-sky-600 via-pale-sky-700 to-thistle-700",
      bgFrom: "#1770b5",
      bgTo: "#4e2f6a",
      accent: "#6ef7f7",
      overlay: "rgba(23, 112, 181, 0.15)",
    },
  };
  return themes[theme] ?? themes["cloudy"];
}

export default weatherCodeMap;
