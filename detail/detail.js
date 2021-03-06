/* global angular */
(function () {
    'use strict';

    var today = new Date();
    var yearEnd = today.getFullYear();
    var yearStart = yearEnd - 1;
    var day = today.getDate();
    var month = today.getMonth();
    var frequency = 'w';

    var chartUrl = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D%22http%3A%2F%2Fichart.finance.yahoo.com%2Ftable.csv%3Fa%3D[START_MONTH]%26b%3D[START_DAY]%26c%3D[START_YEAR]%26d%3D[END_MONTH]%26e%3D[END_DAY]%26f%3D[END_YEAR]%26g%3D[FREQUENCY]%26s%3D[SYMBOL]%22%20and%20columns%3D%22date%2Copen%2Chigh%2Clow%2Cclose%2Cvolume%2Cadj_close%22&format=json&diagnostics=true&callback=';
    var quoteUrl = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D%22http%3A%2F%2Fdownload.finance.yahoo.com%2Fd%2Fquotes.csv%3Fs%3D[SYMBOL]%26f%3Dsnxc4l1pc1p2kj%26e%3D.csv%22%20and%20columns%3D%22symbol%2Cname%2Cexchange%2Ccurrency%2Cprice%2CpreviousClose%2Cchange%2CpercentChange%2CyearHigh%2CyearLow%22&format=json&diagnostics=true&callback=';


    angular.module('myPortfolioApp').controller('DetailController', function StockController($scope, $http, $route, $location, $routeParams) {

        $scope.quote = [];
        
        $scope.fetchData = function() {
            $http({
                url: quoteUrl.replace('[SYMBOL]',$routeParams.symbolId)
            }).success(function (quotes) {
                $scope.quote = quotes.query.results.row;
            });

            $http({
                url: chartUrl.replace('[SYMBOL]',$routeParams.symbolId).replace('[START_DAY]',day).replace('[END_DAY]',day).replace('[START_DAY]',day).replace('[START_MONTH]',month).replace('[END_MONTH]',month).replace('[START_YEAR]',yearStart).replace('[END_YEAR]',yearEnd).replace('[FREQUENCY]',frequency)
            }).success(function (quotes) {
                var chartData = quotes.query.results.row;
                chartData.reverse();
                chartData.pop();

                $scope.chartObject = {};

                var rows = [];

                for (var i = 0; i < chartData.length; i++) {
                    var item = [];
                    var dateObj = {
                        v: new Date(chartData[i].date)
                    };
                    var priceObj = {
                        v: chartData[i].close
                    };
                    item.push(dateObj);
                    item.push(priceObj);
                    rows.push({
                        c: item
                    });
                }

                $scope.chartObject.type = 'LineChart';
                $scope.chartObject.options = {
                    hAxis: {
                        showTextEvery: 1
                    },
                    legend: 'none',
                    'height': 300,
                    'title': $scope.quote.symbol
                };
                $scope.chartObject.data = {
                    'cols': [
                        {
                            id: 't',
                            label: 'Date',
                            type: 'date'
                        },
                        {
                            id: 's',
                            label: 'Price',
                            type: 'number'
                        }
                    ],
                    'rows': rows
                };
            });  
        };   

        $scope.changeClass = function (change) {
            if (change < 0) {
                return 'label-danger';
            } else {
                return 'label-success';
            }
        };
    });
})();
