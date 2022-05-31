var cityInputEl = document.querySelector("#cityInput");
console.log(cityInputEl);
var formBtnEl = document.getElementById("formBtn");


var formSubmitHandler = function(event) {
    event.preventDefault();
    console.log(cityInputEl.value);
    // get value from input element and trim any leading/trailing spaces
    var cityName = cityInputEl.value.trim();
    console.log(cityName);

    // check if there is a value in the username variable before requesting data
    if (cityName) {
        // pass username data to the getUserRepos function as an argument to request data
        retrieveWeather(cityName);
        // clear the form
        cityInputEl.value = "";
    } else {
        // if the input field is blank, alert
        alert("Please enter a city");
    }
};

// var retrieveWeather = function(city) {
//     var apiUrl="https://api.openweathermap.org/geo/1.0/direct?q="+cityName +"&limit=1&appid=aced3c832ed11bbdeba8eca54b432a36";

//     // make a request to the url
//     fetch(apiUrl)
//     .then(function(response) {
//         // request was successful
//         if (response.ok) {
//             response.json().then(function(data) {
//                 displayWeather(data, city);
//             });
//         } else {
//             alert('Error: Weather Not Found');
//         }
//     })
//     .catch(function(error) {
//         // Notice this `.catch()` getting chained onto the end of the `.then()` method
//         // .catch() to handle network errors
//         alert("Unable to connect to OpenWeather");
//     });
// };

// var displayWeather = function(weather, searchTerm) {
// }

formBtnEl.addEventListener("submit", formSubmitHandler);

