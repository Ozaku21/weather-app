import { useRef, useState } from "react";
import "./Weather.css";
import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";
import humidity_icon from "../assets/humidity.png";

function Weather() {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);
  const [isInputEmpty, setIsInputEmpty] = useState(false);
  const [cityNotFound, setCityNotFound] = useState(false);

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const search = async (city) => {
    if (!city.trim()) {
      setIsInputEmpty(true);
      setCityNotFound(false);
      return;
    }
    setIsInputEmpty(false);

    try {
      const apiKey = import.meta.env.VITE_APP_ID;
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

      const response = await fetch(apiUrl);
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        const icon = allIcons[data.weather[0].icon] || clear_icon;
        setWeatherData({
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          temp: Math.floor(data.main.temp),
          location: data.name,
          icon: icon,
        });
        setCityNotFound(false);
      } else {
        setWeatherData(null);
        setCityNotFound(true);
        console.error("City not found", data.message);
      }
    } catch (error) {
      setWeatherData(null);
      setCityNotFound(false);
      console.error("Error");
    }
  };

  return (
    <div className="weather">
      <div className="search-bar">
        <input
          className={isInputEmpty ? "city-input-empty" : ""}
          ref={inputRef}
          type="text"
          placeholder={isInputEmpty ? "Please Enter The City" : "Search"}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              search(inputRef.current.value);
            }
          }}
        />
        <img
          src={search_icon}
          alt="Search icon"
          onClick={() => search(inputRef.current.value)}
        />
      </div>
      {cityNotFound && (
        <p className="error-message">City not found or does not exist</p>
      )}
      {weatherData ? (
        <>
          <img
            src={weatherData.icon}
            alt="Weather img"
            className="weather-icon"
          />
          <p className="temperature">{weatherData.temp}°C</p>
          <p className="location">{weatherData.location}</p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="" />
              <div>
                <p>{weatherData.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="" />
              <div>
                <p>{weatherData.windSpeed} Km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Weather;
