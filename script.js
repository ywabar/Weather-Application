const key = '01ef8bab4d434e1fa82225911232205'; // key to Yemaj's API on weatherapi.com
const apiUrl = 'https://api.weatherapi.com/v1/current.json'; // URL to weatherapi.com

async function fetchWeatherAPI(city) {
  const url = `${apiUrl}?key=${key}&q=${city}`;
  try {
    const response = await fetch(url);
    console.log(response);
    
    const data = await response.json();
    console.log(data);

    const current_Temp = data.current.temp_f;
    const current_Condition = data.current.condition.text;
    const hourly_Temp = data.forecast.forecastday[0].hour;

    let max_Temp = hourly_Temp[0].temp_f;
    let min_Temp = hourly_Temp[0].temp_f;

    for (let i=1; i< hourly_Temp.length; i++) {
        const temp = hourly_Temp[i].temp_f;
        if (temp>max_Temp){
            max_Temp = temp;
        }
        if (temp<min_Temp){
            min_Temp = temp;
        }
    }

    return { current_Temp, current_Condition, max_Temp, min_Temp };
  } catch (error) {
    console.log('Error fetching weather data:', error);
  }
}

var city = "Fairfax";

async function updateWeather() {
  const weatherData = await fetchWeatherAPI(city);

  if (weatherData) {
    const { current_Temp, current_Condition, max_Temp, min_Temp } = weatherData;

    const location = document.getElementById("location_Text");
    location.innerHTML = city;

    const temp = document.getElementById("temp_Text");
    temp.innerHTML = current_Temp;

    const weather = document.getElementById("weather_Text");
    weather.innerHTML = current_Condition;

    const high = document.getElementById("w-high_Text");
    high.innerHTML = max_Temp;

    const low = document.getElementById("w-low_Text");
    low.innerHTML = min_Temp;
  }
}

updateWeather();
