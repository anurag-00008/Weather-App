import { useState } from "react";

const Weather = () => {
  const [city, setCity] = useState("");          // input field
  const [weather, setWeather] = useState(null);  // weather data
  const [error, setError] = useState("");        // error message
  const [loading, setLoading] = useState(false); // loading state

  const API_KEY = "abc123xyz987654"; // <-- Replace with your OpenWeatherMap key

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      setWeather(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city.trim()
        )}&appid=${API_KEY}&units=metric`
      );

      const data = await response.json();

      // Handle errors from API
      if (data.cod === "404") {
        throw new Error("City not found. Please check spelling.");
      } else if (data.cod !== 200) {
        throw new Error(data.message || "Failed to fetch weather");
      }

      // Set weather data
      setWeather({
        city: data.name,
        country: data.sys.country,
        temp: data.main.temp,
        condition: data.weather[0].main,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        wind: data.wind.speed,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      });

    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-container">
      <h1>🌦️ Weather App</h1>

      {/* Input */}
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && fetchWeather()} // press Enter
      />

      {/* Button */}
      <button onClick={fetchWeather}>Search</button>

      {/* Loading */}
      {loading && <p>Loading...</p>}

      {/* Error */}
      {error && <p className="error">{error}</p>}

      {/* Weather Info */}
      {weather && (
        <div className="weather-info">
          <h2>
            {weather.city}, {weather.country}
          </h2>
          <img src={weather.icon} alt={weather.condition} />
          <p>🌡 Temperature: {weather.temp}°C</p>
          <p>☁ Condition: {weather.condition}</p>
          <p>📖 Description: {weather.description}</p>
          <p>💨 Wind: {weather.wind} m/s</p>
          <p>💧 Humidity: {weather.humidity}%</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
