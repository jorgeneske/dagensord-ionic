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
            var mimetype = $scope.vistord.video.aoshq['@attributes']['mimetype'];
            var tester = 'PC';

            if(navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)){

                if(device.platform =="Android"){
                    videoSource = $scope.vistord.video.android['0'];
                    mimetype = $scope.vistord.video.android['@attributes']['mimetype'];
                    tester = 'Android';
                }
                if(device.platform =="iPhone"){
                    videoSource = $scope.vistord.video.iphone['0'];
                    mimetype = $scope.vistord.video.iphone['@attributes']['mimetype'];
                    tester = 'iPhone';
                }
                if(device.platform =="iPad"){
                    videoSource = $scope.vistord.video.ipad['0'];
                    mimetype = $scope.vistord.video.ipad['@attributes']['mimetype'];
                    tester = 'iPad';
                }
            }
            alert(tester);

            var sourceString = "<source src='"+videoSource+"' type='"+mimetype+"'>";
            $scope.vistord['videotag'] = $sce.trustAsHtml("<video controls poster='"+imageurl + imagename+"' width='100%' height='auto'>"+sourceString+"</video>");
        }
        console.log(dagensord[0]);
        console.log($scope.vistord['image']);
        console.log($scope.vistord['videotag']);
})

.controller('SalmerCtrl', function($scope,salmer) {
    $scope.salmer = salmer;
})

.controller('VisSalmeCtrl', function($scope, $stateParams, salme, MediaSrv) {
    $scope.vistsalme = salme[0];
    $scope.vistsalme['qbrickAudio'] = decodeURIComponent($scope.vistsalme['qbrickAudio']);

    MediaSrv.loadMedia($scope.vistsalme['qbrickAudio']).then(function(media){
        $scope.mediaplay = media;
        //media.play();
    });

    $scope.playAudio = function(ev){
        $scope.mediaplay.play();
    }
    $scope.pauseAudio = function(){
        $scope.mediaplay.pause();
        }
});
