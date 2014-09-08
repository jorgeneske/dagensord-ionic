angular.module('dagensord.services',['angular-data.DSCacheFactory'])

    .factory('getData', function($http, DSCacheFactory, $q) {

        DSCacheFactory('dataCache', {
            maxAge: 90000, // Items added to this cache expire after 15 minutes.
            cacheFlushInterval: 600000, // This cache will clear itself every hour.
            deleteOnExpire: 'aggressive' // Items will be deleted from this cache right when they expire.
        });


        var items = [];
        $http({
            method: 'jsonp',
            url: 'http://77.66.32.233/php/aktualitet/dagensord_version_2/?cat=1&limit=20&callback=JSON_CALLBACK',
            cache: DSCacheFactory.get('dataCache')
        })
            .success(function(data) {
                items = data;
            })
            .error(function() {
                items = [
                    { title: 'FEJL !!!'}
                ];
            });

        return {
            all: function() {
                return items;
            },
            get: function(itemId) {
                return items[itemId];
            }
        };
    });