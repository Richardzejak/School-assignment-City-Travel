let searchBox = document.getElementById("searchbox");
let searchButton = document.getElementById("searchbutton");

searchButton.addEventListener("click", searchevent);

searchBox.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) searchevent();
});

let weatherApiId = "e9e32aa7e3fb6286a50686f5e1a077c4";
let foursquareClientId = "IZ3NBJGEKK10NHXIDEO2RNJCKZDVBLXPINPFJE0HGFCMIMUY";
let foursquareClientSecret = "IOGQ3CXWYRMRNWTXV1BDCI2PVEMR3MAPRTBULCKVAGMRZF0Y";

function searchevent() {
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
      alert(name + temp + desc);
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
      alert(data.response.geocode.displayString);
    });
}
