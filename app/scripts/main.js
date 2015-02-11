/* global angular */
(function () {
    'use strict';
    angular.module('myPortfolioApp', ['ngRoute', 'ngTouch', 'googlechart']);

    angular.module('myPortfolioApp').config(function ($routeProvider) {
        $routeProvider.when('/', {
            controller: 'OverviewController',
            templateUrl: 'overview.html'

        }).when('/detail/:symbolId', {
            controller: 'DetailController',
            templateUrl: 'detail.html'

        }).otherwise({
            redirectTo: '/'
        });
    });

    angular.module('myPortfolioApp').config(function ($compileProvider) {
        $compileProvider.debugInfoEnabled(false);
    });


    angular.module('myPortfolioApp').controller('NavController', function NavController($scope, $route, $location) {
        $scope.getClass = function(param){
            if (param == $location.path()){
                return "active";
            }
        }
    });

})();