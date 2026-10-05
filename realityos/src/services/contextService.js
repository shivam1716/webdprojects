export async function getLiveContext() {
  const position = await getPosition();
  const { latitude, longitude } = position.coords;
  const params = new URLSearchParams({
    latitude: latitude.toFixed(4),
    longitude: longitude.toFixed(4),
    current: "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m",
    timezone: "auto",
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!response.ok) throw new Error("Live context is unavailable right now.");
  const weather = await response.json();
  return {
    temperature: Math.round(weather.current.temperature_2m),
    unit: weather.current_units.temperature_2m,
    humidity: weather.current.relative_humidity_2m,
    wind: Math.round(weather.current.wind_speed_10m),
    condition: describeWeather(weather.current.weather_code),
    localTime: new Intl.DateTimeFormat([], { hour: "numeric", minute: "2-digit", timeZone: weather.timezone }).format(new Date()),
  };
}

function getPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Location is not supported in this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, () => reject(new Error("Location permission was not granted.")), { enableHighAccuracy: false, timeout: 10000 });
  });
}

function describeWeather(code) {
  if (code === 0) return "Clear sky";
  if ([1, 2, 3].includes(code)) return "Partly cloudy";
  if ([45, 48].includes(code)) return "Foggy";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rain nearby";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow nearby";
  if ([95, 96, 99].includes(code)) return "Storm risk";
  return "Changing conditions";
}
