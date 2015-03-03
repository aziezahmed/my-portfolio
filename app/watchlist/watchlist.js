/* global angular */
(function () {
    'use strict';

    var quoteUrl = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D%22http%3A%2F%2Fdownload.finance.yahoo.com%2Fd%2Fquotes.csv%3Fs%3D[SYMBOL]%26f%3Dsnl1c1j1%26e%3D.csv%22%20and%20columns%3D%22symbol%2Cname%2Cprice%2Cchange%2Cmcap%22&format=json&diagnostics=true&callback=';

    var defaultSymbolList = ['YHOO', 'GOOG', 'MSFT', 'AAPL', 'IBM'];

    function setStocksFromLocalStorage() {
        if (localStorage.watchList) {
            return JSON.parse(localStorage.watchList);
        } else {
            return defaultSymbolList;
        }
    }

    function saveStocksInLocalStorage(stocks) {
        localStorage.watchList = JSON.stringify(stocks);
    }

    angular.module('myPortfolioApp').controller('WatchListController', function WatchListController($scope, $http) {

        $scope.stocks = setStocksFromLocalStorage();

        $scope.quotes = [];

        $scope.fetchData = function() {

            var symbolString = $scope.stocks.toString();

            if (symbolString === '') {
                $scope.quotes = {};

            } else {

                $http({
                    url: quoteUrl.replace('[SYMBOL]', encodeURI(symbolString))
                }).success(function (quotes) {
                    if (quotes.query.count === 1) {
                        $scope.quotes = new Array(quotes.query.results.row);
                    } else {
                        $scope.quotes = quotes.query.results.row;
                    }
                });

            }
        };

        $scope.changeClass = function (change) {
            if (change < 0) {
                return 'label-danger';
            } else {
                return 'label-success';
            }
        };

        $scope.deleteStock = function (quote) {
            var i = $scope.stocks.indexOf(quote.symbol);
            if(i != -1) {
                $scope.stocks.splice(i, 1);
            }

            $scope.fetchData();
            saveStocksInLocalStorage($scope.stocks);
        };

        $scope.addSymbol = function () {

            var newSymbol = $scope.symbolInput.toUpperCase();

            if($scope.stocks.indexOf(newSymbol) < 0){
                $scope.stocks.push(newSymbol);
            }
            
            $scope.symbolInput = '';

            $scope.fetchData();
            saveStocksInLocalStorage($scope.stocks);
        };

    });
})();
