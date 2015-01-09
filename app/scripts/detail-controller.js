/* global angular */
angular.module('myPortfolioApp').controller('DetailController', function StockController($scope, $http, $routeParams) {
    'use strict';

    $scope.quote = [];

    var quoteUrl =
        'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D%22http%3A%2F%2Fdownload.finance.yahoo.com%2Fd%2Fquotes.csv%3Fs%3D' + $routeParams.symbolId + '%26f%3Dsnxc4l1pc1p2kj%26e%3D.csv%22%20and%20columns%3D%22symbol%2Cname%2Cexchange%2Ccurrency%2Cprice%2CpreviousClose%2Cchange%2CpercentChange%2CyearHigh%2CyearLow%22&format=json&diagnostics=true&callback=';

    $http({
        url: quoteUrl
    }).success(function (quotes) {
        $scope.quote = quotes.query.results.row;
    });


    $scope.changeClass = function (change) {
        if (change < 0) {
            return 'label-danger';
        } else {
            return 'label-success';
        }
    };


    var today = new Date();
    var yearEnd = today.getFullYear();
    var yearStart = yearEnd - 1;
    var day = today.getDate();
    var month = today.getMonth();
    var chartUrl = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D%22http%3A%2F%2Fichart.finance.yahoo.com%2Ftable.csv%3Fa%3D' + month + '%26b%3D' + day + '%26c%3D' + yearStart + '%26d%3D' + month + '%26e%3D' + day + '%26f%3D' + yearEnd + '%26g%3Dw%26s%3D' + $routeParams.symbolId + '%22%20and%20columns%3D%22date%2Copen%2Chigh%2Clow%2Cclose%2Cvolume%2Cadj_close%22&format=json&diagnostics=true&callback=';

    $http({
        url: chartUrl
    }).success(function (quotes) {
        var chart_data = quotes.query.results.row;
        
        chart_data.reverse();
        chart_data.pop();

        $scope.chartObject = {};

        var rows = [];

        for (var i = 0; i < chart_data.length; i++) {
            var item = [];
            var date_obj = {
                v: new Date(chart_data[i].date)
            }
            var price_obj = {
                v: chart_data[i].close
            }
            item.push(date_obj);
            item.push(price_obj);
            rows.push({
                c: item
            });
        }

        $scope.chartObject.type = "LineChart";
        $scope.chartObject.options = {
            hAxis: {
                showTextEvery: 1
            },
            legend: 'none',
            'height': 300,
            'title': $scope.quote.symbol
        }
        $scope.chartObject.data = {
            "cols": [
                {
                    id: "t",
                    label: "Date",
                    type: "date"
                },
                {
                    id: "s",
                    label: "Price",
                    type: "number"
                }
            ],
            "rows": rows
        };

    });

});