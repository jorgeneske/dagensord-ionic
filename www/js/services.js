angular.module('dagensord.services',['angular-data.DSCacheFactory'])

    .factory('getData', function($http, DSCacheFactory, $q) {

        DSCacheFactory('dataCache', {
            maxAge: 90000, // Items added to this cache expire after 15 minutes.
            cacheFlushInterval: 600000, // This cache will clear itself every hour.
            deleteOnExpire: 'aggressive' // Items will be deleted from this cache right when they expire.
        });

        var items = [];

//        $http.jsonp('http://77.66.32.233/php/aktualitet/dagensord_version_2/?cat=1&limit=20&callback=JSON_CALLBACK', {
//            cache: DSCacheFactory.get('dataCache')
//        }).success(function (data) {
//            items = data;
//        })
//          .error(function () {
//
//          });

        var items = [
            { id: 0, title: 'Blomstre som en rosengård' },
            { id: 1, title: 'I østen stiger solen op' },
            { id: 2, title: 'Jeg ved en lærkerede' },
            { id: 3, title: 'Der er et yndigt land' }
        ];

        return {
            all: function () {
                return items;
            },
            get: function () {

            }
        };
    });