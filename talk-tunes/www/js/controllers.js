myApp.controller("LoginController", function($scope, $firebaseAuth, $state) {
  var ref = new Firebase("https://talk-tunes.firebaseio.com");

  //ref.child(string /user/id/location)
  //firebase.com/docs

  // Create an instance of the authentication service
  var auth = $firebaseAuth(ref);

  ref.onAuth(function(authData) {
    if (authData === null) {
        //console.log("Not logged in yet");
        $state.go('login');
    } else {
        //console.log("Logged in as", authData.uid);
        $state.go('home');
    }
    $scope.authData = authData; // This will display the user's name in our view
});

  // Logs a user in
  $scope.login = function(provider){

      if (auth === null) {

        auth.$authWithOAuthPopup(provider).then(function(authData) {
          //console.log("Logged in as:", authData.uid);
        }).catch(function(error) {
          //console.log("Authentication failed:", error);
      });

      } else {
          //console.log("Logged in as", authData.uid);
          $state.go('home');
      }
  }

  // Logs a user out
  $scope.logout = function() {
    console.log("logout");
    ref.unauth();
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
    var ref = new Firebase('https://talk-tunes.firebaseio.com/login');
    ref.unauth();
    $state.go('login');
  };

  var posOptions = {timeout: 10000, enableHighAccuracy: true};
  callback = function(){$cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      var lat  = position.coords.latitude
      var long = position.coords.longitude
      // console.log(lat, long);
      setTimeout(callback, 5000);
    }, function(err) {
      console.error("Couldn't not get location data.");
    });
  };
  callback();


});
