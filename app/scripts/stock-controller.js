/* global angular */
angular.module('myPortfolioApp').controller('StockController', function StockController($scope, $http, $routeParams) {
    'use strict';
    $scope.quote = {};

    var quoteUrl = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22' + $routeParams.symbolId + '%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback='

    $http({
        url: quoteUrl
    }).success(function (quotes) {
        var quote = quotes.query.results.quote;
        console.info(quote);
        $scope.quote = quote;
    });

    
        
    $scope.glyphClass = function (latestPrice,prevPrice) {
        if (latestPrice < prevPrice) {
            return 'glyphicon glyphicon-arrow-down';
        } else {
            return 'glyphicon glyphicon-arrow-up';
        }
    };    
    $scope.changeClass = function (latestPrice,prevPrice) {
        if (latestPrice < prevPrice) {
            return 'label-danger';
        } else {
            return 'label-success';
        }
    };    


});