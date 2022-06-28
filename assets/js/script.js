// global variables
var apiKey = "aced3c832ed11bbdeba8eca54b432a36";
var formEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#cityInput");
var formBtnEl = document.getElementById("formBtn");
var cityInfoEl = document.querySelector("#city-info-container");


var formSubmitHandler = function(event) {
    event.preventDefault();

    // get value from input element and trim any leading/trailing spaces
    var cityName = cityInputEl.value.trim().toLowerCase();

    // check if there is a value in the cityName variable before requesting data
    if (cityName) {
        // pass city to the retrieveWeather function as an argument to request data
        retrieveCoordinates(cityName);
        // clear the form
        cityInputEl.value = "";
    } else {
        // if the input field is blank, alert
        alert("Please enter a city!");
    }
};

var retrieveCoordinates = function(city) {
    var apiUrl="https://api.openweathermap.org/geo/1.0/direct?q="+city+"&limit=1&appid=" +apiKey;

    // make a request to the url
    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                var lat = data[0].lat;
                var lon = data[0].lon;
                var city = data[0].name;

                var cityTitle = document.createElement('h3');
                cityTitle.textContent = city;
                cityInfoEl.appendChild(cityTitle);

                fetchWeather(lat, lon);
            });
        } else {
            alert('Error: Unable to connect to OpenWeatherMap.org');
        }
    })
    .catch(function(error) {
        // Notice this `.catch()` getting chained onto the end of the `.then()` method
        // .catch() to handle network errors
        alert("Unable to connect to OpenWeather");
    });
};

var fetchWeather = function(lat,lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units=imperial&exclude=hourly,daily&appid="+apiKey;

    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                displayWeather(data);
            });
        } else {
            alert('Error: Unable to connect to OpenWeatherMap.org');
        }
    })
    .catch(function(error) {
        // Notice this `.catch()` getting chained onto the end of the `.then()` method
        // .catch() to handle network errors
        alert("Unable to connect to OpenWeather");
    });



};

var displayWeather = data => {
    var temp = document.createElement('p');
    temp.textContent = "Temp: "+ Math.ceil(data.current.temp) +"°F";
    cityInfoEl.appendChild(temp);

    var wind = document.createElement('p');
    wind.textContent = "Wind: "+ Math.ceil(data.current.wind_speed)+" MPH";
    cityInfoEl.appendChild(wind);

    var humidity = document.createElement('p');
    humidity.textContent = "Humidity: "+ Math.ceil(data.current.humidity)+"%";
    cityInfoEl.appendChild(humidity);

    var uvi = data.current.uvi;
    var uviEl = document.createElement('p');
    var uviSpan = document.createElement('span');
    var uviSpanText = uviSpan.textContent = uvi;


    if(uvi<=2) {
        uviSpan.className =("low-uvi")
    } else if(uvi>2 && uvi<=7) {
        uviSpan.className =("moderate-uvi")
    } else if(uvi>7 && uvi<11) {
        uviSpan.className =("high-uvi")
    } else {
        uviSpan.className =("extreme-uvi")
    }
    uviEl.textContent = "UV Index: "
    cityInfoEl.appendChild(uviEl);
    uviEl.appendChild(uviSpan);
};


formEl.addEventListener("submit", formSubmitHandler);