let searchBox = document.getElementById("searchbox");
let searchButton = document.getElementById("searchbutton");


searchButton.addEventListener('click', searchevent);

searchBox.addEventListener('keyup', function(event){
  if (event.keyCode === 13)
    searchevent();
  });

function searchevent(){
alert(searchBox.value);
}