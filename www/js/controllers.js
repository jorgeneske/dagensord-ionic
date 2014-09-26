angular.module('dagensord.controllers', [])
.controller('MainCtrl', function($scope, $ionicModal, $http, $timeout) {

    $scope.title = '<a href="#/app/home"><img src="img/LOGO.png"></a>';

        $scope.formularData = {};

        $ionicModal.fromTemplateUrl('templates/overlay.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.formular = function() {
            $scope.modal.show();
        };

        $scope.closeFormular = function() {
            $scope.modal.hide();
        };

        $scope.sendFormular = function() {
            console.log('Sender', $scope.formularData);
            var postUrl = adminurl + "getboen.php";
            console.log(postUrl);
            $http({
                method  : 'POST',
                url     : postUrl,
                data    : $scope.formularData,//'[{ title: "test"}]',
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
                .success(function(data) {
                    console.log(data);
                });

            $timeout(function() {
                $scope.closeFormular();
            }, 1000);
        };
})

.controller('FrontCtrl', function($scope,dagenssalme, dagenstext) {
    $scope.dagenssalme = dagenssalme[0];
    $scope.dagenstext = dagenstext[0];
    if ($scope.dagenstext['image']) {
        $scope.dagenstext['image'] = "<img src='"+ imageurl + $scope.dagenstext['image']+"' alt='"+$scope.dagenstext['performer']+"'/>"
    }
})

.controller('BoennerCtrl', function($scope,boenner) {
    $scope.boenner = boenner;
        console.log(boenner);
})

.controller('VisBoenCtrl', function($scope, $stateParams, boen) {
    $scope.vistboen = boen[0];
})

.controller('OrdCtrl', function($scope,ord) {
    $scope.ord = ord;
})

.controller('VisOrdCtrl', function($scope, $stateParams, dagensord, $sce) {
    $scope.vistord = dagensord[0];
        var imagename;
        if ($scope.vistord['image']) {
            imagename = $scope.vistord['image'];
            $scope.vistord['image'] = "<img src='"+ imageurl + $scope.vistord['image']+"' alt='"+$scope.vistord['performer']+"'/>"
        }
        if ($scope.vistord['qbrick']) {
            var videoSource = $scope.vistord.video.aoshq['0'];
            var mimetype = "type='"+$scope.vistord.video.aoshq['@attributes']['mimetype']+"'";

            if(navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)){

                if(device.platform =="Android"){
                    alert('android video');
                    videoSource = $scope.vistord.video.android['0'];
                    mimetype = "";
                }
                if(device.platform == "iOS"){
                    if(device.model.match(/(iPhone)/)){
                        videoSource = $scope.vistord.video.iphone['0'];
                        alert('iphone video');
                        mimetype = "type='"+$scope.vistord.video.iphone['@attributes']['mimetype']+"'";
                    }
                    if(device.model.match(/(iPad)/)){
                        alert('iPad video');
                        videoSource = $scope.vistord.video.ipad['0'];
                        mimetype = "type='"+$scope.vistord.video.ipad['@attributes']['mimetype']+"'";
                    }
                }
                alert(device.platform+" + "+device.model);
            }

            // Beregn højden på videoen:
            var sourceString = "<source src='"+videoSource+"' "+mimetype+">";
            var compWidth = parseInt(getComputedStyle(document.getElementById('theVideoDiv')).width)-10;
            var compheight = Math.round(compWidth*0.5625);

            console.log(compWidth, compheight)

            $scope.vistord['videotag'] = $sce.trustAsHtml("<video id='theVideo'style='margin-bottom:-5px' autobuffer controls width="+compWidth+" height="+compheight+" poster='"+imageurl + imagename+"'>"+sourceString+"</video>");
        }
        console.log(dagensord[0]);
        console.log($scope.vistord['image']);
        console.log($scope.vistord['videotag']);

        $scope.playVideo = function(){
            //alert('play');
            var video = document.getElementById("theVideo");
            video.addEventListener('click', function(){video.play()}, false);
            //alert(video);
        }

    })

.controller('SalmerCtrl', function($scope,salmer) {
    $scope.salmer = salmer;
})

.controller('VisSalmeCtrl', function($scope, $stateParams, salme, MediaSrv) {
    $scope.vistsalme = salme[0];
    $scope.vistsalme['qbrickAudio'] = decodeURIComponent($scope.vistsalme['qbrickAudio']);

    MediaSrv.loadMedia($scope.vistsalme['qbrickAudio']).then(function(media){
        $scope.mediaplay = media;
    });

    $scope.playAudio = function(ev){
        $scope.mediaplay.play();
    }
    $scope.pauseAudio = function(){
        $scope.mediaplay.pause();
        }
    $scope.stopAudio = function(){
        $scope.mediaplay.stop();
        clearInterval(mediaTimer);
        mediaTimer = null;
    }
});
