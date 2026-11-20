// Utility formatting functions for the Weather App

/**
 * Format temperature with unit symbol
 */
export function formatTemp(value, unit = "celsius") {
  if (value === null || value === undefined) return "--";
  const rounded = Math.round(value);
  return `${rounded}°${unit === "celsius" ? "C" : "F"}`;
}

/**
 * Format temperature number only (no symbol)
 */
export function formatTempValue(value) {
  if (value === null || value === undefined) return "--";
  return Math.round(value).toString();
}

/**
 * Format wind speed with unit
 */
export function formatWind(value, unit = "kmh") {
  if (value === null || value === undefined) return "--";
  const rounded = Math.round(value);
  return `${rounded} ${unit === "kmh" ? "km/h" : "mph"}`;
}

/**
 * Convert wind direction degrees to compass label
 */
export function windDegreesToCompass(degrees) {
  if (degrees === null || degrees === undefined) return "--";
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

/**
 * Format a time string from ISO or HH:MM format for display
 */
export function formatTime(timeStr, timezone) {
  if (!timeStr) return "--";
  try {
    // Handle HH:MM format (from daily sunrise/sunset)
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(timeStr)) {
      const date = new Date(timeStr);
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: timezone,
      });
    }
    const date = new Date(timeStr);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: timezone,
    });
  } catch {
    return timeStr;
  }
}

/**
 * Format full date and time for the city's timezone
 */
export function formatDateTime(timezone) {
  if (!timezone) return { date: "--", time: "--" };
  try {
    const now = new Date();
    const date = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: timezone,
    });
    const time = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: timezone,
    });
    return { date, time };
  } catch {
    return { date: "--", time: "--" };
  }
}

/**
 * Get greeting based on hour in city's timezone
 */
export function getGreeting(timezone) {
  if (!timezone) return { text: "Hello", emoji: "👋" };
  try {
    const hour = parseInt(
      new Date().toLocaleString("en-US", { hour: "numeric", hour12: false, timeZone: timezone }),
      10
    );
    if (hour >= 5 && hour < 12) return { text: "Good Morning", emoji: "🌅" };
    if (hour >= 12 && hour < 17) return { text: "Good Afternoon", emoji: "☀️" };
    if (hour >= 17 && hour < 21) return { text: "Good Evening", emoji: "🌆" };
    return { text: "Good Night", emoji: "🌙" };
  } catch {
    return { text: "Hello", emoji: "👋" };
  }
}

/**
 * Get weekday name from date string
 */
export function getWeekday(dateStr, timezone, options = {}) {
  if (!dateStr) return "--";
  try {
    const date = new Date(dateStr + "T12:00:00");
    return date.toLocaleDateString("en-US", {
      weekday: options.short ? "short" : "long",
      timeZone: timezone || "UTC",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Format hourly time label
 */
export function formatHourLabel(isoTime, timezone) {
  if (!isoTime) return "--";
  try {
    const date = new Date(isoTime);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
      timeZone: timezone,
    });
  } catch {
    return "--";
  }
}

/**
 * Generate a weather summary sentence from hourly data
 */
export function generateWeatherSummary(hourlyData, timezone, weatherCode) {
  if (!hourlyData || !hourlyData.time) return "";
  
  try {
    const now = new Date();
    const currentHour = now.toLocaleString("en-US", { hour: "numeric", hour12: false, timeZone: timezone });
    const currentHourInt = parseInt(currentHour, 10);
    
    // Find next rain in the next 6 hours
    const currentIndex = hourlyData.time.findIndex(t => {
      const tDate = new Date(t);
      const tHour = parseInt(tDate.toLocaleString("en-US", { hour: "numeric", hour12: false, timeZone: timezone }), 10);
      return tHour === currentHourInt;
    });
    
    if (currentIndex === -1) return "";
    
    // Check for rain in next 6 hours
    for (let i = currentIndex + 1; i < Math.min(currentIndex + 7, hourlyData.time.length); i++) {
      const precip = hourlyData.precipitation_probability?.[i] ?? 0;
      const code = hourlyData.weather_code?.[i] ?? 0;
      if (precip > 60 || [61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code)) {
        const hoursAway = i - currentIndex;
        if (hoursAway === 1) return "🌂 Rain expected in about 1 hour. Carry an umbrella!";
        return `🌂 Expect rain in about ${hoursAway} hours. Carry an umbrella.`;
      }
    }
    
    // Check if it's currently raining
    if ([61, 63, 65, 80, 81, 82].includes(weatherCode)) return "☔ It's raining right now. Stay dry!";
    if ([95, 96, 99].includes(weatherCode)) return "⛈️ Thunderstorm in progress. Stay indoors!";
    if ([71, 73, 75, 85, 86].includes(weatherCode)) return "❄️ Snow falling. Drive carefully!";
    if ([45, 48].includes(weatherCode)) return "🌫️ Foggy conditions. Reduced visibility.";
    if ([0, 1].includes(weatherCode)) return "😎 Clear skies ahead. Enjoy the weather!";
    
    return "🌤️ Partly cloudy conditions throughout the day.";
  } catch {
    return "";
  }
}

/**
 * Calculate UV index label and color
 */
export function getUVLabel(uvIndex) {
  if (uvIndex === null || uvIndex === undefined) return { label: "--", color: "text-white" };
  if (uvIndex <= 2) return { label: "Low", color: "text-soft-cyan-300" };
  if (uvIndex <= 5) return { label: "Moderate", color: "text-soft-cyan-400" };
  if (uvIndex <= 7) return { label: "High", color: "text-lilac-300" };
  if (uvIndex <= 10) return { label: "Very High", color: "text-thistle-300" };
  return { label: "Extreme", color: "text-thistle-400" };
}

/**
 * Format pressure
 */
export function formatPressure(hPa) {
  if (hPa === null || hPa === undefined) return "--";
  return `${Math.round(hPa)} hPa`;
}
