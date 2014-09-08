// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('dagensord', ['ionic', 'dagensord.controllers', 'dagensord.services'])

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

.config(function($stateProvider, $locationProvider, $urlRouterProvider) {
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
                  templateUrl: "templates/home.html"
              }
          }
      })

      .state('app.salmer', {
          url: "/salmer",
          views: {
              'menuContent' :{
                  templateUrl: "templates/salmer.html",
                  controller: 'SalmerCtrl',
//                  resolve: {
//                      salmer : function() {
//                          var deferred = $q.defer();
//                          $http.jsonp('http://77.66.32.233/php/aktualitet/dagensord_version_2/?cat=1&limit=20&callback=JSON_CALLBACK', {
////                              cache: DSCacheFactory.get('dataCache')
//                          })
//                              .success(function (data) {
//                                  deferred.resolve(data);
//                              })
//                              .error(function () {
//                                  deferred.reject();
//                              });
//                          return deferred.promise;
//                      }
//                  }
              }
          }
      })
      .state('app.vissalme', {
          url: "/salmer/:salmeId",
          views: {
              'menuContent' :{
                  templateUrl: "templates/vissalme.html",
                  controller: 'VisSalmeCtrl'
              }
          }
      });

  $urlRouterProvider.otherwise('/app/home');

  $locationProvider.html5Mode(false);

});

