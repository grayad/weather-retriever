// global variables
var apiKey = "aced3c832ed11bbdeba8eca54b432a36";
var formEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#cityInput");
var formBtnEl = document.getElementById("formBtn");
var cityInfoEl = document.querySelector("#city-info-container");
var forecastEl = document.querySelector("#forecast-section");
var historyEl = document.querySelector("#history-container")
var cities = [];

var formSubmitHandler = function(event) {
    event.preventDefault();

    // get value from input element and trim any leading/trailing spaces
    var cityName = cityInputEl.value.trim().toLowerCase();

    // check if there is a value in the cityName variable before requesting data
    if (cityName) {
        cities.push(cityName);

        saveSearch();
        loadSearch();

        // pass city to function as an argument to request coordinates
        retrieveCoordinates(cityName);
        // clear the form
        cityInputEl.value = "";
        // delete any previous html
        cityInfoEl.innerHTML = "";
        forecastEl.innerHTML = "";
    } else {
        // if the input field is blank, alert
        alert("Please enter a city!");
    }
};

var saveSearch = cityName => {
    // set input to local storage and create button
    localStorage.setItem("cities", JSON.stringify(cities));
};

var loadSearch = function() {
    // clear previous button history
    historyEl.textContent = "";

    var cities = JSON.parse(localStorage.getItem("cities"));
    console.log(cities);
    // create html for each item in localStorage
    for(var i=0; i<cities.length; i++){
        var cityBtn = document.createElement("btn");
        cityBtn.className = "btn bg-secondary border-0 m-1 w-100 text-center text-white";
        cityBtn.textContent = cities[i];
        historyEl.appendChild(cityBtn);
    }
}

window.onload = function() {
    loadSearch();
};

historyEl.addEventListener("click" , function(event) {
    var cityName = event.target.textContent;

    // reset containers to be blank to remove previous html
        cityInputEl.value = "";
        cityInfoEl.innerHTML = "";
        forecastEl.innerHTML = "";

        retrieveCoordinates(cityName);
});

var retrieveCoordinates = function(city) {
    var apiUrl="https://api.openweathermap.org/geo/1.0/direct?q="+city+"&limit=1&appid=" +apiKey;

    // make a request to the url
    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                // get lat, lon, and city data
                var lat = data[0].lat;
                var lon = data[0].lon;
                var city = data[0].name;

                // create html for date
                var dateEl = document.createElement('span');
                dateEl.textContent = " (" + moment().format('L') + ")";

                // create html for city title
                var cityTitle = document.createElement('h3');
                cityTitle.textContent = city;
                cityInfoEl.appendChild(cityTitle);
                cityTitle.appendChild(dateEl);


                // send coordinates to fetchWeather function
                fetchWeather(lat, lon);
                // displayForecast(lat,lon);
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
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units=imperial&exclude=hourly,minutely&appid="+apiKey;

    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
                // send city weather info to functions to create HTML
                displayWeather(data);
                displayForecast(data);
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
    var condition = data.current.weather[0].main;
    if(condition === "Clouds") {
        var icon = document.createElement('i');
        icon.className = ("fa fa-solid fa-cloud");
        cityInfoEl.appendChild(icon);
    } else if (condition === "Thunderstorm") {
        var icon = document.createElement('i');
        icon.className = ("fa fa-solid fa-cloud-bolt");
        cityInfoEl.appendChild(icon);
    } else if (condition === "Drizzle") {
        var icon = document.createElement('i');
        icon.className = ("fa fa-solid fa-cloud-rain");
        cityInfoEl.appendChild(icon);
    }  else if (condition === "Rain") {
        var icon = document.createElement('i');
        icon.className = ("fa fa-solid fa-cloud-showers-heavy");
        cityInfoEl.appendChild(icon);
    }  else if (condition === "Snow") {
        var icon = document.createElement('i');
        icon.className = ("fa fa-solid fa-snowflake");
        cityInfoEl.appendChild(icon);
    }  else if (condition === "Clear") {
        var icon = document.createElement('i');
        icon.className = ("fa fa-solid fa-sun");
        cityInfoEl.appendChild(icon);
    } else {
        var icon = document.createElement('i');
        icon.className = ("fa fa-solid fa-smog");
        cityInfoEl.appendChild(icon);
    }
    // temp HTML
    var temp = document.createElement('p');
    temp.textContent = "Temp: "+ Math.ceil(data.current.temp) +"??F";
    cityInfoEl.appendChild(temp);

    // wind HTML
    var wind = document.createElement('p');
    wind.textContent = "Wind: "+ Math.ceil(data.current.wind_speed)+" MPH";
    cityInfoEl.appendChild(wind);

    // humidity HTML
    var humidity = document.createElement('p');
    humidity.textContent = "Humidity: "+ Math.ceil(data.current.humidity)+"%";
    cityInfoEl.appendChild(humidity);

    // UV Index HTML
    var uvi = data.current.uvi;
    var uviEl = document.createElement('p');
    var uviSpan = document.createElement('span');
    uviSpan.textContent = uvi;
    // color code UVI based on scale
    if(uvi<=2) {
        uviSpan.className =("low-uvi")
    } else if(uvi>2 && uvi<=7) {
        uviSpan.className =("moderate-uvi")
    } else if(uvi>7 && uvi<11) {
        uviSpan.className =("high-uvi")
    } else {
        uviSpan.className =("extreme-uvi")
    }
    // append uvi elements to the current weather section
    uviEl.textContent = "UV Index: "
    cityInfoEl.appendChild(uviEl);
    uviEl.appendChild(uviSpan);
};

var displayForecast = data => {
    console.log(data.daily);

    for(var i =1; i < data.daily.length-2; i++) {
        var div = document.createElement("div");
        div.className = "forecast";

        // get data
        var temp = data.daily[i].temp.day;
        var wind = data.daily[i].wind_speed;
        var humidity = data.daily[i].humidity;

        if(i===1) {
            var date = moment().add(1, 'days').format('L')
        } else if (i===2){
            var date = moment().add(2, 'days').format('L')
        } else if (i===3){
            var date = moment().add(3, 'days').format('L')
        } else if (i===4){
            var date = moment().add(4, 'days').format('L')
        } else if (i===5){
            var date = moment().add(5, 'days').format('L')
        };

        // create elements
        var dateEl = document.createElement("h4");
        dateEl.textContent = date;
        div.appendChild(dateEl);

        // set condition and icon
        var condition = data.daily[i].weather[0].main;
        if(condition === "Clouds") {
            var icon = document.createElement('i');
            icon.className = ("fa fa-solid fa-cloud");
            div.appendChild(icon);
        } else if (condition === "Thunderstorm") {
            var icon = document.createElement('i');
            icon.className = ("fa fa-solid fa-cloud-bolt");
            div.appendChild(icon);
        } else if (condition === "Drizzle") {
            var icon = document.createElement('i');
            icon.className = ("fa fa-solid fa-cloud-rain");
            div.appendChild(icon);
        }  else if (condition === "Rain") {
            var icon = document.createElement('i');
            icon.className = ("fa fa-solid fa-cloud-showers-heavy");
            div.appendChild(icon);
        }  else if (condition === "Snow") {
            var icon = document.createElement('i');
            icon.className = ("fa fa-solid fa-snowflake");
            div.appendChild(icon);
        }  else if (condition === "Clear") {
            var icon = document.createElement('i');
            icon.className = ("fa fa-solid fa-sun");
            div.appendChild(icon);
        } else {
            var icon = document.createElement('i');
            icon.className = ("fa fa-solid fa-smog");
            div.appendChild(icon);
        }

        var tempEl = document.createElement("p");
        tempEl.textContent="Temp: "+ Math.ceil(temp) +"??F";
        div.appendChild(tempEl);

        var windEl = document.createElement("p");
        windEl.textContent="Wind: "+ Math.ceil(wind)+" MPH";
        div.appendChild(windEl);

        var humidityEl = document.createElement("p");
        humidityEl.textContent="Humidity: "+ Math.ceil(humidity)+"%";
        div.appendChild(humidityEl);

        forecastEl.appendChild(div);
    }
};


formEl.addEventListener("submit", formSubmitHandler);