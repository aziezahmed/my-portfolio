/* global angular */
(function () {
    'use strict';

    var quoteUrl = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D%22http%3A%2F%2Fdownload.finance.yahoo.com%2Fd%2Fquotes.csv%3Fs%3D[SYMBOL]%26f%3Dsnl1c1%26e%3D.csv%22%20and%20columns%3D%22symbol%2Cname%2Cprice%2Cchange%22&format=json&diagnostics=true&callback=';
    
    var defaultSymbolList = {
        'YHOO': {
            shares: 100,
            purchasePrice: 40
        },
        'GOOG': {
            shares: 50,
            purchasePrice: 270
        },
        'MSFT': {
            shares: 150,
            purchasePrice: 47
        }
    };

    function setStocksFromLocalStorage() {
        if (localStorage.symbolList) {
            return JSON.parse(localStorage.symbolList);
        } else {
            return defaultSymbolList;
        }
    }

    function saveStocksInLocalStorage(stocks) {
        localStorage.symbolList = JSON.stringify(stocks);
    }


    angular.module('myPortfolioApp').controller('OverviewController', function OverviewController($scope, $http) {

        $scope.stocks = setStocksFromLocalStorage();

        $scope.quotes = [];

        $scope.fetchData = function() {
            
            var symbolString = Object.keys($scope.stocks).join(',');

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

        $scope.gainLossClass = function (symbol, price) {
            if ($scope.gainLoss(symbol, price) < 0) {
                return 'label-danger';
            } else {
                return 'label-success';
            }
        };

        $scope.numberOfShares = function (symbol) {
            if ($scope.stocks[symbol]) {
                return $scope.stocks[symbol].shares;
            }
        };

        $scope.purchasePrice = function (symbol) {
            if ($scope.stocks[symbol]) {
                return $scope.stocks[symbol].purchasePrice;
            }
        };

        $scope.marketValue = function (symbol, price) {
            if ($scope.stocks[symbol]) {
                if ($scope.stocks[symbol].shares) {
                    return ($scope.stocks[symbol].shares * (price / 100));
                }
            }
        };

        $scope.gainLoss = function (symbol, price) {
            if ($scope.stocks[symbol]) {
                return ($scope.marketValue(symbol, price) - $scope.stocks[symbol].purchasePrice);
            }
        };

        $scope.totalPortfolioValue = function () {
            var totalPortfolioValue = 0;
            var count = $scope.quotes.length;

            for (var i = 0; i < count; i++) {
                if ($scope.stocks[$scope.quotes[i].symbol]) {
                    if ($scope.stocks[$scope.quotes[i].symbol].shares) {
                        totalPortfolioValue += $scope.stocks[$scope.quotes[i].symbol].shares * ($scope.quotes[i].price / 100);
                    }
                }
            }

            return totalPortfolioValue;
        };

        $scope.deleteStock = function (quote) {
            delete $scope.stocks[quote.symbol];
            $scope.fetchData();
            saveStocksInLocalStorage($scope.stocks);
        };

        $scope.editStock = function (quote) {
            $scope.symbolInput = quote.symbol;
            $scope.numberOfSharesInput = $scope.stocks[quote.symbol].shares;
            $scope.purchasePriceInput = $scope.stocks[quote.symbol].purchasePrice;
        };

        $scope.addSymbol = function () {
            $scope.stocks[$scope.symbolInput.toUpperCase()] = {
                shares: $scope.numberOfSharesInput,
                purchasePrice: $scope.purchasePriceInput
            };

            $scope.symbolInput = '';
            $scope.numberOfSharesInput = '';
            $scope.purchasePriceInput = '';

            $scope.fetchData();
            saveStocksInLocalStorage($scope.stocks);
        };

    });
})();