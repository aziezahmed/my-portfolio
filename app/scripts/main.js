/* global angular */

angular.module('myPortfolioApp', ['ngRoute', "googlechart"]).config(function ($routeProvider) {
    'use strict';
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