/*
* Begin geofencing
*/
// TODO get current location
var lat = 42.292012799999995;
var long = -83.7168463;

var center = [lat, long];

// Query radius
var radiusInKm = 0.1;

// Get a reference to the Firebase public transit open data set
var tunesFirebaseRef = new Firebase("https://talk-tunes.firebaseio.com/");

// Create a new GeoFire instance, pulling data from the public transit data
var geoFire = new GeoFire(tunesFirebaseRef);

/*************/
/*  GEOQUERY */
/*************/
// Keep track of all of the vehicles currently within the query
var peoplesInQuery = {};

// Create a new GeoQuery instance
var geoQuery = geoFire.query({
  center: center,
  radius: radiusInKm
});

/* Adds new people markers to the region when they enter the query */
geoQuery.on("key_entered", function(personId, personLocation) {
  // Specify that the vehicle has entered this query
  personId = personId.split(":")[1];
  peoplesInQuery[personId] = true;

  // Look up the vehicle's data in the Transit Open Data Set
  tunes.FirebaseRef.child("/users/").child(personId).once("value", function(dataSnapshot) {
    // Get the vehicle data from the Open Data Set
    person = dataSnapshot.val();

    // If the vehicle has not already exited this query in the time it took to look up its data in the Open Data
    // Set, add it to the map
    if (person !== null && peoplesInQuery[personId] === true) {
      // Add the vehicle to the list of vehicles in the query
      peoplesInQuery[personId] = person;

      // Create a new marker for the vehicle
      person.marker = createPersonMarker(person, getVehicleColor(vehicle));
    }
  });
});

/* Moves vehicles markers on the map when their location within the query changes */
geoQuery.on("key_moved", function(personId, personLocation) {
  // Get the vehicle from the list of vehicles in the query
  personId = personId.split(":")[1];
  var person = peoplesInQuery[personId];

  // Animate the vehicle's marker
  if (typeof person !== "undefined" && typeof person.marker !== "undefined") {
    person.marker.animatedMoveTo(personLocation);
  }
});

/* Removes vehicle markers from the map when they exit the query */
geoQuery.on("key_exited", function(personId, personLocation) {
  // Get the vehicle from the list of vehicles in the query
  personId = personId.split(":")[1];
  var vehicle = peoplesInQuery[personId];

  // If the vehicle's data has already been loaded from the Open Data Set, remove its marker from the map
  if (person !== true) {
    person.marker.setMap(null);
  }

  // Remove the vehicle from the list of vehicles in the query
  delete peoplesInQuery[personId];
});
