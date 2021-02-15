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

// Api nycklar
let weatherApiId = "e9e32aa7e3fb6286a50686f5e1a077c4";
let foursquareClientId = "IZ3NBJGEKK10NHXIDEO2RNJCKZDVBLXPINPFJE0HGFCMIMUY";
let foursquareClientSecret = "IOGQ3CXWYRMRNWTXV1BDCI2PVEMR3MAPRTBULCKVAGMRZF0Y";

function searchevent() {
  if (document.getElementById("attraction-container").childElementCount !== 0) {
    // Om attractioner visas ska de tas bort här innan sökning med nya attraktioner dyker upp
    for (i = 0; i < 3; i++) {
      document.getElementById("div" + i).remove();
    }
  }
  if (document.getElementById("weather-container").childElementCount !== 0) {
    // tar bort väder flex-rutan så att en ny ruta kan skapas när sökningen görs
    document.getElementById("weatherdiv").remove();
  }

  if (constructedSite == false) {
    siteconstructor(); // om användaren inte för första gången ännu
  } else {
    /* här kollar koden om du ville söka på väder enbart,
    attraktioner enbart eller båda två samtidigt,
    och skickar en till respektive funktion/er

    om man vill bara ha väder skickas koden också till getname, 
    då den gör en fetch till foursquare api ,
    så att man kan hämta namnet på staden oavsett, då vi får den från foursquare.
    */
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
  // visar alla element då första sökningen sker
  document.getElementById("flexbox-container").style.visibility = "visible";
  constructedSite = true;
  searchevent();
}

function searchattractions() {
  fetch(
    "https://api.foursquare.com/v2/venues/explore?near=" + // url till api'n
      searchBox.value + // användarens input i sökrutan
      "&client_id=" +
      foursquareClientId + // client id jag fått av att regristrera
      "&client_secret=" +
      foursquareClientSecret + // api nyckel secret som jag fått av att regristrera
      "&v=20170109" + // version, i form av datum
      "&limit=3" // hur många man max vill hämta
  )
    .then((response) => {
      // här skickar den response
      if (response.ok) {
        /* om response är ok , ska den returna response.json
      annars ska den alerta användaren om vilken error kode det är.
      */
        return response.json();
      } else {
        alert(
          "Foursquare API. Error code: " + response.status + ". Check Spelling."
        );
      }
    })
    .catch((e) =>
      alert(e)
    ) /* här har jag skrivit en catch som ger användaren
  error om användaren inte har nätverksconnection */
    .then((data) => {
      // datan skickas in i en for av funktion
      console.log(data);
      titleName.innerText = data.response.geocode.displayString;

      if (filterAlpha.checked == true) {
        /* om filter alphabetically vart iklickad så körs en sort
        funktion av datan i foursquare attractionerna, efter namnens bokstavsordning */
        data.response.groups[0].items.sort((a, b) =>
          a.venue.name.localeCompare(b.venue.name)
        );
      }
      if (data.response.groups[0].items.length < 1) {
        alert("Sorry no attractions here.");
      }

      // här ritas attractionerna ut i en parent som är en flexbox container
      for (i = 0; i < 3; i++) {
        let element = document.createElement("div");
        element.id = "div" + i;
        let parent = document.getElementById("attraction-container");
        parent.appendChild(element);

        element = document.createElement("h4");
        element.innerText = data.response.groups[0].items[i].venue.name;
        parent = document.getElementById("div" + i);
        parent.appendChild(element);

        element = document.createElement("h5");
        element.innerText =
          data.response.groups[0].items[i].venue.location.address +
          " " +
          data.response.groups[0].items[i].venue.location.city;
        parent = document.getElementById("div" + i);
        parent.appendChild(element);

        element = document.createElement("h5");
        element.innerText =
          data.response.groups[0].items[i].venue.categories[0].name;
        parent = document.getElementById("div" + i);
        parent.appendChild(element);
      }
    });
}
function searchweather() {
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=" +
      searchBox.value +
      "&appid=" +
      weatherApiId
  ) /* likt förra fetchen jag skrev, skrev jag även denna, skillnaden här är egentligen att
urlen helt enkelt är mycket kortare, och ber enbart av en api nyckel */
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        alert(
          "Openweather API. Error code: " +
            response.status +
            " " +
            response.statusText
        );
      }
    })
    .then((data) => {
      let temp = data["main"]["temp"];
      let desc = data["weather"][0]["description"];
      console.log(data);

      let element = document.createElement("div");
      element.id = "weatherdiv";
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

      // här ritas även en liten icon/bild ut beroende på väder, som ocskå följer med från api'n
      element = document.createElement("img");
      element.src =
        "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
      parent = document.getElementById("weatherdiv");
      parent.appendChild(element);
    });
}

function getname() {
  fetch(
    /* Denna fetchen görs precis som den i search attractions funktionen, 
    ber om attractions ifrån foursquare, men syftet med denna är ifall användaren
    ber om enbart väder, så ska denna också kallas så att användaren kan få tag i 
    staden/platsens namn då vi plockar det från foursquares api, då den ger 
    statsnamn, land, vilket jag tycker såg mer propert ut.   */
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
