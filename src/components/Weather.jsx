import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import humidity_icon from '../assets/humidity.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);

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
    if (city === "") {
      alert("Enter City Name");
      return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      const icon = allIcons[data.weather[0].icon] || clear_icon;
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: data.main.temp,
        location: data.name,
        icon: icon,
        weather: data.weather[0].main
      });
    } catch (error) {
      setWeatherData(null);
      console.error("Error in fetching weather data.");
    }
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };

  const convertTemperature = (temp) => {
    return isCelsius ? temp : (temp * 9 / 5) + 32;
  };

  const setBackgroundClass = (weatherCondition) => {
    switch (weatherCondition.toLowerCase()) {
      case 'clear':
        return 'sunny';
      case 'rain':
      case 'drizzle':
      case 'thunderstorm':
        return 'rainy';
      case 'clouds':
        return 'cloudy';
      case 'snow':
        return 'snowy';
      default:
        return 'default';
    }
  };

  useEffect(() => {
    search("Toronto");
  }, []);

  useEffect(() => {
    if (weatherData) {
      document.body.className = setBackgroundClass(weatherData.weather);
    }
  }, [weatherData]);

  return (
    <div className='weather'>
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder='Search' />
        <img src={search_icon} alt="" onClick={() => search(inputRef.current.value)} />
      </div>
      {weatherData ? (
        <>
          <img src={weatherData.icon} alt="" className='weather-icon' />
          <h3 className="temperature">
            {convertTemperature(weatherData.temperature).toFixed(1)}° {isCelsius ? 'C' : 'F'}
          </h3>
          <p className='location'>{weatherData.location}</p>
          <div className="weather-data">
            <div className='col'>
              <img src={humidity_icon} alt="" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className='col'>
              <img src={wind_icon} alt="" />
              <div>
                <p>{weatherData.windSpeed} km/hr</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
          <button onClick={toggleTemperatureUnit}>
            Switch to {isCelsius ? 'Fahrenheit' : 'Celsius'}
          </button>
        </>
      ) : null}
    </div>
  );
};

export default Weather;


