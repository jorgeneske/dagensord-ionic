
var adminurl = "http://77.66.32.233/php/aktualitet/dagensord_version_2/";

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('dagensord', ['ionic', 'dagensord.controllers', 'dagensord.services','angular-data.DSCacheFactory'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})


.config(function($stateProvider, $locationProvider, $urlRouterProvider, $sceDelegateProvider) {

  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'MainCtrl'
    })

      .state('app.home', {
          url: "/home",
          views: {
              'menuContent' :{
                  templateUrl: "templates/home.html",
                  controller: 'FrontCtrl',
                  resolve: {
                      dagenssalme: function(getData){
                          return getData.get(124);
                      },
                      dagenstext: function(getData){
                          return getData.get(2108);
                      }
                  }
              }
          }
      })

      .state('app.salmer', {
          url: "/salmer",
          views: {
              'menuContent' :{
                  templateUrl: "templates/salmer.html",
                  controller: 'SalmerCtrl',
                  resolve: {
                      salmer: function(getData){
                          return getData.all(1);
                      }
                  }
              }
          }
      })
      .state('app.vissalme', {
          url: "/salmer/:salmeId",
          views: {
              'menuContent' :{
                  templateUrl: "templates/vissalme.html",
                  controller: 'VisSalmeCtrl',
                  resolve: {
                      salme: function(getData,$stateParams){
                          return getData.get($stateParams.salmeId);
                      }
                  }
              }
          }
      });

  $urlRouterProvider.otherwise('/app/home');

  $locationProvider.html5Mode(false);

  $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'http://qstream-down.qbrick.com/**'
  ]);

});

