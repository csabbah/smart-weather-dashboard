var filters = {
  apiKey: '67ad538a4c7356a83bfb4f14c6e9b666',
  location: { lat: '43.6532', long: '-79.3832' },
};

var fetchWeather = async () => {
  var url = `https://api.openweathermap.org/data/2.5/onecall?lat=${filters.location.lat}&lon=${filters.location.long}&exclude=hourly,minutely&appid=${filters.apiKey}&units=imperial`;
  var res = await fetch(url);
  var weatherData = await res.json();

  console.log(weatherData);
  extractData(weatherData);
};

var extractData = (data) => {
  var feelsLike = data.current.feels_like;
  var currentWeather = data.current.temp;
  var timezone = data.timezone;

  console.log(
    `Feels like: ${feelsLike} \nCurrent Weather: ${currentWeather}\nTimezone: ${timezone}`
  );
};

fetchWeather();
