
var adminurl = "http://77.66.32.233/php/aktualitet/dagensord_version_2/";
var imageurl = "http://77.66.32.233/php/aktualitet/dagensord/media/picts/";

// Ionic Starter App

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
                          return getData.dagens("salme");
                      },
                      dagenstext: function(getData){
                          return getData.dagens("ord");
                      }
                  }
              }
          }
      })
      .state('app.ord', {
          url: "/ord",
          views: {
              'menuContent' :{
                  templateUrl: "templates/ord.html",
                  controller: 'OrdCtrl',
                  resolve: {
                      ord: function(getData){
                          return getData.all(2);
                      }
                  }
              }
          }
      })
      .state('app.visord', {
          url: "/ord/:ordId",
          views: {
              'menuContent' :{
                  templateUrl: "templates/visord.html",
                  controller: 'VisOrdCtrl',
                  resolve: {
                      dagensord: function(getData,$stateParams){
                          return getData.get($stateParams.ordId);
                      }
                  }
              }
          }
      })
      .state('app.boenner', {
          url: "/boenner",
          views: {
              'menuContent' :{
                  templateUrl: "templates/boenner.html",
                  controller: 'BoennerCtrl',
                  resolve: {
                      boenner: function(getData){
                          return getData.all(3, 100);
                      }
                  }
              }
          }
      })
      .state('app.visboen', {
          url: "/boenner/:boenId",
          views: {
              'menuContent' :{
                  templateUrl: "templates/visboen.html",
                  controller: 'VisBoenCtrl',
                  resolve: {
                      boen: function(getData,$stateParams){
                          return getData.get($stateParams.boenId);
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
      'http://qstream-down.qbrick.com/**',
      'http://77.66.32.233/**'
  ]);

});
