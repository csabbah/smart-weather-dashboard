var APIKEY = '67ad538a4c7356a83bfb4f14c6e9b666';

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

// Return Lon and Lat of a given city
var extractGeoData = async (location) => {
  var url = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${APIKEY}`;
  var res = await fetch(url);
  var location = await res.json();

  var lon = location[0].lon;
  var lat = location[0].lat;
  fetchWeather(lat, lon, location[0].name);
};

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

var fetchWeather = async (lat, lon, location) => {
  var url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${APIKEY}&units=imperial`;
  var res = await fetch(url);
  var weatherData = await res.json();
  console.log(weatherData);
  extractData(weatherData, location);
};

var extractData = (weatherData, location) => {
  var feelsLike = weatherData.current.feels_like;
  var currentWeather = weatherData.current.temp;
  var humidity = weatherData.current.humidity;
  var windSpeed = weatherData.current.wind_speed;

  updateEl(currentWeather, feelsLike, location, humidity, windSpeed);
};

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

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
  windspeedEl.textContent = `${windSpeed} KMH`;
};
// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

var inputEl = document.getElementById('enter-city');
var formEl = document.getElementById('main-form');

formEl.addEventListener('submit', (e) => {
  e.preventDefault;
  extractGeoData(inputEl.value);
  inputEl.value = ''; //
});
