/* global angular */
angular.module('myPortfolioApp', [])
    .controller('PortfolioController', ['$scope', '$http',
        function ($scope, $http) {
            'use strict';
            $scope.stocks = [
                {
                    symbol: 'YHOO',
                    shares: 100
                }
            ];

            if (localStorage.stocks) {
                $scope.stocks = [];
                var storred = JSON.parse(localStorage.stocks);
                var numberOfSymbols = storred.length;

                for (var i = 0; i < numberOfSymbols; i++) {
                    $scope.stocks.push({
                        symbol: storred[i].symbol,
                        shares: storred[i].shares
                    });
                }
            }

            function storeStocks() {
                localStorage.stocks = JSON.stringify($scope.stocks);
            }

            function fetchData() {
                var quoteUrlPrefix = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quote%20where%20symbol%20in%20(';
                var quoteUrlSuffix = ')&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
                var noOfSymbols = $scope.stocks.length;
                var symbolString = '';

                for (var i = 0; i < noOfSymbols; i++) {
                    symbolString += '"';
                    symbolString += $scope.stocks[i].symbol;
                    symbolString += '"';
                    if (i + 1 !== noOfSymbols) {
                        symbolString += ',';
                    }
                }

                var quoteUrl = quoteUrlPrefix + encodeURI(symbolString) + quoteUrlSuffix;

                $http({
                    url: quoteUrl
                }).success(function (quotes) {

                    var list = quotes.query.results.quote;

                    if (!(list instanceof Array)) {
                        list = new Array(list);
                    }

                    var noOfQuotes = list.length;

                    var totalPrice = 0;

                    for (var i = 0; i < noOfQuotes; i++) {

                        $scope.stocks[i].symbol = list[i].Symbol;

                        $scope.stocks[i].change = list[i].Change;
                        $scope.stocks[i].name = list[i].Name;

                        $scope.stocks[i].price = list[i].LastTradePriceOnly;
                        var price = ($scope.stocks[i].price * $scope.stocks[i].shares) / 100;

                        $scope.stocks[i].value = price;
                        totalPrice += price;
                    }

                    $scope.curr = totalPrice;

                });
            }

            $scope.changeClass = function (change) {
                if (change < 0){
                    return 'label-danger';
                }
                else {
                    return 'label-success';
                }
            };

            $scope.deleteStock = function (param) {
                var noOfSymbols = $scope.stocks.length;

                var deleteIndex = -1;

                for (var i = 0; i < noOfSymbols; i++) {
                    if ($scope.stocks[i].$$hashKey === param.$$hashKey) {
                        deleteIndex = i;

                    }
                }            
                
                $scope.stocks.splice(deleteIndex, 1);
                storeStocks();
                fetchData();
            };

            $scope.addSymbol = function () {
                $scope.stocks.push({
                    symbol: $scope.symbolText,
                    shares: $scope.numberOfSharesText
                });
                $scope.symbolText = '';
                $scope.numberOfSharesText = '';
                storeStocks();
                fetchData();

            };

            if ($scope.stocks) {
                fetchData();
            }
  }]);