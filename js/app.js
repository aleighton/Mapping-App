var Venue = function(venue){
  this.title = ko.observable(venue.title);
  this.venue_type = ko.observable(venue.venue_type);
}

var VenueViewModel = function(){
  var self = this;
  this.venueList = ko.observableArray();

  foursquareVenues.forEach(function(Item){
    self.venueList.push( new Venue(Item) );
  });

}

$(function(){
  ko.applyBindings(new VenueViewModel);
  ko.applyBindings(venueList);
});
