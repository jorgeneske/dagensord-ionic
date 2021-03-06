angular.module('dagensord.services',[])

    .factory('getData', function($http, $q) {
        return {
            all: function(cat,limit) {
                limit = limit || 15;
                var url = adminurl+'datafeed.php?cat='+cat+'&limit='+limit+'&callback=JSON_CALLBACK';
                var deferred = $q.defer();
                $http.jsonp(url, {
                    cache: true
                })
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function () {
                    deferred.reject();
                });
                return deferred.promise;
            },
            get: function (id) {
                var url = adminurl+"datafeed.php?itemid="+id+"&callback=JSON_CALLBACK";
                  var deferred = $q.defer();
                  $http.jsonp(url, {
                      cache: true
                  })
                      .success(function (data) {
                          deferred.resolve(data);
                      })
                      .error(function (data) {
                          deferred.reject();
                      });
                  return deferred.promise;
            },
            dagens: function (cat) {
                var url = adminurl+"datafeed.php?dagens="+cat+"&callback=JSON_CALLBACK";
                var deferred = $q.defer();
                $http.jsonp(url, {
                    cache: true
                })
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (data) {
                        deferred.reject();
                    });
                return deferred.promise;
            },
            about: function (type) {
                var url = adminurl+"datafeed.php?about="+type+"&callback=JSON_CALLBACK";
                var deferred = $q.defer();
                $http.jsonp(url, {
                    cache: true
                })
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (data) {
                        deferred.reject();
                    });
                return deferred.promise;
            },
            soeg: function (cat,query,limit) {
                limit = limit || 3000;
                var url = adminurl+"datafeed.php?cat="+cat+"&soeg="+query+"&limit="+limit+"&callback=JSON_CALLBACK";
                console.log(url);
                var deferred = $q.defer();
                $http.jsonp(url, {
                    cache: true
                })
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (data) {
                        deferred.reject();
                    });
                return deferred.promise;
            },
            salmer : [], // Array til at holde salmer til listen
            moreSalmerInDB:true, // Sættes til 'false' når alle salmer fra databasen er hentet i listen
            ord : [], // Array til at holde 'dagens ord' til listen
            moreOrdInDB:true, // Sættes til 'false' når alle 'dagens ord' fra databasen er hentet i listen
            moreSounds:[], // Styrer rækkefølgen under menupunktet "Mere" (Velsignelsen, Fadervor ...)
            resetSounds:[] // Bruges til nulstille lyd på salmer
        };
    })
    .factory('MediaSrv', function($q, $ionicPlatform, $window){
        var service = {
            loadMedia: loadMedia,
            getStatusMessage: getStatusMessage,
            getErrorMessage: getErrorMessage
        };

        function loadMedia(src, onError, onStatus, onStop){
            var defer = $q.defer();
            $ionicPlatform.ready(function(){
                var mediaSuccess = function(){
                    if(onStop){onStop();}
                };
                var mediaError = function(err){
                    _logError(src, err);
                    if(onError){onError(err);}
                };
                var mediaStatus = function(status){
                    if(onStatus){onStatus(status);}
                };

                if($ionicPlatform.is('android')){src = '' + src;}
                defer.resolve(new $window.Media(src, mediaSuccess, mediaError, mediaStatus));
            });
            return defer.promise;
        }

        function _logError(src, err){
            console.error('media error', {
                code: err.code,
                message: getErrorMessage(err.code)
            });
        }

        function getStatusMessage(status){
            if(status === 0){return 'Media.MEDIA_NONE';}
            else if(status === 1){return 'Media.MEDIA_STARTING';}
            else if(status === 2){return 'Media.MEDIA_RUNNING';}
            else if(status === 3){return 'Media.MEDIA_PAUSED';}
            else if(status === 4){return 'Media.MEDIA_STOPPED';}
            else {return 'Unknown status <'+status+'>';}
        }

        function getErrorMessage(code){
            if(code === 1){return 'MediaError.MEDIA_ERR_ABORTED';}
            else if(code === 2){return 'MediaError.MEDIA_ERR_NETWORK';}
            else if(code === 3){return 'MediaError.MEDIA_ERR_DECODE';}
            else if(code === 4){return 'MediaError.MEDIA_ERR_NONE_SUPPORTED';}
            else {return 'Unknown code <'+code+'>';}
        }

        return service;
    })
window.Media = function(src, mediaSuccess, mediaError, mediaStatus){
    // src: A URI containing the audio content. (DOMString)
    // mediaSuccess: (Optional) The callback that executes after a Media object has completed the current play, record, or stop action. (Function)
    // mediaError: (Optional) The callback that executes if an error occurs. (Function)
    // mediaStatus: (Optional) The callback that executes to indicate status changes. (Function)

    if (typeof Audio !== "function" && typeof Audio !== "object") {
        console.warn("HTML5 Audio is not supported in this browser");
    }
    var sound = new Audio();
    sound.src = src;
    sound.addEventListener("ended", mediaSuccess, false);
    sound.load();

    return {
        // Returns the current position within an audio file (in seconds).
        getCurrentPosition: function(mediaSuccess, mediaError){ mediaSuccess(sound.currentTime); },
        // Returns the duration of an audio file (in seconds) or -1.
        getDuration: function(){ return isNaN(sound.duration) ? -1 : sound.duration; },
        // Start or resume playing an audio file.
        play: function(){ sound.play(); },
        // Pause playback of an audio file.
        pause: function(){ sound.pause(); },
        // Releases the underlying operating system's audio resources. Should be called on a ressource when it's no longer needed !
        release: function(){},
        // Moves the position within the audio file.
        seekTo: function(milliseconds){}, // TODO
        // Set the volume for audio playback (between 0.0 and 1.0).
        setVolume: function(volume){ sound.volume = volume; },
        // Start recording an audio file.
        startRecord: function(){},
        // Stop recording an audio file.
        stopRecord: function(){},
        // Stop playing an audio file.
        stop: function(){ sound.pause(); if(mediaSuccess){mediaSuccess();} } // TODO
    };
};