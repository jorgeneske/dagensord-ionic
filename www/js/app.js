var adminurl = "http://dagensord.folkekirken.dk/datafeed.php";
var apptype = "app";

// Ionic Starter App

angular.module('dagensord', ['ionic', 'dagensord.controllers', 'dagensord.services','angular-data.DSCacheFactory'])

//.run(function($ionicPlatform) {
//  $ionicPlatform.ready(function() {
//    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//    // for form inputs)
//    if(window.cordova && window.cordova.plugins.Keyboard) {
//      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//    }
//    if(window.StatusBar) {
//      // org.apache.cordova.statusbar required
//      StatusBar.styleDefault();
//    }
//
//  });
//})

.run(function($ionicPlatform, $ionicPopup) {
    $ionicPlatform.ready(function() {
        if(window.Connection && ionic.Platform.isAndroid()) {
            if(navigator.connection.type == Connection.NONE) {
                $ionicPopup.alert({
                    title: "Ingen netforbindelse",
                    content: "Der er ikke forbindelse til internettet, og Dagens Ord kan derfor ikke vises"
                })
                    .then(function(result) {
                        //if(!result) {
                            ionic.Platform.exitApp();
                        //}
                    });
            }
        }
        if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
          StatusBar.styleDefault();
        }
        if(typeof analytics !== undefined) {
            //analytics.startTrackerWithId("UA-36215325-3");
            $ionicPopup.alert({
                title: "analitics",
                content: "alt ok"
            });
        }
        else {
            $ionicPopup.alert({
                title: "analitics missing",
                content: "not ok"
            });
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
      .state('app.soegtext', {
          url: "/soegtext/:soeg",
          views: {
              'menuContent' :{
                  templateUrl: "templates/ord.html",
                  controller: 'SoegTextCtrl',
                  resolve: {
                      ord: function(getData,$stateParams){
                          return getData.soeg(2,$stateParams.soeg);
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
/*
                      boenner: function(getData){
                          console.log('get prayers');
                          return[];
                          //return getData.all(3, '5');
                      }
*/
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
      .state('app.boenok', {
          url: "/ok",
          views: {
              'menuContent' :{
                  templateUrl: "templates/boenmodtaget.html"
              }
          }
      })
      .state('app.mere', {
          url: "/mere/:slide",
          views: {
              'menuContent' :{
                  templateUrl: "templates/mere.html",
                  controller: 'MereCtrl',
                  resolve: {

                  }
              }
          },
          onExit: function(getData) {
              for (i = 0; i < getData.moreSounds.length; ++i) {
                  getData.moreSounds[i].stop();
              }
          }
      })
      .state('app.om', {
          url: "/om",
          views: {
              'menuContent' :{
                  templateUrl: "templates/om.html",
                  controller: 'OmCtrl',
                  resolve: {
                      om: function(getData){
                          return getData.about(apptype);
                      }
                  }
              }
          }
      })
      .state('app.soegsalme', {
          url: "/soegsalme/:soeg",
          views: {
              'menuContent' :{
                  templateUrl: "templates/salmer.html",
                  controller: 'SoegSalmeCtrl',
                  resolve: {
                      salmer: function(getData,$stateParams){
                          return getData.soeg(1,$stateParams.soeg);
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
                          return getData.all(1, 20);
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
          },
          onExit: function(getData) {
              for (i = 0; i < getData.resetSounds.length; ++i) {
                  getData.resetSounds[i].stop();
              }
          }
      });

  $urlRouterProvider.otherwise('/app/home');

  $locationProvider.html5Mode(false);

  $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'http://qstream-down.qbrick.com/**',
      'http://77.66.32.233/**',
      'http://downol.dr.dk/**',
      'http://dagensord.folkekirken.dk/**',
      'http://dagensord.lombard.pil.dk/**'
  ]);

});
