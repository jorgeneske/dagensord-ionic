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

.controller('VisOrdCtrl', function($scope, $stateParams, dagensord) {
    $scope.vistord = dagensord[0];
        if ($scope.vistord['image']) {
            $scope.vistord['image'] = "<img src='"+ imageurl + $scope.vistord['image']+"' alt='"+$scope.vistord['performer']+"'/>"
        }
        console.log(dagensord[0]);
        console.log($scope.vistord['image']);
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
