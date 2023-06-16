
//static dates
const currentDay = new Date().getDate();
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const date = currentMonth + "/" + currentDay + "/" + currentYear;

// Tomorrow's date
const tomorrow_Date = new Date();
tomorrow_Date.setDate(tomorrow_Date.getDate() + 1);
const tomorrow_Day = tomorrow_Date.getDate();
const tomorrow_Year = tomorrow_Date.getFullYear();
const tomorrow_Month = tomorrow_Date.getMonth() + 1;
const tomorrow_FormattedDate = tomorrow_Month + "/" + tomorrow_Day + "/" + tomorrow_Year;

// Day after tomorrow's date
const overtomorrow_Date = new Date();
overtomorrow_Date.setDate(overtomorrow_Date.getDate() + 2);
const overtomorrow_Day = overtomorrow_Date.getDate();
const overtomorrow_Year = overtomorrow_Date.getFullYear();
const overtomorrow_Month = overtomorrow_Date.getMonth() + 1;
const overtomorrow_FormattedDate = overtomorrow_Month + "/" + overtomorrow_Day + "/" + overtomorrow_Year;




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
    displayError("ERROR: "+error);
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
    displayError("ERROR: "+error);
    throw error;
  }
}

async function fetchCurrentWeather(city) {
  const data = await fetchWeatherAPI_current(city);
  const current_Temp = Math.floor(data.current.temp_f);
  const current_Condition = data.current.condition.text;
  const locationcity = data.location.name;
  console.log(data.location.name);
  return { current_Temp, current_Condition, locationcity};
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

async function fetchHourlyForecast(city, date) {
  try {
    const data = await fetchWeatherAPI_future(city, date);
    console.log("Acquired API");

    const hourlyForecast = data?.forecast?.forecastday?.[0]?.hour || [];
    const hourData = hourlyForecast.map((hour) => ({
      time: (hour?.time || "").slice(11),
      temp: hour?.temp_f,
      condition: hour?.condition?.text,
      icon: hour?.condition?.icon,
    }));

    return hourData;
  } catch (error) {
    console.error("Error fetching hourly forecast:", error);
    displayError("ERROR: "+error);
    // Throw an error or return a meaningful value to handle the failure
    throw error;
  }
}
//hourData[2]['temp'];
async function createHourlyForecast(city, date){
  if (document.getElementsByClassName("hours")) {
    const hoursElements = document.getElementsByClassName("hours");
    while (hoursElements.length > 0) {
      hoursElements[0].parentNode.removeChild(hoursElements[0]);
    }
  }
  const hourData = await fetchHourlyForecast(city,date);
  const hourDataLength = hourData.length;

  const hoursDiv = document.createElement('div');
  hoursDiv.className = 'hours';

  for(let i = 0; i < hourDataLength; i++){
    const timeSectionsDiv = document.createElement('div');
    timeSectionsDiv.className = 'time-section';
  
    const timeDiv = document.createElement('div');
    timeDiv.className = 'time';
    timeDiv.textContent = hourData[i]['time'];

    const iconDiv = document.createElement('div');
    iconDiv.className = 't-icon';
    var image = document.createElement('img')
    image.src = hourData[i]['icon'];
    iconDiv.appendChild(image);
    //iconDiv.textContent = hourData[i]['icon'];
  
    const timeTempDiv = document.createElement('div');
    timeTempDiv.className = 't-temp';
    timeTempDiv.textContent = Math.floor(hourData[i]['temp'])+'°';;
  
    timeSectionsDiv.appendChild(timeDiv);
    timeSectionsDiv.appendChild(iconDiv);
    timeSectionsDiv.appendChild(timeTempDiv);
    hoursDiv.appendChild(timeSectionsDiv);
  }
  const dayForecastElement = document.getElementById('dayForecast');
  dayForecastElement.appendChild(hoursDiv);
}



async function updateWeather(city) {
  createHourlyForecast(city, date)
  //current
  const { current_Temp, current_Condition, locationcity } = await fetchCurrentWeather(city);

  //city
  const location = document.getElementById("location_Text");
  location.innerHTML = locationcity;

  //temperature text
  const temp = document.getElementById("temp_Text");
  temp.innerHTML = current_Temp+'°';

  //condition text
  const weather = document.getElementById("weather_Text");
  weather.innerHTML = current_Condition;

  //-------------------

  //current and future
  var { min_Temp, max_Temp, icon, condition, average } = await fetchFullWeather(city, date); // Passed 'date' to the function

  //low temp
  const low_Temp = document.getElementById("w-low_Text");
  low_Temp.innerHTML = min_Temp+'°';

  const low_Temp_f = document.getElementById("today_LowTemp");
  low_Temp_f.innerHTML = min_Temp+'°';

  //high temp
  const high_Temp = document.getElementById("w-high_Text");
  high_Temp.innerHTML = max_Temp+'°';

  const high_Temp_f = document.getElementById("today_HighTemp");
  high_Temp_f.innerHTML = max_Temp+'°';

  //icon
  
  var iconDiv = document.getElementById("today_Icon");
  var image = document.createElement('img');
  image.src = icon;
  
  var existingImage = iconDiv.querySelector('img');
  if (existingImage) {
    iconDiv.replaceChild(image, existingImage);
  } else {
    iconDiv.appendChild(image);
  }
  

  


  //futuredays forcast

  // Tomorrow's weather
  const { min_Temp: tom_min_Temp, max_Temp: tom_max_Temp, icon: tom_icon, condition: tom_condition, average: tom_average } = await fetchFullWeather(city, tomorrow_FormattedDate);

  //low temp
  const tom_low_temp_text = document.getElementById("tomorrow_LowTemp");
  tom_low_temp_text.innerHTML = tom_min_Temp+'°';

  //high temp
  const tom_high_temp_text = document.getElementById("tomorrow_HighTemp");
  tom_high_temp_text.innerHTML = tom_max_Temp+'°';

  //icon
  // iconDiv = document.getElementById("tomorrow_Icon");
  // var image = document.createElement('img')
  // image.src = tom_icon;
  // iconDiv.appendChild(image);

  var iconDiv = document.getElementById("tomorrow_Icon");
  var image = document.createElement('img');
  image.src = icon;

  var existingImage = iconDiv.querySelector('img');
  if (existingImage) {
    iconDiv.replaceChild(image, existingImage);
  } else {
    iconDiv.appendChild(image);
  }




  // Tomorrow's weather
  const { min_Temp: ovtom_min_Temp, max_Temp: ovtom_max_Temp, icon: ovtom_icon, condition: ovtom_condition, average: pvtom_average } = await fetchFullWeather(city, overtomorrow_FormattedDate);

  //low temp
  const ovtom_low_temp_text = document.getElementById("ovtomorrow_LowTemp");
  ovtom_low_temp_text.innerHTML = ovtom_min_Temp+'°';

  //high temp
  const ovtom_high_temp_text = document.getElementById("ovtomorrow_HighTemp");
  ovtom_high_temp_text.innerHTML = ovtom_max_Temp+'°';

  //icon
  // iconDiv = document.getElementById("ovtomorrow_Icon");
  // var image = document.createElement('img')
  // image.src = ovtom_icon;
  // iconDiv.appendChild(image);

  var iconDiv = document.getElementById("ovtomorrow_Icon");
  var image = document.createElement('img');
  image.src = icon;

  var existingImage = iconDiv.querySelector('img');
  if (existingImage) {
    iconDiv.replaceChild(image, existingImage);
  } else {
    iconDiv.appendChild(image);
  }

}


function displayError(text,time=5000){
  const errorElement = document.getElementById("errorcodes");
  errorElement.innerText = text;
  errorElement.style.opacity = 1;
  setTimeout(() => {
    errorElement.style.opacity = "0";
  }, time);
  //5000
}

async function enterCity(location){
  try{
    await updateWeather(location);
  } catch (error){
    displayError("An error occured: "+error);
  }
}

updateWeather(city);

search_Button = document.getElementById("search-button");
search_Input = document.getElementById("search-input");

search_Button.addEventListener("click", async () => {
  // Get the value of the input field inside the event listener
  var input_Value = search_Input.value;
  await enterCity(input_Value);
  console.log(input_Value);
});

search_Input.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    // Get the value of the input field inside the event listener
    var input_Value = search_Input.value;
    await enterCity(input_Value);
    console.log(input_Value);
  }
});

search_Button.addEventListener("mouseover", () => {
  search_Button.style.cursor = "pointer";
});