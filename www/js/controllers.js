angular.module('dagensord.controllers', [])
.controller('MainCtrl', function($scope, $ionicModal, $http, $timeout, $ionicLoading,$ionicSlideBoxDelegate, getData, $ionicPlatform) {

    $scope.title = '<a href="#/app/home"><img src="img/LOGO.png"></a>';

        $scope.boennerHandler = {
            // Variabler til at styre load og unload af bønner
            maxLength:50, // Hvor mange bønner må der ligge i slideren
            startIndex:0, // Styrer hvor man er i bønner i backenden
            loadAmount:20, // Hvor mange hentes ad gangnen, når man når til vejs ende (og hvor mange smides ud i den anden ende)
            preloadSlide:2, // Hvor mange slides før enden kaldes de nye (1 = sidste slide // 2 = sliden før osv.) OBS: Gælder kun opad
            currentBoen:0, // Holder styr på hvor vi er i samlede bønne liste
            onChangeUpdate:true // Sættes til 'false' hvis der skal skiftes plads i slideren når der smides bønner ud

        }

        $scope.mereHandler = {
            // Variabler til at styre load og unload af mere
            maxLength:3, // Hvor mange må der ligge i slideren
            startIndex:0, // Styrer hvor man er i backenden
            loadAmount:3, // Hvor mange hentes ad gangnen, når man når til vejs ende (og hvor mange smides ud i den anden ende)
            preloadSlide:2, // Hvor mange slides før enden kaldes de nye (1 = sidste slide // 2 = sliden før osv.) OBS: Gælder kun opad
            currentMere:0, // Holder styr på hvor vi er i samlede liste
            onChangeUpdate:true // Sættes til 'false' hvis der skal skiftes plads i slideren når der smides bønner ud

        }

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
            var postUrl = adminurl + "getboen.php";
            if ($scope.formularData.text!=undefined) {
                $http({
                    method: 'POST',
                    url: postUrl,
                    data: $scope.formularData,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                })
                    .success(function () {
                        $scope.formularData = {};
                        $scope.closeFormular();
                        cordova.plugins.Keyboard.close();
                        location.href = "#/app/ok";
                    })
                    .error(function (data, status, headers, config) {
                        alert("Der er desværre gået noget galt - prøv igen");
                    });
            }
            else {
                $scope.closeFormular();
            }
        };

        $scope.soeg = {};

        $scope.sendSoeg = function(q) {
            if ($scope.soeg[q]) {
                if(window.cordova) {
                    cordova.plugins.Keyboard.close();
                }
                location.href = "#/app/soeg"+q+"/" + $scope.soeg[q];
            }
        };


})

.controller('FrontCtrl', function($scope,dagenssalme, dagenstext) {
    //alert("W: "+window.screen.availWidth+" H: "+window.screen.availHeight);
    $scope.dagenssalme = dagenssalme[0];
    $scope.dagenstext = dagenstext[0];
    if ($scope.dagenstext['image']) {
        $scope.dagenstext['image'] = "<img src='"+ $scope.dagenstext['image']+"' alt='"+$scope.dagenstext['performer']+"'/>"
    }
})

.controller('BoennerCtrl', function($scope, $ionicSlideBoxDelegate, getData) {

        if(!$scope.boenner){ // Hvis der ikke er hentet bønner endnu:
            //console.log('load first boenner');
            getData.all(3, $scope.boennerHandler.loadAmount).then(
                function(loadBoenner){
                    $scope.boenner = loadBoenner;
                    $ionicSlideBoxDelegate.update();
                }
            );
        }

        $scope.boenneGoRight = function(){
            //console.log('boenne go right');
            $ionicSlideBoxDelegate.next();
        }
        $scope.boenneGoLeft = function(){
            //console.log('boenne go left');
            $ionicSlideBoxDelegate.previous();
        }

        $scope.boenneSlideChange = function(i){ // Hver gang der blades i bønne slider:
            if($scope.boennerHandler.onChangeUpdate){
                // 'onChangeUpdate' sættes til 'false' når man skifter plads i slider efter af have smidt bønner ud så denne funktion kun køres ved swipes
                //console.log('slide change', i);
                var current = i;
                var end = $ionicSlideBoxDelegate.slidesCount()-$scope.boennerHandler.preloadSlide;

                $scope.boennerHandler.currentBoen = $scope.boennerHandler.startIndex + current;

                if(current == end){ // Så er vi på vej opad
                    //console.log('this is the end', current);
                    $scope.showload();
                    var loadString = ''+($scope.boennerHandler.currentBoen+$scope.boennerHandler.preloadSlide)+','+$scope.boennerHandler.loadAmount;
                    console.log(loadString);

                    getData.all(3, loadString).then(
                        function(newboenner) {
                            console.log(newboenner);
                            $scope.hideload();
                            $scope.boenner = $scope.boenner.concat(newboenner);
                            $ionicSlideBoxDelegate.update();

                            if($ionicSlideBoxDelegate.slidesCount() > $scope.boennerHandler.maxLength){
                                throwOut(current - $scope.boennerHandler.loadAmount, true);
                                $scope.boennerHandler.startIndex += $scope.boennerHandler.loadAmount;
                            }
                        }
                    )
                }
                if(current == 0){ // så er vi på vej nedad
                    //console.log('this is the beginning', $scope.boennerHandler.startIndex);
                    if($scope.boennerHandler.startIndex > 0){
                        $scope.showload();
                        var loadString;
                        if($scope.boennerHandler.startIndex-$scope.boennerHandler.loadAmount==0){
                            loadString=$scope.boennerHandler.loadAmount;
                        }else{
                            loadString = ''+($scope.boennerHandler.startIndex-$scope.boennerHandler.loadAmount)+','+$scope.boennerHandler.loadAmount;
                        }
                        console.log(loadString);

                        getData.all(3, loadString).then(
                            function(newboenner) {
                                //console.log(newboenner);

                                $scope.hideload();
                                //var tempArray = newboenner.concat($scope.boenner);
                                $scope.boenner = newboenner.concat($scope.boenner);
                                $ionicSlideBoxDelegate.update();
                                $scope.boennerHandler.startIndex -= $scope.boennerHandler.loadAmount;

                                throwOut($scope.boenner.length - $scope.boennerHandler.loadAmount, false);
                            }
                        )
                    }

                }

                var throwOut = function(start, upwards){ // Til at smide bønner ud

                    //console.log('throw out', start)
                    if(upwards){ // så er vi på vej opad
                        $scope.boenner.splice(0, $scope.boennerHandler.loadAmount);
                    }else{ // Så er vi på vej nedad
                        $scope.boenner.splice($scope.boenner.length - $scope.boennerHandler.loadAmount);
                    }
                    $ionicSlideBoxDelegate.update();
                    $scope.boennerHandler.onChangeUpdate = false;
                    if(upwards){
                        $ionicSlideBoxDelegate.slide(current - $scope.boennerHandler.loadAmount, 1);
                    }else{
                        $ionicSlideBoxDelegate.slide(current + $scope.boennerHandler.loadAmount, 1);
                    }
                    $scope.boennerHandler.onChangeUpdate = true;

                    setTimeout(function(){
                        $ionicSlideBoxDelegate.update();
                    }, 500)


                }
            }
        }

})


.controller('OrdCtrl', function($scope, getData) {
        $scope.moreOrd = true;

        // Dagens Ord liste view  fodres med data fra globale variabler
        $scope.ord = getData.ord;
        $scope.moreOrd = getData.moreOrdInDB;


        $scope.loadMoreOrd = function () {

            var loadString;
            if (getData.ord.length < 1) {
                loadString = '20';
            } else {
                loadString = '' + (getData.ord.length + 1) + ',20';
            }
            getData.all(2, loadString).then(
                function (ord) {

                    if(ord.length > 0 && !ord[0].emptyfield){
                        // Billed fil navn sættes ind i et ordentligt billed tag:
                        for (var i = 0; i < ord.length; ++i) {
                            ord[i]['image'] = '<img src="'+ord[i]['image']+'" alt="'+ord[i]['performer']+'" />';
                        }

                        // Hvis der er mindst ét ordentligt item i DB
                        getData.ord = getData.ord.concat(ord);
                        $scope.$broadcast('scroll.infiniteScrollComplete');

                        $scope.ord = getData.ord;
                    }else{
                        // Hvis der kommer 0 items tilbage eller 1 item med emptyfield = true;
                        $scope.moreOrd = getData.moreOrdInDB = false;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }
                }
            )
        }

/*
    $scope.showload();

    getData.all(2).then(
        function(ord) {
            $scope.ord = ord;
            for (i = 0; i < ord.length; ++i) {
                ord[i]['image'] = '<img src="'+ord[i]['image']+'" alt="'+ord[i]['performer']+'" />';
            }
            $scope.hideload();
        }
    )

*/


})

.controller('SoegTextCtrl', function($scope, $stateParams, getData) {
    $scope.showload();

    getData.soeg(2,encodeURIComponent($stateParams.soeg)).then(
        function(ord) {
            $scope.ord = ord;
            for (i = 0; i < ord.length; ++i) {
                if(ord[i]['image']) {
                    ord[i]['image'] = '<img src="' + ord[i]['image'] + '" alt="' + ord[i]['performer'] + '" />';
                }
            }
            $scope.hideload();
        }
    )

})

//.controller('SoegTextCtrl', function($scope, $stateParams, getData) {
//        $scope.moreOrd = true;
//
//        // Dagens Ord liste view  fodres med data fra globale variabler
//        $scope.ord = getData.ord;
//        $scope.moreOrd = getData.moreOrdInDB;
//
//
//        $scope.loadMoreOrd = function () {
//
//            var loadString;
//            if (getData.ord.length < 1) {
//                loadString = '20';
//            } else {
//                loadString = '' + (getData.ord.length + 1) + ',20';
//            }
//            getData.soeg(2, encodeURIComponent($stateParams.soeg), loadString).then(
//                function (ord) {
//
//                    if (ord.length > 0 && !ord[0].emptyfield) {
//                        // Billed fil navn sættes ind i et ordentligt billed tag:
//                        for (var i = 0; i < ord.length; ++i) {
//                            ord[i]['image'] = '<img src="' + ord[i]['image'] + '" alt="' + ord[i]['performer'] + '" />';
//                        }
//
//                        // Hvis der er mindst ét ordentligt item i DB
//                        getData.ord = getData.ord.concat(ord);
//                        $scope.$broadcast('scroll.infiniteScrollComplete');
//
//                        $scope.ord = getData.ord;
//                    } else {
//                        // Hvis der kommer 0 items tilbage eller 1 item med emptyfield = true;
//                        $scope.moreOrd = getData.moreOrdInDB = false;
//                        $scope.$broadcast('scroll.infiniteScrollComplete');
//                    }
//                }
//            )
//        }
//})

.controller('OmCtrl', function($scope, getData) {
    $scope.showload();
    getData.about(apptype).then(
        function(om) {
            $scope.about = om[0];
            console.log($scope.about);
            $scope.hideload();
        }
    )

})

.controller('VisOrdCtrl', function($scope, $stateParams, dagensord, $sce, $ionicPlatform) {
        //$ionicPlatform.ready(function() {
        //    if(!navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)){
        //        var share = document.getElementById("share");
        //        var webshare = document.getElementById("webshare");
        //        share.style.display = "none";
        //        webshare.style.display = "inline";
        //    }
        //});
    $scope.vistord = dagensord[0];
        var imagename;
        if ($scope.vistord['image']) {
            imagename = $scope.vistord['image'];
            $scope.vistord['image'] = "<img src='"+ $scope.vistord['image']+"' alt='"+$scope.vistord['performer']+"'/>"
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

            $scope.vistord['videotag'] = $sce.trustAsHtml("<video id='theVideo'style='margin-bottom:-5px' autobuffer controls width="+compWidth+" height="+compheight+" poster='"+ imagename+"'>"+sourceString+"</video>");
        }
        console.log(dagensord[0]);
        console.log($scope.vistord['image']);
        console.log($scope.vistord['videotag']);

        $scope.playVideo = function(){
            var video = document.getElementById("theVideo");
            video.addEventListener('click', function(){video.play()}, false);
        }

    })

.controller('SalmerCtrl', function ($scope, getData) {

        $scope.moreSalmer = true;

        // Salme liste view  fodres med data fra globale variabler
        $scope.salmer = getData.salmer;
        $scope.moreSalmer = getData.moreSalmerInDB;


    $scope.loadMoreSalmer = function () {

        var loadString;
        if (getData.salmer.length < 1) {
            loadString = '20';
        } else {
            loadString = '' + (getData.salmer.length + 1) + ',20';
        }
        getData.all(1, loadString).then(
            function (salmer) {
                if(salmer.length > 0 && !salmer[0].emptyfield){
                    // Hvis der er mindst ét ordentligt item i DB
                    for (i = 0; i < salmer.length; ++i) {
                        if (salmer[i]['nr']!=undefined && salmer[i]['nr']!="" ) {
                            salmer[i]['nr'] = "Salme nr: "+salmer[i]['nr'];
                        }
                    }
                    getData.salmer = getData.salmer.concat(salmer);
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                    $scope.salmer = getData.salmer;
                }else{
                    // Hvis der kommer 0 items tilbage eller 1 item med emptyfield = true;
                    $scope.moreSalmer = getData.moreSalmerInDB = false;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
            }
        )
    }
})

    .controller('SoegSalmeCtrl', function($scope, $stateParams, getData) {
        $scope.showload();

        getData.soeg(1,encodeURIComponent($stateParams.soeg)).then(
            function(salmer) {
                for (i = 0; i < salmer.length; ++i) {
                    if (salmer[i]['nr']!=undefined && salmer[i]['nr']!="" ) {
                        salmer[i]['nr'] = "Salme nr: "+salmer[i]['nr'];
                    }
                }
                $scope.salmer = salmer;
                $scope.hideload();
            }
        )
    })

.controller('SoegSalmeCtrl_temp', function ($scope, $stateParams, getData) {

    $scope.moreSalmer = true;

    // Salme liste view  fodres med data fra globale variabler
    $scope.salmer = getData.salmer;
    $scope.moreSalmer = getData.moreSalmerInDB;


    $scope.loadMoreSalmer = function () {

        var loadString;
        if (getData.salmer.length < 1) {
            loadString = '20';
        } else {
            loadString = '' + (getData.salmer.length + 1) + ',20';
        }
        getData.soeg(1,encodeURIComponent($stateParams.soeg), loadString).then(
            function (salmer) {
                if(salmer.length > 0 && !salmer[0].emptyfield){
                    // Hvis der er mindst ét ordentligt item i DB
                    getData.salmer = getData.salmer.concat(salmer);
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                    $scope.salmer = getData.salmer;
                }else{
                    // Hvis der kommer 0 items tilbage eller 1 item med emptyfield = true;
                    $scope.moreSalmer = getData.moreSalmerInDB = false;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
            }
        )
    }
})

.controller('VisSalmeCtrl', function($scope, $stateParams, salme, MediaSrv, $ionicPlatform, getData) {

    var playbt = document.getElementById("playbutton");
    var pausebt = document.getElementById("pausebutton");
    var stopbt = document.getElementById("stopbutton");

    $scope.vistsalme = salme[0];
    $scope.vistsalme['qbrickAudio'] = decodeURIComponent($scope.vistsalme['qbrickAudio']);

    var id=$scope.vistsalme['id'];

    MediaSrv.loadMedia($scope.vistsalme['qbrickAudio']).then(function(media){
        getData.resetSounds[0] = media;
    });

    $scope.playAudio = function(ev){
        playbt.style.display = "none";
        pausebt.style.display = "inline";
        stopbt.style.display = "inline";
        getData.resetSounds[0].play();
    }
    $scope.pauseAudio = function(){
        playbt.style.display = "inline";
        pausebt.style.display = "none";
        stopbt.style.display = "inline";
        getData.resetSounds[0].pause();
        }
    $scope.stopAudio = function(){
        playbt.style.display = "inline";
        pausebt.style.display = "none";
        stopbt.style.display = "none";
        getData.resetSounds[0].stop();
        clearInterval(mediaTimer);
        mediaTimer = null;
    }

        $scope.shareViaSMS = function() {
            var sms = 'Jeg har fundet salmen "'+$scope.vistsalme['title']+'" på Dagens Ord.\n\nDu kan høre den via dette link:\n\nhttp://dagensord.folkekirken.dk/?salme='+$scope.vistsalme['id'];
            window.plugins.socialsharing.shareViaSMS(sms, null, function(msg) {console.log('ok: ' + msg)}, function() {alert('Det er ikke muligt at dele via sms på denne enhed')});
        };

        $scope.shareViaFacebook = function() {
            var fbmessage = 'Jeg har fundet salmen "'+$scope.vistsalme['title']+'" på Dagens Ord.\nDu kan høre den via dette link:';
            var fblink = "http://dagensord.folkekirken.dk/?salme="+$scope.vistsalme['id'];
            window.plugins.socialsharing.shareViaFacebook(fbmessage, null /* img */, fblink, function() {console.log('share ok')}, function(){alert('Det er ikke muligt at dele via Facebook på denne enhed')})
        };

        $scope.shareViaTwitter = function() {
            var twittermessage = 'Jeg har fundet salmen "'+$scope.vistsalme['title']+'" på Dagens Ord.\nDu kan høre den via dette link:';
            var twitterlink = "http://dagensord.folkekirken.dk/?salme="+$scope.vistsalme['id'];
            window.plugins.socialsharing.shareViaTwitter(twittermessage, null /* img */, twitterlink, function() {console.log('share ok')}, function(){alert('Det er ikke muligt at dele via Twitter på denne enhed')})
        };

        //$ionicPlatform.ready(function() {
        //    if(!navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)){
        //        var share = document.getElementById("share");
        //        var webshare = document.getElementById("webshare");
        //        share.style.display = "none";
        //        webshare.style.display = "inline";
        //    }
        //});

})

.controller('MereCtrl', function($scope, $stateParams, $ionicSlideBoxDelegate, getData,MediaSrv) {

    var playbt = document.getElementById("playbutton");
    var pausebt = document.getElementById("pausebutton");
    var stopbt = document.getElementById("stopbutton");

    if(!$scope.mere){ // Hvis der ikke er hentet endnu:
        getData.all(4, $scope.mereHandler.loadAmount).then(
            function(loadMere){
                $scope.mere = loadMere;
                for (i = 0; i < loadMere.length; ++i) {
                    loadMere[i]['qbrickAudio'] = decodeURIComponent(loadMere[i]['qbrickAudio']);
                    MediaSrv.loadMedia(loadMere[i]['qbrickAudio']).then(function(media){
                        getData.moreSounds.push(media);
                    });
                }
                $ionicSlideBoxDelegate.update();

            }
        );
    }

    $scope.myActiveSlide = $stateParams.slide;

    $scope.slideChange = function(){
        playbt.style.display = "inline";
        pausebt.style.display = "none";
        stopbt.style.display = "none";
    }

    $scope.mereGoRight = function(){
        playbt.style.display = "inline";
        pausebt.style.display = "none";
        stopbt.style.display = "none";
        $ionicSlideBoxDelegate.next();
    }
    $scope.mereGoLeft = function(){
        playbt.style.display = "inline";
        pausebt.style.display = "none";
        stopbt.style.display = "none";
        $ionicSlideBoxDelegate.previous();
    }

    $scope.playAudio = function(ev){
        playbt.style.display = "none";
        pausebt.style.display = "inline";
        stopbt.style.display = "inline";
        for (i = 0; i < getData.moreSounds.length; ++i) {
            getData.moreSounds[i].stop();
        }
        getData.moreSounds[$ionicSlideBoxDelegate.currentIndex()].play();
    }
    $scope.pauseAudio = function(){
        playbt.style.display = "inline";
        pausebt.style.display = "none";
        stopbt.style.display = "inline";
        getData.moreSounds[$ionicSlideBoxDelegate.currentIndex()].pause();
    }
    $scope.stopAudio = function(){
        playbt.style.display = "inline";
        pausebt.style.display = "none";
        stopbt.style.display = "none";
        getData.moreSounds[$ionicSlideBoxDelegate.currentIndex()].stop();
        clearInterval(mediaTimer);
        mediaTimer = null;
    }
})
