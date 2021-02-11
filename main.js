let searchBox = document.getElementById("searchbox");
let searchButton = document.getElementById("searchbutton");

let onlyWeatherBox = document.getElementById("onlyweatherbox");
let onlyAttractionsbox = document.getElementById("onlyattractions");
let filterAlpha = document.getElementById("filteralpha");

onlyWeatherBox.addEventListener("click", function (uncheck) {
  onlyAttractionsbox.checked = false;
});
onlyAttractionsbox.addEventListener("click", function (uncheck) {
  onlyWeatherBox.checked = false;
});

let constructedSite = false;

let today = new Date();
let date =
  today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

let titleName = document.getElementById("titlename");
let currentWeather = document.getElementById("currentweather");
let currentDate = document.getElementById("currentdate");
let currentTemp = document.getElementById("currenttemp");
let currentCondition = document.getElementById("currentcondition");

let a1name = document.getElementById("a1name");
let a1adress = document.getElementById("a1adress");
let a1category = document.getElementById("a1category");

let a2name = document.getElementById("a2name");
let a2adress = document.getElementById("a2adress");
let a2category = document.getElementById("a2category");

let a3name = document.getElementById("a3name");
let a3adress = document.getElementById("a3adress");
let a3category = document.getElementById("a3category");

document.getElementById("flexbox-container").style.visibility = "hidden";

searchButton.addEventListener("click", searchevent);
searchBox.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) searchevent();
});

let weatherApiId = "e9e32aa7e3fb6286a50686f5e1a077c4";
let foursquareClientId = "IZ3NBJGEKK10NHXIDEO2RNJCKZDVBLXPINPFJE0HGFCMIMUY";
let foursquareClientSecret = "IOGQ3CXWYRMRNWTXV1BDCI2PVEMR3MAPRTBULCKVAGMRZF0Y";

function searchevent() {
  if (onlyWeatherBox.checked == true) {
    document.getElementById("attraction-container").style.visibility = "hidden";
  } else {
    document.getElementById("attraction-container").style.visibility =
      "visible";
  }
  if (onlyAttractionsbox.checked == true) {
    document.getElementById("weather-container").style.visibility = "hidden";
  } else {
    document.getElementById("weather-container").style.visibility = "visible";
  }
  if (constructedSite == false) {
    siteconstructor();
  } else {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=" +
        searchBox.value +
        "&appid=" +
        weatherApiId
    )
      .then((response) => response.json())
      .then((data) => {
        let name = data["name"];
        let temp = data["main"]["temp"];
        let desc = data["weather"][0]["description"];

        console.log(data);
        currentDate.innerText = "Date: " + date;
        currentWeather.innerText = "Weather: " + desc;
        currentTemp.innerText = "Temperature: " + temp + " C °";
      });

    fetch(
      "https://api.foursquare.com/v2/venues/explore?near=" +
        searchBox.value +
        "&client_id=" +
        foursquareClientId +
        "&client_secret=" +
        foursquareClientSecret +
        "&v=20170109"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        titleName.innerText = data.response.geocode.displayString;

        if (filterAlpha.checked == true) {
        } else {
          a1name.innerText = data.response.groups[0].items[0].venue.name;
          a1adress.innerText =
            data.response.groups[0].items[0].venue.location.address +
            " " +
            data.response.groups[0].items[0].venue.location.city;
          a1category.innerText =
            data.response.groups[0].items[0].venue.categories[0].name;

          a2name.innerText = data.response.groups[0].items[1].venue.name;
          a2adress.innerText =
            data.response.groups[0].items[1].venue.location.address +
            " " +
            data.response.groups[0].items[1].venue.location.city;
          a2category.innerText =
            data.response.groups[0].items[1].venue.categories[0].name;

          a3name.innerText = data.response.groups[0].items[2].venue.name;
          a3adress.innerText =
            data.response.groups[0].items[2].venue.location.address +
            " " +
            data.response.groups[0].items[2].venue.location.city;
          a3category.innerText =
            data.response.groups[0].items[2].venue.categories[0].name;
        }
      });
  }
}

function siteconstructor() {
  document.getElementById("flexbox-container").style.visibility = "visible";
  constructedSite = true;
  searchevent();
}
