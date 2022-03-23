var APIKEY = '67ad538a4c7356a83bfb4f14c6e9b666';
var filters = {
  location: { lat: '41.8755616', long: '-87.6244212' },
};

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

// Return Lon and Lat of a given city
var extractGeoData = async () => {
  var url = `http://api.openweathermap.org/geo/1.0/direct?q=new york&limit=5&appid=${APIKEY}`;
  var res = await fetch(url);
  var location = await res.json();

  var lon = location[0].lon;
  var lat = location[0].lat;
  fetchWeather(lat, lon);
};

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

var fetchWeather = async (lat, lon) => {
  var url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${APIKEY}&units=imperial`;
  var res = await fetch(url);
  var weatherData = await res.json();
  extractData(weatherData);
};

var extractData = (data) => {
  var feelsLike = data.current.feels_like;
  var currentWeather = data.current.temp;
  var timezone = data.timezone;

  console.log(
    `Feels like: ${feelsLike}°F \nCurrent Weather: ${currentWeather}°F\nTimezone: ${timezone}`
  );
};

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

extractGeoData();
