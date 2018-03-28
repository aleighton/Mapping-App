// GLOBAL VARIABLES //
var map;
var markers = [];

// -- GOOGLE MAP API FUNCTIONS -- //

function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7413549, lng: -73.9980244},
    zoom: 13
  });
}

function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}
// Adds a marker to the map and push to the array.
function addMarker(location, title) {
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    title: title
  });
  markers.push(marker);
}
// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}

function clearMarkers() {
  setMapOnAll(null);
}

function searchLocation(){
  // Initialize the geocoder.
  var geocoder = new google.maps.Geocoder();
  // Get the address or place that the user entered.
  var address = document.getElementById('location-text').value;
  // Make sure the address isn't blank.
  if (address == '') {
    window.alert('You must enter an area, or address.');
  } else {
    // Geocode the address/area entered to get the center. Then, center the map
    // on it and zoom in
    geocoder.geocode(
      { address: address,
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          map.setCenter(results[0].geometry.location);
          map.setZoom(15);
        } else {
          window.alert('We could not find that location - try entering a more' +
              ' specific place.');
        }
      });
    }
}

// -- FOURSQUARE API FUNCTIONS -- //
//makes api call to foursquare and gets json object with 30 venues
//strips relevantg data out of json object and calls create markers function
function getFoursquareVenues(){

  CLIENT_ID = "2AZNML0AGQ55HSC5D2ZUY2Y32OCRCKG41BHLNH5VVGAL2AOB";
  CLIENT_SECRET = "PJ4HED34WYDRLNJQ2AEDMKVYUHWRNVMOBC151EZWVLCPVXUA";

  var geocoder = new google.maps.Geocoder();
  // Get the address or place that the user entered.
  var address = document.getElementById('location-text').value;
  // Make sure the address isn't blank.
  geocoder.geocode(
    { address: address,
    }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var lat = results[0].geometry.location.lat().toString();
        var lng = results[0].geometry.location.lng().toString();
        $.ajax({
          type: "GET",
          url: "https://api.foursquare.com/v2/venues/explore?ll="+lat+","+lng+"&client_id="+CLIENT_ID+"&client_secret="+CLIENT_SECRET+"&v=20180326",
          success: function(data) {
            var dataobj = data.response.groups[0].items;
            createVenueMarkers(dataobj);
        }
      });
      } else {
        window.alert('We could not find that location - try entering a more' +
            ' specific place.');
      }
    });
}

function createVenueMarkers(data){
  deleteMarkers();
  for(var i=0; i < data.length; i++){
    var latitude = data[i].venue.location.lat;
    var longitude = data[i].venue.location.lng;
    var location = {lat: latitude, lng: longitude};
    var title = data[i].venue.name;
    addMarker(location, title);

  }
  markers[0].setAnimation(google.maps.Animation.BOUNCE);
}
