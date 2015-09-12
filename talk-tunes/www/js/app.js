// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var myApp = angular.module('starter', ['ionic', 'firebase']);

myApp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

myApp.controller("loginCtrl", function($scope, $firebaseAuth) {
  var ref = new Firebase("https://talk-tunes.firebaseio.com");

  // Create an instance of the authentication service
  var auth = $firebaseAuth(ref);

  // Logs a user in
  $scope.login = function(provider){
    auth.$authWithOAuthPopup(provider).then(function(authData) {
      console.log("Logged in as:", authData.uid);
    }).catch(function(error) {
      console.log("Authentication failed:", error);
    });
  }

  // Logs a user out
  $scope.logout = function() {
    auth.$unauth();
  };
});
