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

document.getElementById("flexbox-container").style.visibility = "hidden";

searchButton.addEventListener("click", searchevent);
searchBox.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) searchevent();
});

let weatherApiId = "e9e32aa7e3fb6286a50686f5e1a077c4";
let foursquareClientId = "IZ3NBJGEKK10NHXIDEO2RNJCKZDVBLXPINPFJE0HGFCMIMUY";
let foursquareClientSecret = "IOGQ3CXWYRMRNWTXV1BDCI2PVEMR3MAPRTBULCKVAGMRZF0Y";

function searchevent() {

  if (document.getElementById("attraction-container").childElementCount!== 0)
  {
    for(i = 0; i < 3; i++) {
     document.getElementById("div"+i).remove();
    }
  }
  if (document.getElementById("weather-container").childElementCount!== 0)
  {
    document.getElementById("weatherdiv").remove();
  }

  if (constructedSite == false) {
    siteconstructor();
  }
  else{
    if (onlyWeatherBox.checked == true) {
      searchweather();
      getname();
    } else if (onlyAttractionsbox.checked == true) {
      searchattractions();
    } else {
      searchweather();
      searchattractions();
    }
  }
}

function siteconstructor() {
  document.getElementById("flexbox-container").style.visibility = "visible";
  constructedSite = true;
  searchevent();
}

function searchattractions(){
  fetch(
    "https://api.foursquare.com/v2/venues/explore?near=" +
      searchBox.value +
      "&client_id=" +
      foursquareClientId +
      "&client_secret=" +
      foursquareClientSecret +
      "&v=20170109"
  )
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      alert("Foursquare API. Error code: "+ response.status + ". Check Spelling.");
  }
  })
    .then((data) => {
      console.log(data);
      titleName.innerText = data.response.geocode.displayString;

      if (filterAlpha.checked == true) {
      } else {
        for(i = 0; i < 3; i++) {
          let element = document.createElement("div");
          element.id = ("div"+i);
          let parent = document.getElementById("attraction-container");
          parent.appendChild(element);
          
          element = document.createElement("h4");
          element.innerText = data.response.groups[0].items[i].venue.name;
          parent = document.getElementById("div"+i);
          parent.appendChild(element);

          element = document.createElement("h5");
          element.innerText = data.response.groups[0].items[i].venue.location.address +
          " " +
          data.response.groups[0].items[i].venue.location.city;
          parent = document.getElementById("div"+i);
          parent.appendChild(element);

          element = document.createElement("h5");
          element.innerText = data.response.groups[0].items[i].venue.categories[0].name;
          parent = document.getElementById("div"+i);
          parent.appendChild(element);
        }
      }
    });
}

function searchweather(){
fetch(
  "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=" +
    searchBox.value +
    "&appid=" +
    weatherApiId
)
.then((response) => {
  if (response.ok) {
    return response.json();
  } else {
  alert("Openweather API. Error code: " + response.status + " " + response.statusText);
}
})
  .then((data) => {
    let name = data["name"];
    let temp = data["main"]["temp"];
    let desc = data["weather"][0]["description"];
    console.log(data);

    let element = document.createElement("div");
    element.id = ("weatherdiv");
    let parent = document.getElementById("weather-container");
    parent.appendChild(element);

    element = document.createElement("h4");
    element.innerText = "Temperature: " + temp + " C°";
    parent = document.getElementById("weatherdiv");
    parent.appendChild(element);

    element = document.createElement("h5");
    element.innerText = "Weather: " + desc;
    parent = document.getElementById("weatherdiv");
    parent.appendChild(element);

    element = document.createElement("h5");
    element.innerText = "Date: " + date;
    parent = document.getElementById("weatherdiv");
    parent.appendChild(element);

    element = document.createElement("img");
    element.src = "http://openweathermap.org/img/w/"+data.weather[0].icon+".png"
    parent = document.getElementById("weatherdiv");
    parent.appendChild(element);
  });
}

function getname(){
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
      titleName.innerText = data.response.geocode.displayString;
  });
}