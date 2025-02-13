import React, { useEffect, useState } from "react";
import Search from "./Search";

function Weather() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);

  async function fetchWeatherData(params) {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${params}&appid=${process.env.REACT_APP_API_KEY}`
      );
      const data = await response.json();

      if (data.cod === 200) {
        setWeatherData(data);
      } else {
        setWeatherData(null);
        console.error("Error fetching data:", data.message);
      }
    } catch (e) {
      console.error("Fetch error:", e);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    fetchWeatherData(search);
  }

  function getCurrentDate() {
    return new Date().toLocaleDateString("en-uk", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  useEffect(() => {
    fetchWeatherData("annecy");
  }, []);

  return (
    <div>
      <Search
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
      />
      {loading ? (
        <div>Loading ...</div>
      ) : weatherData ? (
        <div>
          <div className="city-name">
          <div className="img-container">
            <img className="flag"
              src={`https://flagsapi.com/${weatherData.sys?.country}/flat/48.png`}
            />
            </div>
            <h2>
              {weatherData.name}, <span>{weatherData.sys?.country}</span>
            </h2>
          </div>

          <div className="date">
            <span>{getCurrentDate()}</span>
          </div>

          <div className="temp">{Math.round(weatherData?.main?.temp)}°</div>
          <div>
              <p className="description">
                {weatherData && weatherData.weather[0]
                  ? weatherData?.weather[0].description
                  : ""}
              </p>
            </div>

          <div className="weather-info">
            <div>
              <p className="wind">{Math.round(weatherData?.wind?.speed)} m/s</p>
              <p>Wind Speed</p>
            </div>
            <div>
              <p className="humidty">{weatherData?.main?.humidity}%</p>
              <p>Humidty</p>
            </div>
          </div>
        </div>
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
}

export default Weather;
