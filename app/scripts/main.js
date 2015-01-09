/* global angular */
(function () {
    'use strict';
    angular.module('myPortfolioApp', ['ngRoute', 'googlechart']).config(function ($routeProvider) {
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