// The API key to allow for usage of the API
var APIKEY = '67ad538a4c7356a83bfb4f14c6e9b666';
// Needed to Include "?#" in the webpage link in order for the API to consistently function properly
window.location.href = 'https://csabbah.github.io/smart-weather-dashboard/?#';

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
    // If data doesn't exist, that means that the searched up city either doesn't exist or the user made a typo
    if (location.length == 0 || location == null || location == undefined) {
      alert('Please type a valid city');
    } else {
      // We execute this function here to make sure we ONLY store the valid terms that had data
      checkHistoryBtns(searchedCity);

      // After Lat and Lon have been extracted, fetch for the MAIN data using those coordinates
      // location[0].name holds the city name which will will be passed down across multiple functions
      fetchWeather(location[0].lat, location[0].lon, location[0].name);
    }
    // If there is no network connection, execute the catch block function
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
  // Declare variables to hold all the required HTML
  var citynameEl = document.getElementById('city-name');
  var currentWeatherEl = document.getElementById('current-weather');
  var feelslikeEl = document.getElementById('feels-like');
  var humidityEl = document.getElementById('humidity');
  var windspeedEl = document.getElementById('wind');
  var uvIndexEl = document.getElementById('uv-index');
  var weatherIconEl = document.getElementById('weather-icon');

  // The following elements will show the main data set, initially, they are hidden
  var currentTemp = document.getElementById('current-temp');
  var fiveDayForecastEl = document.getElementById('five-day-forecast');

  currentTemp.style.display = 'flex';
  resetBtn.style.display = 'unset';
  fiveDayForecastEl.style.display = 'unset';

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
  var date = moment().format('(L)'); // "MM/DD/YYYY"

  // Apply the data we extracted as the textContent to the appropriate elements
  citynameEl.textContent = `${location} ${date}`;
  currentWeatherEl.textContent = `${currentWeather}°F`;
  feelslikeEl.textContent = `${feelsLike}°F`;
  windspeedEl.textContent = `${windSpeed}mph`;
  humidityEl.textContent = `${humidity}%`;
  uvIndexEl.textContent = uvIndex;

  // For the weather icon, we set the src equal to the specific url we modified and we assign the styling
  weatherIconEl.src = iconUrl;
  weatherIconEl.style.height = '40px';
  weatherIconEl.style.width = '40px';
  weatherIconEl.style.display = 'flex';
};

// Update DOM elements (textcontent) for the 5 DAY FORECAST data
var extractForecast = (weekData) => {
  // Loop through the data....
  for (let i = 0; i < weekData.length; i++) {
    // Exclude the first object since we've already used this data for the current weather
    if (i !== 0) {
      var new_date = moment(moment(), 'L').add(i, 'days').format('L'); // Increment the date by 1 day each time
      // All selectors have the same label but different numeric value so increment by 1 each time
      var weatherEl = document.getElementById(`day${i}-weather`);
      var windEl = document.getElementById(`day${i}-wind`);
      var humidityEl = document.getElementById(`day${i}-humidity`);
      var dateEl = document.getElementById(`forecast-date${i}`);
      var weatherIconEl = document.getElementById(`weather-icon-day${i}`);

      // For each day include the date
      dateEl.textContent = new_date;

      // Add the weather icon by...
      var extractedIcon = weekData[i].weather[0].icon; // Extracting the weather icon code
      var iconUrl = `http://openweathermap.org/img/wn/${extractedIcon}@2x.png`; // Adding the code in the URL
      weatherIconEl.src = iconUrl; // Applying the URL to the elements src
      weatherIconEl.style.display = 'flex'; // And then apply the necessary styles
      weatherIconEl.style.height = '40px';
      weatherIconEl.style.width = '40px';

      // Finally, add the weather, wind and humidity to the appropriate elements
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
// Upon clicking the reset button, the shortest function to clear everything would be to reload the application
var resetData = () => {
  location.reload();
};
var resetBtn = document.getElementById('reset');
resetBtn.addEventListener('click', resetData);

// Upon clicking the clear history button, clear the storage and reload the application
var clearHistory = () => {
  localStorage.clear();
  location.reload();
};

var clearHistoryBtn = document.getElementById('clear-history');
clearHistoryBtn.addEventListener('click', clearHistory);

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

// All the below functions deals with generating the history buttons and...
// storing/extracting the data to/from local storage
var historyContainer = document.getElementById('history-searches');

// Check to see if an object (for the search terms) is saved locally
var localObject = localStorage.getItem('searchTerms');
// If the local storage doesn't exist....
if (localObject == null) {
  // For this session declare an empty object
  var searchHistory = [];
  // Otherwise if local storage does exist...
} else {
  // Parse the local data and update the above empty object with the data from local
  localObject = JSON.parse(localObject);
  searchHistory = localObject;
  searchHistory.forEach((item) => {
    // The functions here are the same as the ones in createHistory() below
    // This will generate the history button elements upon application load
    var btn = document.createElement('button');
    btn.classList.add('search-btn');
    btn.textContent = item.searchTerm;
    btn.type = 'button';
    historyContainer.appendChild(btn);
  });
  // Reveal the clear history button
  clearHistoryBtn.style.display = 'unset';
}

// This function will check the buttons and ONLY generate the unique history buttons
var checkHistoryBtns = (label) => {
  var uniqueButton = true;
  // Make the first letter of the search term uppercase then...
  // add it with the original term but exclude the first letter
  var finalLabel = label[0].toUpperCase() + label.substring(1);

  // If the object length is 0, generate the button normally
  if (searchHistory.length == 0) {
    clearHistoryBtn.style.display = 'unset';

    // Generate the button elements
    createButtons(finalLabel);
    // Pushes the search term to an object then stores that object to local storage
    storeLocally(searchHistory, finalLabel);
    // Set to false so we don't double generate
    uniqueButton = false;
    // Execute this here to make sure it is working at this state as well
    historyBtnEvent();
  } else {
    // Go through ALL data, if the current label matches with a label in our object,
    // set uniqueButton to false so that we don't generate the button
    searchHistory.forEach((item) => {
      if (item.searchTerm == finalLabel) {
        uniqueButton = false;
      }
    });
  }

  // Only generate the button if it is unique and not already existing in the object
  if (uniqueButton) {
    createButtons(finalLabel);
    // Pushes the search term to an object then stores that object to local storage
    storeLocally(searchHistory, finalLabel);
    // Execute this here to make sure it is working at this state as well
    historyBtnEvent();
  }
};

// Generate the history search buttons upon hitting search
var createButtons = (finalLabel) => {
  // Create a button element
  var btn = document.createElement('button');
  // Add a 'search-btn' class to each button
  btn.classList.add('search-btn');
  // Then update the textcontent with the final label
  btn.textContent = finalLabel;
  // Add a type of 'button' so that these buttons don't submit the form
  btn.type = 'button';
  // Append the button(s) to the container
  historyContainer.appendChild(btn);
};

// Stores object to local storage
var storeLocally = (object, label) => {
  // Push the label and a unique ID to the object
  var id = Math.floor(Math.random() * 10000);
  searchHistory.push({ searchTerm: label, id });

  // Then store the full object locally
  localStorage.setItem('searchTerms', JSON.stringify(object));
};

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

// This executes the event listener for all active history buttons
const historyBtnEvent = () => {
  // Declare a variable to hold the active history buttons
  var historyBtns = document.getElementById('history-searches');

  // Iterate over each child and add a 'click' event listener...
  Array.prototype.forEach.call(historyBtns.children, (child) => {
    child.addEventListener('click', () => {
      // Whatever button the user clicks on....
      // Extract the innerText of each button and execute the main function according to that value
      extractGeoData(child.innerText.toLowerCase());
    });
  });
};
// Execute globally so it works right away
historyBtnEvent();

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

// In this function, i convert ALL appropriate metrics using specific equations and also change the label of the unit
var switchMetric = () => {
  var currentWeatherEl = document.getElementById('current-weather');
  var feelslikeEl = document.getElementById('feels-like');
  var windspeedEl = document.getElementById('wind');

  // Convert from MPH to KMG and vice versa
  if (windspeedEl.textContent.includes('mph')) {
    // Take the CURRENT value only
    var activeWind = windspeedEl.innerText.split('mph')[0];
    // Multiply it by 1.6
    var newWind = activeWind * 1.609344;
    // And update the textcontent with the new value
    windspeedEl.textContent = `${newWind.toFixed(2)}kmh`;
  } else {
    // Same function as above but opposite
    var activeWind = windspeedEl.innerText.split('kmh')[0];
    var newWind = activeWind / 1.609344;
    windspeedEl.textContent = `${newWind.toFixed(2)}mph`;
  }

  // Convert from F to C and vice versa
  if (
    // Check the current temperature
    currentWeatherEl.textContent.includes('°F') &&
    feelslikeEl.textContent.includes('°F')
  ) {
    // Calculate accordingly
    var feelslikeCurrent = feelslikeEl.innerText.split('°F')[0];
    var newFeelsLike = ((feelslikeCurrent - 32) * 5) / 9;
    feelslikeEl.textContent = `${newFeelsLike.toFixed(2)}°C`;

    var activeCurrentWeather = currentWeatherEl.innerText.split('°F')[0];
    var newCurrentWeather = ((activeCurrentWeather - 32) * 5) / 9;
    currentWeatherEl.textContent = `${newCurrentWeather.toFixed(2)}°C`;
  } else {
    var feelslikeCurrent = feelslikeEl.innerText.split('°C')[0];
    var newFeelsLike = (feelslikeCurrent * 9) / 5 + 32;
    feelslikeEl.textContent = `${newFeelsLike.toFixed(2)}°F`;

    var activeCurrentWeather = currentWeatherEl.innerText.split('°C')[0];
    var newCurrentWeather = (activeCurrentWeather * 9) / 5 + 32;
    currentWeatherEl.textContent = `${newCurrentWeather.toFixed(2)}°F`;
  }

  // Same idea applies here as the above method but it is for a node list
  var forecastWeatherEl = document.querySelectorAll('.forecast-temp');
  for (let i = 0; i < forecastWeatherEl.length; i++) {
    if (forecastWeatherEl[i].textContent.includes('°F')) {
      var currentForecastTemp = forecastWeatherEl[i].innerText.split('°F')[0];
      var currentTemp1 = currentForecastTemp.split('/')[0];
      var currentTemp2 = currentForecastTemp.split('/')[1];
      var newTemp1 = ((currentTemp1 - 32) * 5) / 9;
      var newTemp2 = ((currentTemp2 - 32) * 5) / 9;
      forecastWeatherEl[i].textContent = `${newTemp1.toFixed(
        2
      )}/${newTemp2.toFixed(2)}°C`;
    } else {
      var currentForecastTemp = forecastWeatherEl[i].innerText.split('°C')[0];
      var currentTemp1 = currentForecastTemp.split('/')[0];
      var currentTemp2 = currentForecastTemp.split('/')[1];
      var newTemp1 = (currentTemp1 * 9) / 5 + 32;
      var newTemp2 = (currentTemp2 * 9) / 5 + 32;
      forecastWeatherEl[i].textContent = `${newTemp1.toFixed(
        2
      )}/${newTemp2.toFixed(2)}°F`;
    }
  }

  var forecastWindEl = document.querySelectorAll('.forecast-wind');
  for (let i = 0; i < forecastWindEl.length; i++) {
    if (forecastWindEl[i].textContent.includes('mph')) {
      var currentForecastWind = forecastWindEl[i].innerText.split('mph')[0];
      // Multiply it by 1.6
      var newForecastWind = currentForecastWind * 1.609344;
      // And update the textcontent with the new value
      forecastWindEl[i].textContent = `${newForecastWind.toFixed(2)}kmh`;
    } else {
      var currentForecastWind = forecastWindEl[i].innerText.split('kmh')[0];

      var newForecastWind = currentForecastWind / 1.609344;
      forecastWindEl[i].textContent = `${newForecastWind.toFixed(2)}mph`;
    }
  }
};

var metricBtn = document.getElementById('switch-metric');
metricBtn.addEventListener('click', switchMetric);

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

// Declare variables to hold the form and input field elements
var inputEl = document.getElementById('enter-city');
var formEl = document.getElementById('main-form');

// Upon form submission....
formEl.addEventListener('submit', (e) => {
  e.preventDefault; // Prevent browser refresh
  if (inputEl.value) {
    // If the input value is NOT empty....
    extractGeoData(inputEl.value.toLowerCase()); // Use the value from the input field to execute the main function
  } else {
    // Else if the value is empty, alert the user
    alert('Please enter a city');
  }
  // The above value would be the city name that the user picks
  inputEl.value = ''; // Reset value for the input field
});
