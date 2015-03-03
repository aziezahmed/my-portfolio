!function(){"use strict";angular.module("myPortfolioApp",["ngRoute","ngTouch","googlechart"]),angular.module("myPortfolioApp").config(function($routeProvider){$routeProvider.when("/",{controller:"WatchListController",templateUrl:"watchlist/watchlist.html"}).when("/portfolio",{controller:"PortfolioController",templateUrl:"portfolio/portfolio.html"}).when("/detail/:symbolId",{controller:"DetailController",templateUrl:"detail/detail.html"}).otherwise({redirectTo:"/"})}),angular.module("myPortfolioApp").config(function($compileProvider){$compileProvider.debugInfoEnabled(!1)}),angular.module("myPortfolioApp").controller("NavController",function($scope,$route,$location){$scope.getClass=function(param){return param===$location.path()?"active":void 0}})}(),function(){"use strict";function setStocksFromLocalStorage(){return localStorage.symbolList?JSON.parse(localStorage.symbolList):defaultSymbolList}function saveStocksInLocalStorage(stocks){localStorage.symbolList=JSON.stringify(stocks)}var quoteUrl="https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D%22http%3A%2F%2Fdownload.finance.yahoo.com%2Fd%2Fquotes.csv%3Fs%3D[SYMBOL]%26f%3Dsnl1c1%26e%3D.csv%22%20and%20columns%3D%22symbol%2Cname%2Cprice%2Cchange%22&format=json&diagnostics=true&callback=",defaultSymbolList={YHOO:{shares:100,purchasePrice:40},GOOG:{shares:50,purchasePrice:270},MSFT:{shares:150,purchasePrice:47}};angular.module("myPortfolioApp").controller("PortfolioController",function($scope,$http){$scope.stocks=setStocksFromLocalStorage(),$scope.quotes=[],$scope.fetchData=function(){var symbolString=Object.keys($scope.stocks).join(",");""===symbolString?$scope.quotes={}:$http({url:quoteUrl.replace("[SYMBOL]",encodeURI(symbolString))}).success(function(quotes){$scope.quotes=1===quotes.query.count?new Array(quotes.query.results.row):quotes.query.results.row})},$scope.changeClass=function(change){return 0>change?"label-danger":"label-success"},$scope.gainLossClass=function(symbol,price){return $scope.gainLoss(symbol,price)<0?"label-danger":"label-success"},$scope.numberOfShares=function(symbol){return $scope.stocks[symbol]?$scope.stocks[symbol].shares:void 0},$scope.purchasePrice=function(symbol){return $scope.stocks[symbol]?$scope.stocks[symbol].purchasePrice:void 0},$scope.marketValue=function(symbol,price){return $scope.stocks[symbol]&&$scope.stocks[symbol].shares?$scope.stocks[symbol].shares*(price/100):void 0},$scope.gainLoss=function(symbol,price){return $scope.stocks[symbol]?$scope.marketValue(symbol,price)-$scope.stocks[symbol].purchasePrice:void 0},$scope.totalPortfolioValue=function(){for(var totalPortfolioValue=0,count=$scope.quotes.length,i=0;count>i;i++)$scope.stocks[$scope.quotes[i].symbol]&&$scope.stocks[$scope.quotes[i].symbol].shares&&(totalPortfolioValue+=$scope.stocks[$scope.quotes[i].symbol].shares*($scope.quotes[i].price/100));return totalPortfolioValue},$scope.deleteStock=function(quote){delete $scope.stocks[quote.symbol],$scope.fetchData(),saveStocksInLocalStorage($scope.stocks)},$scope.editStock=function(quote){$scope.symbolInput=quote.symbol,$scope.numberOfSharesInput=$scope.stocks[quote.symbol].shares,$scope.purchasePriceInput=$scope.stocks[quote.symbol].purchasePrice},$scope.addSymbol=function(){$scope.stocks[$scope.symbolInput.toUpperCase()]={shares:$scope.numberOfSharesInput,purchasePrice:$scope.purchasePriceInput},$scope.symbolInput="",$scope.numberOfSharesInput="",$scope.purchasePriceInput="",$scope.fetchData(),saveStocksInLocalStorage($scope.stocks)}})}(),function(){"use strict";function setStocksFromLocalStorage(){return localStorage.watchList?JSON.parse(localStorage.watchList):defaultSymbolList}function saveStocksInLocalStorage(stocks){localStorage.watchList=JSON.stringify(stocks)}var quoteUrl="https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D%22http%3A%2F%2Fdownload.finance.yahoo.com%2Fd%2Fquotes.csv%3Fs%3D[SYMBOL]%26f%3Dsnl1c1j1%26e%3D.csv%22%20and%20columns%3D%22symbol%2Cname%2Cprice%2Cchange%2Cmcap%22&format=json&diagnostics=true&callback=",defaultSymbolList=["YHOO","GOOG","MSFT","AAPL","IBM"];angular.module("myPortfolioApp").controller("WatchListController",function($scope,$http){$scope.stocks=setStocksFromLocalStorage(),$scope.quotes=[],$scope.fetchData=function(){var symbolString=$scope.stocks.toString();""===symbolString?$scope.quotes={}:$http({url:quoteUrl.replace("[SYMBOL]",encodeURI(symbolString))}).success(function(quotes){$scope.quotes=1===quotes.query.count?new Array(quotes.query.results.row):quotes.query.results.row})},$scope.changeClass=function(change){return 0>change?"label-danger":"label-success"},$scope.deleteStock=function(quote){var i=$scope.stocks.indexOf(quote.symbol);-1!=i&&$scope.stocks.splice(i,1),$scope.fetchData(),saveStocksInLocalStorage($scope.stocks)},$scope.addSymbol=function(){var newSymbol=$scope.symbolInput.toUpperCase();$scope.stocks.indexOf(newSymbol)<0&&$scope.stocks.push(newSymbol),$scope.symbolInput="",$scope.fetchData(),saveStocksInLocalStorage($scope.stocks)}})}(),function(){"use strict";var today=new Date,yearEnd=today.getFullYear(),yearStart=yearEnd-1,day=today.getDate(),month=today.getMonth(),frequency="w",chartUrl="https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D%22http%3A%2F%2Fichart.finance.yahoo.com%2Ftable.csv%3Fa%3D[START_MONTH]%26b%3D[START_DAY]%26c%3D[START_YEAR]%26d%3D[END_MONTH]%26e%3D[END_DAY]%26f%3D[END_YEAR]%26g%3D[FREQUENCY]%26s%3D[SYMBOL]%22%20and%20columns%3D%22date%2Copen%2Chigh%2Clow%2Cclose%2Cvolume%2Cadj_close%22&format=json&diagnostics=true&callback=",quoteUrl="https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D%22http%3A%2F%2Fdownload.finance.yahoo.com%2Fd%2Fquotes.csv%3Fs%3D[SYMBOL]%26f%3Dsnxc4l1pc1p2kj%26e%3D.csv%22%20and%20columns%3D%22symbol%2Cname%2Cexchange%2Ccurrency%2Cprice%2CpreviousClose%2Cchange%2CpercentChange%2CyearHigh%2CyearLow%22&format=json&diagnostics=true&callback=";angular.module("myPortfolioApp").controller("DetailController",function($scope,$http,$route,$location,$routeParams){$scope.quote=[],$scope.fetchData=function(){$http({url:quoteUrl.replace("[SYMBOL]",$routeParams.symbolId)}).success(function(quotes){$scope.quote=quotes.query.results.row}),$http({url:chartUrl.replace("[SYMBOL]",$routeParams.symbolId).replace("[START_DAY]",day).replace("[END_DAY]",day).replace("[START_DAY]",day).replace("[START_MONTH]",month).replace("[END_MONTH]",month).replace("[START_YEAR]",yearStart).replace("[END_YEAR]",yearEnd).replace("[FREQUENCY]",frequency)}).success(function(quotes){var chartData=quotes.query.results.row;chartData.reverse(),chartData.pop(),$scope.chartObject={};for(var rows=[],i=0;i<chartData.length;i++){var item=[],dateObj={v:new Date(chartData[i].date)},priceObj={v:chartData[i].close};item.push(dateObj),item.push(priceObj),rows.push({c:item})}$scope.chartObject.type="LineChart",$scope.chartObject.options={hAxis:{showTextEvery:1},legend:"none",height:300,title:$scope.quote.symbol},$scope.chartObject.data={cols:[{id:"t",label:"Date",type:"date"},{id:"s",label:"Price",type:"number"}],rows:rows}})},$scope.changeClass=function(change){return 0>change?"label-danger":"label-success"}})}();