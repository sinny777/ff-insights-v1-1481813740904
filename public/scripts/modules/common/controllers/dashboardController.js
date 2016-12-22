define(function () {
    'use strict';

  function ctrl($rootScope, $scope, $http, $filter, ffService, commonService, graphService){

  $scope.analysisResult = [];
  $rootScope.airlines;
	$scope.search ={"enable": false, "params": {"origin": "", "destination": "", "date": ""}};
  $scope.searchResults;
  $scope.trips = [];
  $scope.selectedAirline;
	$rootScope.airportData;
  $scope.dataPoints = {"POSITIVE": {"count": 0, tweets: []}, "NEGATIVE": {"count": 0, tweets: []}, "NEUTRAL": {"count": 0, tweets: []}};
  $scope.selectedSegment = {data: [], color: ""};
  $scope.d3PolarityChart;
  $scope.d3MultiChart;

  $scope.googleChart = {};
  $scope.googleChart = {"data":
      {"cols": [
                  {id: "p", label: "Polarity", type: "string"},
                  {id: "c", label: "Count", type: "number"}
                ],
      "rows": []
      }
    };


    $rootScope.gotoTop = function (){
      $('body,html').animate({scrollTop:0},400);
    };

    $scope.initDashboard = function(){
      if(!$rootScope.airlines){
        $scope.fetchAirlines();
        $scope.d3PolarityChart = graphService.getPieGraph($scope.getPieGraphFunctions());
        $scope.initiateMultiChart();
      }
    };

    $scope.getPieGraphFunctions = function(){
      var c10 = d3.scale.category10();
      var graphFunctions = {
                            colorFunc: function(d, i){
                                  switch (d.x) {
                                      case "POSITIVE": return "#048019";
                                      case "NEGATIVE": return "#F71B05";
                                      case "NEUTRAL": return "#ec971f"; //"#052DF7" or ""#d58512";
                                      case "AMBIVALENT": return "#F1F908";
                                      default: return c10(i);
                                    }
                                },
                            elementClickFunct: function(e){
                              $scope.selectedSegment.data = e.data;
                              $scope.selectedSegment.color = e.color;
                              console.log('IN pieElemClickFunct, SelectedSegment: ', e);
                              $scope.$apply();
                            }
                          };
            return graphFunctions;
      };

      $scope.initiateMultiChart = function(){
        var d3MultiChartData = [
            {
                "key" : "Quantity" ,
                "bar": true,
                "values" : [ [ 1136005200000 , 1271000.0] , [ 1138683600000 , 1271000.0] , [ 1141102800000 , 1271000.0] , [ 1143781200000 , 0] , [ 1146369600000 , 0] , [ 1149048000000 , 0] , [ 1151640000000 , 0] , [ 1154318400000 , 0] , [ 1156996800000 , 0] , [ 1159588800000 , 3899486.0] , [ 1162270800000 , 3899486.0] , [ 1164862800000 , 3899486.0] , [ 1167541200000 , 3564700.0] , [ 1170219600000 , 3564700.0] , [ 1172638800000 , 3564700.0] , [ 1175313600000 , 2648493.0] , [ 1177905600000 , 2648493.0] , [ 1180584000000 , 2648493.0] , [ 1183176000000 , 2522993.0] , [ 1185854400000 , 2522993.0] , [ 1188532800000 , 2522993.0] , [ 1191124800000 , 2906501.0] , [ 1193803200000 , 2906501.0] , [ 1196398800000 , 2906501.0] , [ 1199077200000 , 2206761.0] , [ 1201755600000 , 2206761.0] , [ 1204261200000 , 2206761.0] , [ 1206936000000 , 2287726.0] , [ 1209528000000 , 2287726.0] , [ 1212206400000 , 2287726.0] , [ 1214798400000 , 2732646.0] , [ 1217476800000 , 2732646.0] , [ 1220155200000 , 2732646.0] , [ 1222747200000 , 2599196.0] , [ 1225425600000 , 2599196.0] , [ 1228021200000 , 2599196.0] , [ 1230699600000 , 1924387.0] , [ 1233378000000 , 1924387.0] , [ 1235797200000 , 1924387.0] , [ 1238472000000 , 1756311.0] , [ 1241064000000 , 1756311.0] , [ 1243742400000 , 1756311.0] , [ 1246334400000 , 1743470.0] , [ 1249012800000 , 1743470.0] , [ 1251691200000 , 1743470.0] , [ 1254283200000 , 1519010.0] , [ 1256961600000 , 1519010.0] , [ 1259557200000 , 1519010.0] , [ 1262235600000 , 1591444.0] , [ 1264914000000 , 1591444.0] , [ 1267333200000 , 1591444.0] , [ 1270008000000 , 1543784.0] , [ 1272600000000 , 1543784.0] , [ 1275278400000 , 1543784.0] , [ 1277870400000 , 1309915.0] , [ 1280548800000 , 1309915.0] , [ 1283227200000 , 1309915.0] , [ 1285819200000 , 1331875.0] , [ 1288497600000 , 1331875.0] , [ 1291093200000 , 1331875.0] , [ 1293771600000 , 1331875.0] , [ 1296450000000 , 1154695.0] , [ 1298869200000 , 1154695.0] , [ 1301544000000 , 1194025.0] , [ 1304136000000 , 1194025.0] , [ 1306814400000 , 1194025.0] , [ 1309406400000 , 1194025.0] , [ 1312084800000 , 1194025.0] , [ 1314763200000 , 1244525.0] , [ 1317355200000 , 475000.0] , [ 1320033600000 , 475000.0] , [ 1322629200000 , 475000.0] , [ 1325307600000 , 690033.0] , [ 1327986000000 , 690033.0] , [ 1330491600000 , 690033.0] , [ 1333166400000 , 514733.0] , [ 1335758400000 , 514733.0]]
            },
            {
                "key" : "Price" ,
                "values" : [ [ 1136005200000 , 71.89] , [ 1138683600000 , 75.51] , [ 1141102800000 , 68.49] , [ 1143781200000 , 62.72] , [ 1146369600000 , 70.39] , [ 1149048000000 , 59.77] , [ 1151640000000 , 57.27] , [ 1154318400000 , 67.96] , [ 1156996800000 , 67.85] , [ 1159588800000 , 76.98] , [ 1162270800000 , 81.08] , [ 1164862800000 , 91.66] , [ 1167541200000 , 84.84] , [ 1170219600000 , 85.73] , [ 1172638800000 , 84.61] , [ 1175313600000 , 92.91] , [ 1177905600000 , 99.8] , [ 1180584000000 , 121.191] , [ 1183176000000 , 122.04] , [ 1185854400000 , 131.76] , [ 1188532800000 , 138.48] , [ 1191124800000 , 153.47] , [ 1193803200000 , 189.95] , [ 1196398800000 , 182.22] , [ 1199077200000 , 198.08] , [ 1201755600000 , 135.36] , [ 1204261200000 , 125.02] , [ 1206936000000 , 143.5] , [ 1209528000000 , 173.95] , [ 1212206400000 , 188.75] , [ 1214798400000 , 167.44] , [ 1217476800000 , 158.95] , [ 1220155200000 , 169.53] , [ 1222747200000 , 113.66] , [ 1225425600000 , 107.59] , [ 1228021200000 , 92.67] , [ 1230699600000 , 85.35] , [ 1233378000000 , 90.13] , [ 1235797200000 , 89.31] , [ 1238472000000 , 105.12] , [ 1241064000000 , 125.83] , [ 1243742400000 , 135.81] , [ 1246334400000 , 142.43] , [ 1249012800000 , 163.39] , [ 1251691200000 , 168.21] , [ 1254283200000 , 185.35] , [ 1256961600000 , 188.5] , [ 1259557200000 , 199.91] , [ 1262235600000 , 210.732] , [ 1264914000000 , 192.063] , [ 1267333200000 , 204.62] , [ 1270008000000 , 235.0] , [ 1272600000000 , 261.09] , [ 1275278400000 , 256.88] , [ 1277870400000 , 251.53] , [ 1280548800000 , 257.25] , [ 1283227200000 , 243.1] , [ 1285819200000 , 283.75] , [ 1288497600000 , 300.98] , [ 1291093200000 , 311.15] , [ 1293771600000 , 322.56] , [ 1296450000000 , 339.32] , [ 1298869200000 , 353.21] , [ 1301544000000 , 348.5075] , [ 1304136000000 , 350.13] , [ 1306814400000 , 347.83] , [ 1309406400000 , 335.67] , [ 1312084800000 , 390.48] , [ 1314763200000 , 384.83] , [ 1317355200000 , 381.32] , [ 1320033600000 , 404.78] , [ 1322629200000 , 382.2] , [ 1325307600000 , 405.0] , [ 1327986000000 , 456.48] , [ 1330491600000 , 542.44] , [ 1333166400000 , 599.55] , [ 1335758400000 , 583.98]]
            }
        ].map(function(series) {
                series.values = series.values.map(function(d) { return {x: d[0], y: d[1] } });
                return series;
            });

          $scope.d3MultiChart = graphService.getMultiGraph(d3MultiChartData);
          console.log("d3MultiChart: >>> ", $scope.d3MultiChart);
      }

    $scope.fetchAirlines = function(){
      var req = {
           method: 'GET',
           url: 'public/resources/airlines.json',
           headers: {
             'Accept': 'application/json'
           }
          }

        $http(req).then(function(jsonResp){
          console.log("AIRLINES: >> ", jsonResp);
          $rootScope.airlines = jsonResp.data;
        }, function(err){
          console.log(err);
        });
    };

    $scope.airlineSelectionChange = function(){
      console.log("$scope.selectedAirline: >>> ", $scope.selectedAirline);
      if($scope.selectedAirline == "search"){
        if(!$rootScope.airportData){
      		$rootScope.airportData = [];
      		$scope.getAirportsData(function(csv){
          		$rootScope.airportData = JSON.parse(commonService.csvToJson(csv));
      			  console.log("JSON: >>> ", $rootScope.airportData.length);
          	});
      	}else{
      		console.log("DATA ALREADY FETCHED, TOTAL ROWS : >>>> ", $rootScope.airportData.length);
      	}
        $scope.search.enable = true;
      }else{
        $scope.search.enable = false;
      }
    };

    $scope.getAirportsData = function(cb){
	    	console.log('IN getAirportsData >>>>>>>>>> ');
	    	var req = {
	    			 method: 'GET',
	    			 url: 'public/resources/IATACodes.csv',
	    			 headers: {
	    			   'Accept': 'application/csv'
	    			 }
	    			}

			$http(req).then(function(csv){
				cb(csv.data);
			}, function(err){
				console.log(err);
			});
	};

	$scope.searchAndAnlyze = function(){
		console.log("IN searchAndAnlyze: >>> ", $scope.search);
    var searchReq = {
        "request": {
          "slice": [
            {
              "origin": $scope.search.params.origin.title,
              "destination": $scope.search.params.destination.title,
              "date": $scope.search.params.date
            }
          ],
          "passengers": {
            "adultCount": 1,
            "infantInLapCount": 0,
            "infantInSeatCount": 0,
            "childCount": 0,
            "seniorCount": 0
          },
          "solutions": 20,
          "refundable": false
        }
    };
    ffService.searchFlights(searchReq).then(function(resp) {
        console.log("searchFlights RESPONSE: >>>> ", resp);
        $scope.search.results = resp;
        // formatFlightsData(resp);
    }).catch(function(error){
        console.log("ERROR: >>>> ", error);
    });
	};

  $scope.analyzeForAirline = function(){
      if($scope.selectedAirline){
        var query = $scope.selectedAirline;
        if($scope.search.params.startDate){
          query += " posted: "+$scope.search.params.startDate;
          if($scope.search.params.endDate){
            query += ","+$scope.search.params.endDate;
          }
        }

        // query += " frequent flyer";
        $scope.dataPoints = {"POSITIVE": {"count": 0, tweets: []}, "NEGATIVE": {"count": 0, tweets: []}, "NEUTRAL": {"count": 0, tweets: []}};
        $scope.analysisResult = [];
        var params = {"q": query, "size": 200, total: 1000};
        fetchInsights(params, function(err, resp){
            formatAnalysisData(params, err, resp);
        });
      }
  };

  $scope.showAnalytics = function(carrier){
    console.log("IN showAnalytics: >> ", carrier);
    $scope.dataPoints = {"POSITIVE": {"count": 0, tweets: []}, "NEGATIVE": {"count": 0, tweets: []}, "NEUTRAL": {"count": 0, tweets: []}};
    $scope.analysisResult = [];
    var query = "("+carrier.code +" AND frequent flyer) OR ("+ carrier.name +" frequent flyer)";
    if($scope.search.params.startDate){
      query += " posted: "+$scope.search.params.startDate;
      if($scope.search.params.endDate){
        query += ","+$scope.search.params.endDate;
      }
    }
    var params = {"q": query, "size": 200, total: 1000};
    fetchInsights(params, function(err, resp){
        formatAnalysisData(params, err, resp);
    });
  };

  function fetchInsights(params, cb){
    ffService.fetchAnalytics(params).then(function(resp) {
        cb(null, resp);
    }).catch(function(error){
        cb(error, null);
    });
  };

  function formatAnalysisData(params, err, rawData){
    console.log("IN formatAnalysisData, rawData: ", rawData);
    if(err){
        console.log("ERROR: >>>> ", err);
        return ;
    }

    if($scope.analysisResult && $scope.analysisResult.length > 0){
      console.log("CONCAT ARRAY WITH DATA: >>> CURRENT COUNT: ", $scope.analysisResult.length);
      $scope.analysisResult.push.apply($scope.analysisResult, rawData.data.tweets);
    }else{
      $scope.analysisResult = rawData.data.tweets;
    }

    $scope.analysisResult = $filter('orderBy')($scope.analysisResult, "message.postedTime");

    for(var i=0; i<$scope.analysisResult.length; i++){
      var dataPoint = $scope.analysisResult[i];
        if(dataPoint.cde && dataPoint.cde.content && dataPoint.cde.content.sentiment && dataPoint.cde.content.sentiment.polarity){
              dataPoint.message.polarity = dataPoint.cde.content.sentiment.polarity;
              if(!$scope.dataPoints[dataPoint.cde.content.sentiment.polarity]){
                $scope.dataPoints[dataPoint.cde.content.sentiment.polarity] = {count: 1, tweets: [dataPoint.message]};
              }else{
                $scope.dataPoints[dataPoint.cde.content.sentiment.polarity].count = $scope.dataPoints[dataPoint.cde.content.sentiment.polarity].count + 1;
                if ($scope.dataPoints[dataPoint.cde.content.sentiment.polarity].tweets.indexOf(dataPoint.message) === -1) {
                    $scope.dataPoints[dataPoint.cde.content.sentiment.polarity].tweets.push(dataPoint.message);
                }
              }
        }
    }
    console.log("dataPoints: >> ", $scope.dataPoints);

    if($scope.analysisResult.length >= params.total){
      console.log("<<<<<< TOTAL LIMIT REACHED >>>>>> ");
      return;
    }else{
      console.log("DATA RETRIEVED: >> ", $scope.analysisResult.length, " PARAMS.TOTAL:  ", params.total);
    }
    $scope.showD3Chart();
    // $scope.showGoogleChart();
    if(rawData.data.search.results == 0 || rawData.data.search.results < params.size){
      console.log("IN formatAnalysis Data, ALL DATA RETRIEVED :>>>> ", $scope.analysisResult);
      console.log("TOTAL DATA RETRIEVED: >>> ", $scope.analysisResult.length);
    }else{
      params.href = rawData.data.related.next.href;
      fetchInsights(params, function(err, results){
        formatAnalysisData(params, err, results);
      });
    }
  };

  $scope.showGoogleChart = function(){
    $scope.googleChart.type = "PieChart";
    $scope.googleChart.options = {"title": $scope.selectedAirline+" Twitter Insights", "is3D": true};
    $scope.googleChart.data.rows = [];
    for(var key in $scope.dataPoints){
        //  console.log("KEY: ", key, ", VALUE: ", $scope.dataPoints[key]);
         var chartCols = [];
         chartCols.push({v: key});
         chartCols.push({v: $scope.dataPoints[key].count});
         $scope.googleChart.data.rows.push({"c": chartCols});
    }
    console.log("googleChart: >>> ", $scope.googleChart);
  };

  $scope.showD3Chart = function(){
    $scope.d3PolarityChart.options.title = $scope.selectedAirline+" Twitter Insights";
    $scope.d3PolarityChart.data = [];
    for(var key in $scope.dataPoints){
         $scope.d3PolarityChart.data.push({"x": key, "y": $scope.dataPoints[key].count, "data": $scope.dataPoints[key].tweets});
    }
    console.log("d3PolarityChart: >>> ", $scope.d3PolarityChart);
  };

  function formatFlightsData(resp){
    $scope.trips = [];
    var masterData = resp.trips.data;
    var trips = resp.trips.tripOption;
    for(var i=0; i<trips.length; i++){
      for(var j=0; j<trips[i].slice.length; j++){
        var trip = {"duration": trips[i].slice[j].duration, "segments": []};
        for(var k=0; k<trips[i].slice[j].segment.length; k++){
          trip.segments.push(formatSegmentData(trips[i].slice[j].segment[k], masterData));
        }
        $scope.trips.push(trip);
      }
    }
    console.log($scope.trips);
  };

  function formatSegmentData(segment, masterData){
      for(var i=0; i<masterData.carrier.length; i++){
        if(segment.flight.carrier == masterData.carrier[i].code){
          segment.flight.name = masterData.carrier[i].name;
        }
      }

    return segment;
  };


  }

  ctrl.$inject = ['$rootScope', '$scope', '$http', '$filter', 'ffService', 'commonService', 'graphService'];
  return ctrl;

});
