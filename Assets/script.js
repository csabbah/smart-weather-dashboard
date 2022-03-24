// FOR EACH CITY THAT IS SEARCHED, ADD IT TO A SEARCH HISTORY OBJECT (LOCAL STORAGE)
// IMPORTANT - DOUBLE CHECK ALL CITY SEARCHES RETURN CORRECT DATA
// IMPORTANT -  UV returns different value than on the openweathermap api?

// The API key to allow for usage of the API
var APIKEY = '67ad538a4c7356a83bfb4f14c6e9b666';

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

// Extracts the Longitude and Latitude of a city that the client searches up THEN execute the MAIN fetch function
// IMPORTANT - Since we execute this API fetch function first, we only need to catch the errors here alone
var extractGeoData = async (searchedCity) => {
  // Execute a try and catch block to catch if there is no network
  try {
    // Update the URL with the searched city and include the API key
    var url = `http://api.openweathermap.org/geo/1.0/direct?q=${searchedCity}&limit=5&appid=${APIKEY}`;
    var res = await fetch(url);
    var location = await res.json();
    // If data doesn't exist, that means that searched up city either doesn't exist or user made a typo
    if (location.length == 0 || location == null || location == undefined) {
      alert('Please type a valid city');
    } else {
      // After Lat and Lon have been extracted, fetch for the MAIN data using those coordinates
      // location[0].name holds the city name which will will be passed down across multiple functions
      fetchWeather(location[0].lat, location[0].lon, location[0].name);
    }
    // If there is not network connection, execute the catch block function
  } catch (error) {
    alert('Failed to connect to API due to network issues');
  }
};

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

// Using Lat and Lon values from extractGeoData(), extract the MAIN weather data
// IMPORTANT - Since we caught the no network and no valid data issues above, we DO NOT need to catch them here
var fetchWeather = async (lat, lon, location) => {
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
  var uvIndex = weatherData.current.uvi;

  // For the weather icon, we extract a specific code from the data and add it to a link
  var extractedIcon = weatherData.current.weather[0].icon;
  var iconUrl = `http://openweathermap.org/img/wn/${extractedIcon}@2x.png`;

  //  Then execute updateEl() to update the DOM elements using the above data
  updateEl(
    currentWeather,
    feelsLike,
    location,
    humidity,
    windSpeed,
    uvIndex,
    iconUrl
  );

  // Execute extractForecast() to update the 5 day forecast section using the 'daily' object
  // The 'daily' object contains the weather data for other days
  var forecastWeek = weatherData.daily;
  extractForecast(forecastWeek);
};

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

// Update DOM elements (textcontent) for the CURRENT DAY weather data
var updateEl = (
  currentWeather,
  feelsLike,
  location,
  humidity,
  windSpeed,
  uvIndex,
  iconUrl
) => {
  // Declare variables to hold all the required HTML elements
  var citynameEl = document.getElementById('city-name');
  var currentWeatherEl = document.getElementById('current-weather');
  var feelslikeEl = document.getElementById('feels-like');
  var humidityEl = document.getElementById('humidity');
  var windspeedEl = document.getElementById('wind');
  var uvIndexEl = document.getElementById('uv-index');
  var weatherIconEl = document.getElementById('weather-icon');

  // Stylize the uv-index element according to its value both the background and text color
  if (uvIndexEl <= 4) {
    uvIndexEl.style.color = 'black';
  }
  if (uvIndex >= 4) {
    uvIndexEl.style.color = 'white';
  }
  if (uvIndex <= 1) {
    uvIndexEl.style.backgroundColor = 'rgb(0, 255, 13)';
  } else if (uvIndex > 1 && uvIndex < 2) {
    uvIndexEl.style.backgroundColor = 'rgb(151, 221, 0)';
  } else if (uvIndex >= 2 && uvIndex <= 3) {
    uvIndexEl.style.backgroundColor = 'rgb(214, 221, 0)';
  } else if (uvIndex >= 3 && uvIndex <= 4) {
    uvIndexEl.style.backgroundColor = 'rgb(221, 173, 0)';
  } else if (uvIndex >= 4 && uvIndex <= 5) {
    uvIndexEl.style.backgroundColor = 'rgb(221, 136, 0)';
  } else if (uvIndex >= 5 && uvIndex <= 6) {
    uvIndexEl.style.backgroundColor = 'rgb(221, 92, 0)';
  } else if (uvIndex >= 6 && uvIndex <= 7) {
    uvIndexEl.style.backgroundColor = 'rgb(221, 0, 0)';
  } else if (uvIndex >= 7 && uvIndex <= 8) {
    uvIndexEl.style.backgroundColor = 'rgb(221, 0, 136)';
  } else if (uvIndex >= 8 && uvIndex <= 9) {
    uvIndexEl.style.backgroundColor = 'rgb(221, 0, 192)';
  } else if (uvIndex >= 9) {
    uvIndexEl.style.backgroundColor = 'rgb(199, 0, 221)';
  }

  // Declare a variable to hold the current date
  var date = moment().format('L'); // "MM/DD/YYYY"

  // Apply the data we extracted as the textContent to the appropriate elements
  citynameEl.textContent = `${location} ${date}`;
  currentWeatherEl.textContent = `${currentWeather}°F`;
  feelslikeEl.textContent = `${feelsLike}°F`;
  windspeedEl.textContent = `${windSpeed}mph`;
  humidityEl.textContent = `${humidity}%`;
  uvIndexEl.textContent = uvIndex;

  // For the weather icon, we set the src equal to a specific url we modified and we assign basic styling
  weatherIconEl.src = iconUrl;
  weatherIconEl.style.height = '50px';
  weatherIconEl.style.width = '50px';
  weatherIconEl.style.display = 'flex';
};

// Update DOM elements (textcontent) for the 5 DAY FORECAST data
var extractForecast = (weekData) => {
  // Loop through the data....
  for (let i = 0; i < weekData.length; i++) {
    // Exclude the first object since we've already used this data for the current weather
    if (i !== 0) {
      var new_date = moment(moment(), 'L').add(i, 'days').format('L');
      // All selectors have the same label but different numeric value so increment by 1 each time
      var weatherEl = document.getElementById(`day${i}-weather`);
      var windEl = document.getElementById(`day${i}-wind`);
      var humidityEl = document.getElementById(`day${i}-humidity`);
      var dateEl = document.getElementById(`forecast-date${i}`);
      var weatherIconEl = document.getElementById(`weather-icon-day${i}`);

      // Then update the textcontent with the appropriate data:
      // For each day include the next date, weather icon, max and min temperatures, wind speed and humidity
      dateEl.textContent = new_date;

      var extractedIcon = weekData[i].weather[0].icon;
      var iconUrl = `http://openweathermap.org/img/wn/${extractedIcon}@2x.png`;
      weatherIconEl.src = iconUrl;
      weatherIconEl.style.display = 'flex';
      weatherIconEl.style.height = '50px';
      weatherIconEl.style.width = '50px';

      weatherEl.textContent = `${weekData[i].temp.max}/${weekData[i].temp.min}°F`;
      windEl.textContent = `${weekData[i].wind_speed}mph`;
      humidityEl.textContent = `${weekData[i].humidity}%`;
    }

    // Since we are only running this loop for a 5 day forecast, break the loop at 5 iterations
    if (i == 5) {
      break;
    }
  }
};

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

// Declare variables to hold the form and input field elements
var inputEl = document.getElementById('enter-city');
var formEl = document.getElementById('main-form');

// Upon form submission....
formEl.addEventListener('submit', (e) => {
  e.preventDefault; // Prevent browser refresh
  if (inputEl.value) {
    extractGeoData(inputEl.value); // Use the value from the input field to execute the main function
  } else {
    alert('Please enter a city');
  }
  // The above value would be the city name that the user picks
  inputEl.value = ''; // Reset value for the input field
});
