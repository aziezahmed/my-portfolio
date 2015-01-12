/* global angular */
(function () {
    'use strict';
    angular.module('myPortfolioApp', ['ngRoute', 'ngTouch', 'googlechart']).config(function ($routeProvider) {
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
})();