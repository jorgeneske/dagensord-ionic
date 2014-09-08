angular.module('dagensord.controllers', [])

.controller('MainCtrl', function($scope) {
//        $scope.dagenssalme = dagenssalme[0];

})

.controller('FrontCtrl', function($scope,dagenssalme, dagenstext) {
    $scope.dagenssalme = dagenssalme[0];
    $scope.dagenstext = dagenstext[0];
})

.controller('SalmerCtrl', function($scope,salmer) {
    $scope.salmer = salmer;
})

.controller('VisSalmeCtrl', function($scope, $stateParams, salme) {
    $scope.vistsalme = salme[0];
});
