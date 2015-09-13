myApp.controller("LoginController", function($scope, $firebaseAuth, $state) {
  var ref = new Firebase("https://talk-tunes.firebaseio.com");

  // Create a callback to handle the result of the authentication
  function authHandler(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      console.log("Authenticated successfully with payload:", authData);
      $state.go('home');
    }
  }

  // Logs a user in
  $scope.login = function(provider){
      var authData = ref.getAuth();
      if (authData){
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

myApp.controller('HomeController', function($scope, $ionicListDelegate, Items, $state) {

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
});


