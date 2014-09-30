angular.module('dagensord.controllers', [])
.controller('MainCtrl', function($scope, $ionicModal, $http, $timeout, $ionicLoading,$ionicSlideBoxDelegate, getData) {

    $scope.title = '<a href="#/app/home"><img src="img/LOGO.png"></a>';

        $scope.showload = function() {
            $ionicLoading.show({
                content: 'Loading Data',
                animation: 'fade-in',
                showBackdrop: false,
                maxWidth: 200,
                showDelay: 0
            });
        };
        $scope.hideload = function(){
            $ionicLoading.hide();
        };
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
            //console.log('Sender', $scope.formularData);
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

        $scope.soeg = {};

        $scope.sendSoeg = function(q) {
            if ($scope.soeg[q]) {
                location.href = "#/app/soeg"+q+"/" + $scope.soeg[q];
            }
        };


})

.controller('FrontCtrl', function($scope,dagenssalme, dagenstext) {
    $scope.dagenssalme = dagenssalme[0];
    $scope.dagenstext = dagenstext[0];
    if ($scope.dagenstext['image']) {
        $scope.dagenstext['image'] = "<img src='"+ imageurl + $scope.dagenstext['image']+"' alt='"+$scope.dagenstext['performer']+"'/>"
    }
})

.controller('BoennerCtrl', function($scope, boenner, $ionicSlideBoxDelegate, getData) {
        $scope.boenner = boenner;

        $scope.boenneSlideChange = function(i){
            console.log('slide change', i);
            var current = i;
            var end = $ionicSlideBoxDelegate.slidesCount()-1;
            if(current == end){
                console.log('this is the end');
                $scope.showload();
                var loadString = ''+(current+1)+',10';
                console.log(loadString);
                getData.all(3, loadString).then(
                    function(newboenner) {
                        //$scope.ord = ord;
                        $scope.hideload();
                        console.log(newboenner, $scope.boenner);
                        $scope.boenner = $scope.boenner.concat(newboenner);
                        console.log($scope.boenner);
                        $ionicSlideBoxDelegate.update();
                    }
                )

            }
        }

})

.controller('VisBoenCtrl', function($scope, $stateParams, boen) {
    $scope.vistboen = boen[0];
})

//.controller('OrdCtrl', function($scope, ord) {
//        $scope.ord = ord;
//})

.controller('OrdCtrl', function($scope, getData) {
    $scope.showload();

    getData.all(2).then(
        function(ord) {
            $scope.ord = ord;
            for (i = 0; i < ord.length; ++i) {
                ord[i]['image'] = '<img src="'+imageurl+ord[i]['image']+'" alt="'+ord[i]['performer']+'" />';
            }
            $scope.hideload();
        }
    )

})

.controller('SoegTextCtrl', function($scope, $stateParams, getData) {
    $scope.showload();

    getData.soeg(2,encodeURIComponent($stateParams.soeg)).then(
        function(ord) {
            $scope.ord = ord;
            for (i = 0; i < ord.length; ++i) {
                if(ord[i]['image']) {
                    ord[i]['image'] = '<img src="' + imageurl + ord[i]['image'] + '" alt="' + ord[i]['performer'] + '" />';
                }
            }
            $scope.hideload();
        }
    )

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
                    videoSource = $scope.vistord.video.android['0'];
                    mimetype = "";
                }
                if(device.platform == "iOS"){
                    if(device.model.match(/(iPhone)/)){
                        videoSource = $scope.vistord.video.iphone['0'];
                        mimetype = "type='"+$scope.vistord.video.iphone['@attributes']['mimetype']+"'";
                    }
                    if(device.model.match(/(iPad)/)){
                        videoSource = $scope.vistord.video.ipad['0'];
                        mimetype = "type='"+$scope.vistord.video.ipad['@attributes']['mimetype']+"'";
                    }
                }
            }

            // Beregn højden på videoen:
            var sourceString = "<source src='"+videoSource+"' "+mimetype+">";
            var compWidth = parseInt(getComputedStyle(document.getElementById('theVideoDiv')).width)-10;
            var compheight = Math.round(compWidth*0.5625);

            console.log(compWidth, compheight);

            $scope.vistord['videotag'] = $sce.trustAsHtml("<video id='theVideo'style='margin-bottom:-5px' autobuffer controls width="+compWidth+" height="+compheight+" poster='"+imageurl + imagename+"'>"+sourceString+"</video>");
        };


        console.log(dagensord[0]);
        console.log($scope.vistord['image']);
        console.log($scope.vistord['videotag']);

        $scope.playVideo = function(){
            var video = document.getElementById("theVideo");
            video.addEventListener('click', function(){video.play()}, false);
        }

    })

.controller('SalmerCtrl', function($scope, salmer) {
        $scope.salmer = salmer;
})

.controller('VisSalmeCtrl', function($scope, $stateParams, salme, MediaSrv, $ionicPlatform) {

    var playbt = document.getElementById("playbutton");
    var pausebt = document.getElementById("pausebutton");
    var stopbt = document.getElementById("stopbutton");

    $scope.vistsalme = salme[0];
    $scope.vistsalme['qbrickAudio'] = decodeURIComponent($scope.vistsalme['qbrickAudio']);

    MediaSrv.loadMedia($scope.vistsalme['qbrickAudio']).then(function(media){
        $scope.mediaplay = media;
    });

    $scope.playAudio = function(ev){
        //$scope.showload();
        playbt.style.display = "none";
        pausebt.style.display = "inline";
        stopbt.style.display = "inline";
        $scope.mediaplay.play();
    }
    $scope.pauseAudio = function(){
        playbt.style.display = "inline";
        pausebt.style.display = "none";
        stopbt.style.display = "inline";
        $scope.mediaplay.pause();
        }
    $scope.stopAudio = function(){
        playbt.style.display = "inline";
        pausebt.style.display = "none";
        stopbt.style.display = "none";
        $scope.mediaplay.stop();
        clearInterval(mediaTimer);
        mediaTimer = null;
    }
        $ionicPlatform.ready(function() {
            if(!navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)){
                var share = document.getElementById("share");
                var webshare = document.getElementById("webshare");
                share.style.display = "none";
                webshare.style.display = "inline";
            }
        });

});
