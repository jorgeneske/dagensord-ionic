angular.module('dagensord.services',[])

    .factory('getData', function($http, $q) {
        return {
            all: function(cat,limit) {
                limit = limit || 15;
                var url = adminurl+'?cat='+cat+'&limit='+limit+'&callback=JSON_CALLBACK';
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
                var url = adminurl+"?itemid="+id+"&callback=JSON_CALLBACK";
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
                var url = adminurl+"?dagens="+cat+"&callback=JSON_CALLBACK";
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
            }
        };
    })