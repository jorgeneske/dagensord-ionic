angular.module('dagensord.controllers', ['ngAudio'])
.controller('MainCtrl', function($scope) {
    $scope.title = '<a href="#/app/home"><img src="img/LOGO.png"></a>';
        $scope.test = function() {
            var element =
                'Navigator '+navigator.userAgent+ '\n' +
                    'Device Name: '     + device.name     + '\n' +
                    'Device Cordova: '  + device.cordova + '\n' +
                    'Device Platform: ' + device.platform + '\n' +
                    'Device UUID: '     + device.uuid     + '\n' +
                    'Device Model: '    + device.model     + '\n' +
                    'Device Version: '  + device.version  + '\n';
            alert("Properties:\n"+element);
        }
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
})

.controller('SalmerCtrl', function($scope,salmer) {
    $scope.salmer = salmer;
})

.controller('VisSalmeCtrl', function($scope, $stateParams, salme, ngAudio) {
    $scope.vistsalme = salme[0];
    $scope.vistsalme['qbrickAudio'] = decodeURIComponent($scope.vistsalme['qbrickAudio']);
//    $scope.audio = ngAudio.load($scope.vistsalme['qbrickAudio']);
//        $scope.audio = new Media($scope.vistsalme['qbrickAudio']);
});
