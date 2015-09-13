myApp.controller("LoginController", function($scope, $firebaseAuth, $state) {
  var ref = new Firebase("https://talk-tunes.firebaseio.com");

  remove_user = function(authData){
    //console.log(authData.uid);
    var userRef = new Firebase("https://talk-tunes.firebaseio.com/users/" + authData.uid);
    userRef.remove();
  }

  set_user = function(authData){
    var userRef = new Firebase("https://talk-tunes.firebaseio.com/users/" + authData.uid);
    //console.log(authData.uid);
    userRef.set(authData.uid);
  };

  // Create a callback to handle the result of the authentication
  function authHandler(error, authData) {
    if (error) {
      console.error("Login Failed!", error);
    } else {
      //console.log("Authenticated successfully with payload:", authData);
      set_user(authData);
      $state.go('home');
    }
  }

  // Logs a user in
  $scope.login = function(provider){
    var authData = ref.getAuth();

    // user is logged in already
    //console.log(authData);
    if (authData){
      set_user(authData);
      $state.go('home');
    }
    else{
      // if user not logged it, force oauth process
      ref.authWithOAuthPopup(provider, authHandler),{
        remember: "sessionOnly",
        scope: "email"
      };
    }
  };
});

myApp.factory('Items', ['$firebaseArray', function($firebaseArray) {
  var itemsRef = new Firebase('https://talk-tunes.firebaseio.com/items');
  return $firebaseArray(itemsRef);
}])

myApp.controller('HomeController', function($scope, $ionicListDelegate, Items, $state, $cordovaGeolocation) {

  $scope.items = Items;

  $scope.addItem = function() {
    var name = prompt('What music do you want to add?');
    if (name) {
      $scope.items.$add({
        'name': name
      });
    }
  };

  $scope.purchaseItem = function(item) {
    var itemRef = new Firebase('https://talk-tunes.firebaseio.com/items/' + item.$id);
    itemRef.child('status').set('purchased');
    $ionicListDelegate.closeOptionButtons();
  };

  // Logs a user out
  $scope.logout = function() {
    var ref = new Firebase("https://talk-tunes.firebaseio.com/");
    var authData = ref.getAuth(); // get auth object
    remove_user(authData); // delete user from database
    ref.unauth(); // sign out of auth
    $state.go('login');
  };

  var update_lat_long = function(authData, lat, long){
    //console.log(lat, long);
    var userRef = new Firebase("https://talk-tunes.firebaseio.com/users/" + authData.uid + "/");
    userRef.update({
      latitude: lat,
      longitude: long
    }, function(error) {
    if (error) {
      console.error("Data could not be saved." + error);
    } else {
      //console.error("Data saved successfully.");
  }
});
  };


  var ref = new Firebase("https://talk-tunes.firebaseio.com/");
  var authData = ref.getAuth();
  var posOptions = {timeout: 10000, enableHighAccuracy: true};
   callback = function(){$cordovaGeolocation
     .getCurrentPosition(posOptions)
     .then(function (position) {
       var lat  = position.coords.latitude
       var long = position.coords.longitude
       update_lat_long(authData, lat, long);
       setTimeout(callback, 5000);
     }, function(err) {
       console.error("Couldn't not get location data.");
     });
   };
   callback();

});


