/* global angular */
angular.module('myPortfolioApp', ['ngRoute'])

.config(function ($routeProvider) {
    'use strict';
    $routeProvider.when('/', {
        controller: 'PortfolioController',
        templateUrl: 'portfolio.html'
    
    }).when('/detail/:symbolId', {
        controller: 'StockController',
        templateUrl: 'detail.html'
    
    }).otherwise({
        redirectTo: '/'
    });
});