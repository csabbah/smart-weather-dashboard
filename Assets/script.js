// INCLUDE DATE - WORK OFF CURRENT DATE THEN INCREMENT THE DATE FOR THE 5 DAY FORECAST
// CATCH ALL THE ERRORS I.E. FAILED TO FETCH DATA, NETWORK ISSUES AND ETC...
// ADD A CONDITION TO REJECT EMPTY INPUT VALUES
// FOR EACH CITY THAT IS SEARCHED, ADD IT TO A SEARCH HISTORY OBJECT (LOCAL STORAGE)
// DOUBLE CHECK ALL CITY SEARCHES RETURN CORRECT DATA

// The API key to allow for usage of the API
var APIKEY = '67ad538a4c7356a83bfb4f14c6e9b666';

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

// Extracts the Longitude and Latitude of a city that the client searches up
var extractGeoData = async (searchedCity) => {
  // Update the URL with the searched city and include the API key
  var url = `http://api.openweathermap.org/geo/1.0/direct?q=${searchedCity}&limit=5&appid=${APIKEY}`;
  var res = await fetch(url);
  var location = await res.json();

  // After Lat and Lon have been extracted, fetch for the MAIN data using those coordinates
  // location[0].name holds the city name which will will be passed down across multiple functions
  fetchWeather(location[0].lat, location[0].lon, location[0].name);
};

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

// Extracts the MAIN data set for the weather data
var fetchWeather = async (lat, lon, location) => {
  // Using the Lat and Lon values from extractGeoData(), return the main source of data
  var url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${APIKEY}&units=imperial`;
  var res = await fetch(url);
  var weatherData = await res.json();
  extractedData(weatherData, location);
};

// Referring to the main data set (weatherData), declare variables to hold required values
var extractedData = (weatherData, location) => {
  var feelsLike = weatherData.current.feels_like;
  var currentWeather = weatherData.current.temp;
  var humidity = weatherData.current.humidity;
  var windSpeed = weatherData.current.wind_speed;
  //  Then execute updateEl() to update the DOM elements using the above data
  updateEl(currentWeather, feelsLike, location, humidity, windSpeed);

  // Execute extractForecast() to update the 5 day forecast section using the 'daily' object
  // The 'daily' object contains the weather data for other days
  var forecastWeek = weatherData.daily;
  extractForecast(forecastWeek);
};
// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

// Updates DOM elements (textcontent) with the 5 DAY FORECAST data
var extractForecast = (weekData) => {
  // Loop through the data....
  for (let i = 0; i < weekData.length; i++) {
    // Exclude the first object since we've already used this data for the current weather
    if (i !== 0) {
      // All selectors have the same label but different numeric value so increment by 1 each time
      var weatherEl = document.getElementById(`day${i}-weather`);
      var windEl = document.getElementById(`day${i}-wind`);
      var humidityEl = document.getElementById(`day${i}-humidity`);
      // Then update the textcontent with the appropriate data
      // For each day include the max and min temperatures, wind speed and humidity
      weatherEl.textContent = `${weekData[i].temp.max}/${weekData[i].temp.min}°F`;
      windEl.textContent = `${weekData[i].wind_speed}mph`;
      humidityEl.textContent = `${weekData[i].humidity}%`;
    }

    // Since we are only running this for loop for a 5 day forecast, break the loop at 5 iterations
    if (i == 5) {
      break;
    }
  }
};

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

// Updates DOM elements (textcontent) with the CURRENT weather data
// Declare variables to hold all the required HTML elements
var citynameEl = document.getElementById('city-name');
var currentWeatherEl = document.getElementById('current-weather');
var feelslikeEl = document.getElementById('feels-like');
var humidityEl = document.getElementById('humidity');
var windspeedEl = document.getElementById('wind');

// Referring to the parameters we passed in extractData()...
var updateEl = (currentWeather, feelsLike, location, humidity, windSpeed) => {
  // Update the textContent to the appropriate HTML elements
  currentWeatherEl.textContent = `${currentWeather}°F`;
  feelslikeEl.textContent = `${feelsLike}°F`;
  citynameEl.textContent = location;
  humidityEl.textContent = `${humidity}%`;
  windspeedEl.textContent = `${windSpeed}mph`;
};
// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

// Declare variables to hold the form and input field elements
var inputEl = document.getElementById('enter-city');
var formEl = document.getElementById('main-form');

// Upon form submission....
formEl.addEventListener('submit', (e) => {
  e.preventDefault; // Prevent browser refresh
  extractGeoData(inputEl.value); // Use the value from the input field to execute the main function
  // The above value would be the city name that the user picks
  inputEl.value = ''; // Reset value for the input field
});
