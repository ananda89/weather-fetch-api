document.querySelector("#searchForm").addEventListener("submit", getWeatherDay);
const appKey = "f33ab95e615dc5a7c3c725a9b8e4e80f";

function getWeatherDay(e) {
  const city = document.querySelector("#cityInput").value;
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${appKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      document.querySelector("#icon-div").innerHTML = `
        <i class="icon ${selectIcon(data.weather[0].icon)}"/>
        <h2 class="active" href="#" id="fahrenheit">${fahrenheit(data.main.temp)}°F | ${celsius(data.main.temp)}°C</h2>
        <br>
            <h3>
                Wind: ${data.wind.speed} mph
                <br>
                Humidity: ${data.main.humidity}%
            </h3>
        <br>
      `;

      document.querySelector("#details-div").innerHTML = `
          <h2 >${data.name}, ${data.sys.country}</h2>
          <br>
          <section>
            <h3>${getDateHour()}</h3>
            <h3>${titleCase(data.weather[0].description)}</h3>
          </section>
          `;
      getWeatherWeek(data.name);
      console.log(data);
    })
    .catch(err => console.log(err));
  clearInput();
  e.preventDefault();
}

function titleCase(str) {
  return str
    .split(" ")
    .map(function (word) {
      return word[0].toUpperCase() + word.substring(1);
    })
    .join(" ");
}

function clearInput() {
  document.getElementById("searchForm").reset();
}


function selectIcon(code) {
  const N = code.replace(/\D/g, "");
  const iconMap = {
    "01": "wi wi-day-sunny",
    "02": "wi wi-night-cloudy",
    "03": "wi wi-cloud",
    "04": "wi wi-cloudy",
    "09": "wi wi-showers",
    "10": "wi wi-rain",
    "11": "wi wi-thunderstorm",
    "13": "wi wi-snow-wind",
    "50": "wi wi-fog",
  }
  return iconMap[N] ? iconMap[N] : "wi wi-day-sunny";
};

/**
 * function get hour and Date
 */
function getDateHour() {
  let now = new Date();
  let dayName = new Array(
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  );
  return `${dayName[now.getDay()]} ${now.getHours()}:${getMinute(now)}`;
}

function getMinute(time) {
  let min = ("0" + time.getMinutes()).slice(-2);
  return min;
}

/**
 * function get forecast weather week
 */
function getWeatherWeek(city) {
  const urlForeCast = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${appKey}`;
  const arrayForecast = [2, 10, 18, 26, 34];

  fetch(urlForeCast)
    .then(response => response.json())
    .then(data => {
      console.log(data);

      arrayForecast.forEach(i => {
        let date = data.list[i].dt_txt.slice(5, 10).split('-').reverse().join('/');
        console.log('------------------------------------');
        console.log("date:" + date);
        console.log("temp-max:" + fahrenheit(data.list[i].main.temp_max));
        console.log("temp-min:" + fahrenheit(data.list[i].main.temp_min));
        console.log('------------------------------------');
      });
    });
}

/**
 * convert temperature in kelvin
 */
function celsius(tempKelvin) {
  const celsius = Math.round(tempKelvin - 273.15);
  return celsius;
}

function fahrenheit(tempKelvin) {
  const fahrenheit = Math.round((tempKelvin - 273.15) * 1.8 + 32);
  return fahrenheit;
}