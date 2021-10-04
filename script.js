var searchhistory = document.querySelector("#history");
var todaysforcast = document.querySelector("#todaysforcast");
var currentDate = moment().format('M/D/YYYY');
var Day_1 = moment().add(1, 'days').format('M/D/YYYY');
var Day_2 = moment().add(2, 'days').format('M/D/YYYY');
var Day_3 = moment().add(3, 'days').format('M/D/YYYY');
var Day_4 = moment().add(4, 'days').format('M/D/YYYY');
var Day_5 = moment().add(5, 'days').format('M/D/YYYY');

var Day_1cardEl = document.querySelector("#weather-day1")
var Day_2cardEl = document.querySelector("#weather-day2")
var Day_3cardEl = document.querySelector("#weather-day3")
var Day_4cardEl = document.querySelector("#weather-day4")
var Day_5cardEl = document.querySelector("#weather-day5")

var HistoryBank = sessionStorage.getItem('SearchTermhistory') || [];

var reset = function(){

}

$(document).ready(function () {
  $('#search-bar').click(function() {

    console.log("I clicked button")

// Get text value 
var searchText = document.querySelector("SearchTerm").val().trim();

// Push search text in History Bank 
HistoryBank.push(searchText)

// Set Session Storage 
sessionStorage.setItem('pastSearches', HistoryBank);

// Create Search History Buttons 

var pastCityButton = document.createElement("a")
pastCityButton.setAttribute("class", "list-group-item list-group-item-action w-100 text-center bg-secondary text-light")
pastCityButton.setAttribute("id", "pastSearches[1]")
pastCityButton.setAttribute("href", "#");

for (let i = 0; i < HistoryBank.length; i++) {
  pastCityButton.textContent = HistoryBank[i]
  
  history.appendChild(pastCityButton);
  
}

var pastSearches = sessionStorage.getIteam('pastSearches')

var apiWeatherGeoUrl =  "http://api.openweathermap.org/geo/1.0/direct?"
+ "q=" + pastSearches 
+ "&limit=5&appid=df17e74bdf20873e07b163232f18dea1";

fetch(apiWeatherGeoUrl)
  .then(function(data) {
    return response.json();
  })
  .then(function(data) {
    console.log(data)
    console.log(data.result[0].bounds.northeast.lat)
    console.log(data.results[0].bounds.northeast.lng)

    var lat = data.results[0].bounds.northeast.lat;
    var lon = data.results[0].bounds.northeast.lng;

    var apiWeatherUrl = "https://api.openweathermap.org/data/2.5/onecall?"
    + "lat=" + lat 
    + "&lon=" + lon
    + "&appid=df17e74bdf20873e07b163232f18dea1";


    fetch(apiWeatherUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        console.log(data)
        console.log(data.daily[1].temp.day)

        $(".card-body").html("")

        $("#SearchTerm").val("")
      
        // Todays Forcast 
        var cityNameEl =document.createElement('h2');
        cityNameEl.setAttribute("class", "card-title text-left city date text-muted mb-0")
        cityNameEl.setAttribute("id", "cityName")
        cityNameEl.textContent = searchText + "(" + currentDate + ")";
        todaysforcast.appendChild(cityNameEl);
      

        // Img For Current Day 
        var iconEl =document.createElement('img')
        iconEl.setAttribute("id", "icon")
        var iconCode = data.current.weather[0].icon
        iconEl.src = "https://openweathermap.org/img/w/" + iconCode + ".png";
        todaysforcast.appendChild(iconEL);

        // Temp for Current Day 
        var cityTempTodayEl = document.createElement("p");
        cityTempTodayEl.setAttribute("class", "display-2 text-left temp-displayinfo");
        cityTempTodayEl.setAttribute("id", "TempToday")
        cityTempTodayEl.innerHTML = "Temp: " + data.current.temp;
        todaysforcast.appendChild(cityTempTodayEl)

        // Wind for Current Day Box
        var cityWindTodayEl = document.createElement('p');
        cityWindTodayEl.setAttribute("class", "card-text text-left wind-displayinfo");
        cityWindTodayEl.setAttribute("id", "WindToday");
        cityWindTodayEl.innerHTML = "Wind: " + data.current.wind_speed + " MPH";
        todaysforcast.appendChild(cityWindTodayEl);

        // Humidity for Current Day Box
        var cityHumidityTodayEl = document.createElement('p');
        cityHumidityTodayEl.setAttribute("class", "card-text text-left humidity-displayinfo");
        cityHumidityTodayEl.setAttribute("id", "cityHumidityToday");
        cityHumidityTodayEl.innerHTML = "Humidity: " + data.current.humidity + "%";
        todaysforcast.appendChild(cityHumidityTodayEl);


        //City Data
        var DayoneWeather = document.createElement("h5");
        DayoneWeather.setAttribute("class", "card-title text-light text-left date");
        DayoneWeather.innerHTML = Day_1;
        Day_1cardEl.appendChild(DayoneWeather);

        //Img for Day One 
        var Day1imgEL = document.createElement('img')
        var imgDay1Icon = data.daily[1].weather[0].icon
        Day1imgEL.src = "http://openweathermap.org/img/w/" + imgDay1Icon + ".png";
        Day_1cardEl.appendChild(Day1imgEL);

        // Temp for Day One
        var Day1Temp = document.createElement('p');
        Day1Temp.setAttribute('class', "card-title text-light text-left temp")
        Day1Temp.setAttribute('id', 'day1-temp');
        Day1Temp.innerHTML = "Temp:" + data.daily[1].temp.day;
        Day_1cardEl.appendChild(Day1Temp)

        // Wind for Day One
        var Day1Wind = document.createElement('p');
        Day1Wind.setAttribute("class", "card-text text-light text-left windCardInfo");
        Day1Wind.setAttribute("id", "cityWindToday");
        Day1Wind.innerHTML = "Wind: " + data.daily[1].wind_speed + " MPH";
        Day_1cardEl.appendChild(Day1Wind);

        // Humidity for Day One
        var Day1Humidity = document.createElement('p');
        Day1Humidity.setAttribute("class", "card-text text-light text-left humidityCardInfo");
        Day1Humidity.setAttribute("id", "cityHumidityToday");
        Day1Humidity.innerHTML = "Humidity: " + data.daily[1].humidity + "%";
        Day_1cardEl.appendChild(Day1Humidity);

        //City Data
        var Daytwoeather = document.createElement("h5");
        DaytwoWeather.setAttribute("class", "card-title text-light text-left date");
        DaytwoWeather.innerHTML = Day_2;
        Day_2cardEl.appendChild(DaytwoWeather);

        //Img for Day Two
        var Day2imgEL = document.createElement('img')
        var imgDay2Icon = data.daily[2].weather[0].icon
        Day2imgEL.src = "http://openweathermap.org/img/w/" + imgDay2Icon + ".png";
        Day_2cardEl.appendChild(Day2imgEL);

        // Temp for Day Two
        var Day2Temp = document.createElement('p');
        Day2Temp.setAttribute('class', "card-title text-light text-left temp")
        Day2Temp.setAttribute('id', 'day1-temp');
        Day2Temp.innerHTML = "Temp:" + data.daily[2].temp.day;
        Day_2cardEl.appendChild(Day2Temp)

        // Wind for Day Two
        var Day2Wind = document.createElement('p');
        Day2Wind.setAttribute("class", "card-text text-light text-left windCardInfo");
        Day2Wind.setAttribute("id", "cityWindToday");
        Day2Wind.innerHTML = "Wind: " + data.daily[2].wind_speed + " MPH";
        Day_2cardEl.appendChild(Day2Wind);

        // Humidity for Day Two
        var Day2Humidity = document.createElement('p');
        Day2Humidity.setAttribute("class", "card-text text-light text-left humidityCardInfo");
        Day2Humidity.setAttribute("id", "cityHumidityToday");
        Day2Humidity.innerHTML = "Humidity: " + data.daily[2].humidity + "%";
        Day_2cardEl.appendChild(Day2Humidity);

        //City Data
        var DaythreeWeather = document.createElement("h5");
        DaythreeWeather.setAttribute("class", "card-title text-light text-left date");
        DaythreeWeather.innerHTML = Day_3;
        Day_3cardEl.appendChild(DaythreeWeather);

        //Img for Day Three
        var Day3imgEL = document.createElement('img')
        var imgDay3Icon = data.daily[3].weather[0].icon
        Day3imgEL.src = "http://openweathermap.org/img/w/" + imgDay3Icon + ".png";
        Day_3cardEl.appendChild(Day3imgEL);

        // Temp for Day Three
        var Day3Temp = document.createElement('p');
        Day3Temp.setAttribute('class', "card-title text-light text-left temp")
        Day3Temp.setAttribute('id', 'day1-temp');
        Day3Temp.innerHTML = "Temp:" + data.daily[3].temp.day;
        Day_3cardEl.appendChild(Day3Temp)

        // Wind for Day Three
        var Day3Wind = document.createElement('p');
        Day3Wind.setAttribute("class", "card-text text-light text-left windCardInfo");
        Day3Wind.setAttribute("id", "cityWindToday");
        Day3Wind.innerHTML = "Wind: " + data.daily[3].wind_speed + " MPH";
        Day_3cardEl.appendChild(Day3Wind);

        // Humidity for Day Three
        var Day3Humidity = document.createElement('p');
        Day3Humidity.setAttribute("class", "card-text text-light text-left humidityCardInfo");
        Day3Humidity.setAttribute("id", "cityHumidityToday");
        Day3Humidity.innerHTML = "Humidity: " + data.daily[3].humidity + "%";
        Day_3cardEl.appendChild(Day3Humidity);

        //City Data
        var DayfourWeather = document.createElement("h5");
        DayfourWeather.setAttribute("class", "card-title text-light text-left date");
        DayfourWeather.innerHTML = Day_4;
        Day_4cardEl.appendChild(DayfourWeather);

        //Img for Day Four 
        var Day4imgEL = document.createElement('img')
        var imgDay4Icon = data.daily[4].weather[0].icon
        Day4imgEL.src = "http://openweathermap.org/img/w/" + imgDay4Icon + ".png";
        Day_4cardEl.appendChild(Day4imgEL);

        // Temp for Day Four
        var Day4Temp = document.createElement('p');
        Day4Temp.setAttribute('class', "card-title text-light text-left temp")
        Day4Temp.setAttribute('id', 'day1-temp');
        Day4Temp.innerHTML = "Temp:" + data.daily[4].temp.day;
        Day_4cardEl.appendChild(Day4Temp)

        // Wind for Day Four
        var Day4Wind = document.createElement('p');
        Day4Wind.setAttribute("class", "card-text text-light text-left windCardInfo");
        Day4Wind.setAttribute("id", "cityWindToday");
        Day4Wind.innerHTML = "Wind: " + data.daily[4].wind_speed + " MPH";
        Day_4cardEl.appendChild(Day4Wind);

        // Humidity for Day Four
        var Day4Humidity = document.createElement('p');
        Day4Humidity.setAttribute("class", "card-text text-light text-left humidityCardInfo");
        Day4Humidity.setAttribute("id", "cityHumidityToday");
        Day4Humidity.innerHTML = "Humidity: " + data.daily[4].humidity + "%";
        Day_4cardEl.appendChild(Day4Humidity);

        //City Data
        var DayfiveWeather = document.createElement("h5");
        DayfiveWeather.setAttribute("class", "card-title text-light text-left date");
        DayfiveWeather.innerHTML = Day_5;
        Day_5cardEl.appendChild(DayfiveWeather);

        //Img for Day Five 
        var Day5imgEL = document.createElement('img')
        var imgDay5Icon = data.daily[5].weather[0].icon
        Day5imgEL.src = "http://openweathermap.org/img/w/" + imgDay5Icon + ".png";
        Day_5cardEl.appendChild(Day5imgEL);

        // Temp for Day Five
        var Day5Temp = document.createElement('p');
        Day5Temp.setAttribute('class', "card-title text-light text-left temp")
        Day5Temp.setAttribute('id', 'day1-temp');
        Day5Temp.innerHTML = "Temp:" + data.daily[5].temp.day;
        Day_5cardEl.appendChild(Day5Temp)

        // Wind for Day Five
        var Day5Wind = document.createElement('p');
        Day5Wind.setAttribute("class", "card-text text-light text-left windCardInfo");
        Day5Wind.setAttribute("id", "cityWindToday");
        Day5Wind.innerHTML = "Wind: " + data.daily[5].wind_speed + " MPH";
        Day_5cardEl.appendChild(Day5Wind);

        // Humidity for Day Five
        var Day5Humidity = document.createElement('p');
        Day5Humidity.setAttribute("class", "card-text text-light text-left humidityCardInfo");
        Day5Humidity.setAttribute("id", "cityHumidityToday");
        Day5Humidity.innerHTML = "Humidity: " + data.daily[5].humidity + "%";
        Day_5cardEl.appendChild(Day5Humidity);
      })
  })
  

  
  

  

  

  
  })
});
