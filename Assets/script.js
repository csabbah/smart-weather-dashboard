// INCLUDE DATE - WORK OFF CURRENT DATE THEN INCREMENT THE DATE FOR THE 5 DAY FORECAST
// -------------- MAYBE THE API CONTAINS THE DATES?
// CATCH ALL THE ERRORS I.E. FAILED TO FETCH DATA, NETWORK ISSUES AND ETC...

var APIKEY = '67ad538a4c7356a83bfb4f14c6e9b666';

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

// Extracts the Longitude and Latitude of a city that the client searches up
// After Lon and Lat have been extracted, fetch for the MAIN data using those coordinates
var extractGeoData = async (location) => {
  var url = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${APIKEY}`;
  var res = await fetch(url);
  var location = await res.json();

  var lon = location[0].lon;
  var lat = location[0].lat;
  fetchWeather(lat, lon, location[0].name);
};

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

// Main extraction for the weather data
var fetchWeather = async (lat, lon, location) => {
  var url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${APIKEY}&units=imperial`;
  var res = await fetch(url);
  var weatherData = await res.json();
  extractData(weatherData, location);
};

var extractData = (weatherData, location) => {
  var feelsLike = weatherData.current.feels_like;
  var currentWeather = weatherData.current.temp;
  var humidity = weatherData.current.humidity;
  var windSpeed = weatherData.current.wind_speed;

  var forecastWeek = weatherData.daily;
  extractForecast(forecastWeek);

  updateEl(currentWeather, feelsLike, location, humidity, windSpeed);
};
// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

// Updates DOM elements (textcontent) with the 5 DAY FORECAST data
var extractForecast = (weekData) => {
  for (let i = 0; i < weekData.length; i++) {
    // Exclude the first object since that is the current weather data we have already used
    if (i !== 0) {
      var forecastTemp = `${weekData[i].temp.max}/${weekData[i].temp.min}°F`;
      var forecastWind = weekData[i].wind_speed;
      var forecastHumidity = `${weekData[i].humidity}%`;
      // Include index ('i') in getElementById as all ID have different numeric values
      var weatherEl = document.getElementById(`day${i}-weather`);
      var windEl = document.getElementById(`day${i}-wind`);
      var humidityEl = document.getElementById(`day${i}-humidity`);
      weatherEl.textContent = forecastTemp;
      windEl.textContent = forecastWind;
      humidityEl.textContent = forecastHumidity;
    }

    // Since we are only running this for loop for a 5 day forecast, break the loop
    if (i == 5) {
      break;
    }
  }
};

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

// Update DOM elements (textcontent) with the CURRENT weather data
var citynameEl = document.getElementById('city-name');
var currentWeatherEl = document.getElementById('current-weather');
var feelslikeEl = document.getElementById('feels-like');
var humidityEl = document.getElementById('humidity');
var windspeedEl = document.getElementById('wind');

var updateEl = (currentWeather, feelsLike, location, humidity, windSpeed) => {
  currentWeatherEl.textContent = `${currentWeather}°F`;
  feelslikeEl.textContent = `${feelsLike}°F`;
  citynameEl.textContent = location;
  humidityEl.textContent = `${humidity}%`;
  windspeedEl.textContent = `${windSpeed}mph`;
};
// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

var inputEl = document.getElementById('enter-city');
var formEl = document.getElementById('main-form');

formEl.addEventListener('submit', (e) => {
  e.preventDefault;
  extractGeoData(inputEl.value);
  inputEl.value = ''; //
});
