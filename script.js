const currentDay = new Date().getDate();
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const date = currentMonth + "/" + currentDay + "/" + currentYear;
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const day = daysOfWeek[new Date().getDay()];
console.log(day + " " + date);
const key = '01ef8bab4d434e1fa82225911232205'; // key to Yemaj's API on weatherapi.com
const current_apiUrl = 'https://api.weatherapi.com/v1/current.json'; // URL to weatherapi.com for current json
const future_apiUrl = 'https://api.weatherapi.com/v1/forecast.json'; // URL to weatherapi.com for future json (changed)


//commetn
var city = "Fairfax";

async function fetchWeatherAPI_current(city) {
  const url = `${current_apiUrl}?key=${key}&q=${city}`;
  try {
    const response = await fetch(url);
    console.log(response);

    const data = await response.json();

    return data;
  } catch (error) {
    console.log("Error fetching current weather data: ", error);
    throw error;
  }
}

async function fetchWeatherAPI_future(city, date) { // Added 'date' parameter
  const url = `${future_apiUrl}?key=${key}&q=${city}&dt=${date}`; // Included 'date' in the URL
  try {
    const response = await fetch(url);
    console.log(response);

    const data = await response.json();

    return data;
  } catch (error) {
    console.log("Error fetching current weather data: ", error);
    throw error;
  }
}

async function fetchCurrentWeather(city) {
  const data = await fetchWeatherAPI_current(city);
  const current_Temp = Math.floor(data.current.temp_f);
  const current_Condition = data.current.condition.text;
  return { current_Temp, current_Condition };
}

async function fetchFullWeather(city, date) { // Added 'date' parameter
  const data = await fetchWeatherAPI_future(city, date); // Passed 'date' to the function
  console.log("fetchfullweather api worked");
  const min_Temp = Math.floor(data.forecast?.forecastday[0]?.day?.mintemp_f);
  const max_Temp = Math.floor(data.forecast?.forecastday[0]?.day?.maxtemp_f);
  console.log(max_Temp);
  const icon = data.forecast?.forecastday[0]?.day?.condition.icon;
  console.log(icon);
  const condition = data.forecast?.forecastday[0]?.day?.condition.text;
  console.log(condition);
  const average = data.forecast?.forecastday[0]?.day?.avgtemp_f;
  console.log(average);
  return { min_Temp, max_Temp, icon, condition, average };
}

async function updateWeather(city) {
  //current
  const { current_Temp, current_Condition } = await fetchCurrentWeather(city);

  //city
  const location = document.getElementById("location_Text");
  location.innerHTML = city;

  //temperature text
  const temp = document.getElementById("temp_Text");
  temp.innerHTML = current_Temp;

  //condition text
  const weather = document.getElementById("weather_Text");
  weather.innerHTML = current_Condition;

  //-------------------

  //current and future
  const { min_Temp, max_Temp, icon, condition, average } = await fetchFullWeather(city, date); // Passed 'date' to the function

  //high temp
  const low_Temp = document.getElementById("w-low_Text");
  low_Temp.innerHTML = min_Temp;

  //high temp
  const high_Temp = document.getElementById("w-high_Text");
  high_Temp.innerHTML = max_Temp;
}

updateWeather(city);
