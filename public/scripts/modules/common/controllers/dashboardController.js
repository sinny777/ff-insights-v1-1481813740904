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
              if(!$scope.dataPoints[dataPoint.message.polarity]){
                $scope.dataPoints[dataPoint.message.polarity] = {count: 1, tweets: [dataPoint.message]};
              }else{
                $scope.dataPoints[dataPoint.message.polarity].count = $scope.dataPoints[dataPoint.cde.content.sentiment.polarity].count + 1;
                if ($scope.dataPoints[dataPoint.message.polarity].tweets.indexOf(dataPoint.message) === -1) {
                    $scope.dataPoints[dataPoint.message.polarity].tweets.push(dataPoint.message);
                }
              }
              if(!$scope.dataPoints[dataPoint.message.polarity].datewise){
                $scope.dataPoints[dataPoint.message.polarity].datewise = {};
              }
              // var tweetDate = $filter('date')(dataPoint.message.postedTime,'yyyy-MM-dd');
              var tweetDate = new Date(dataPoint.message.postedTime);
              tweetDate = tweetDate.setHours(0,0,0,0);
              var found = false;

              if($scope.dataPoints[dataPoint.message.polarity].datewise[tweetDate]){
                $scope.dataPoints[dataPoint.message.polarity].datewise[tweetDate] += 1;
              }else{
                $scope.dataPoints[dataPoint.message.polarity].datewise[tweetDate] = 1;
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
    $scope.showD3MultiChart();
    // $scope.showGoogleChart();

    if(rawData.data.search.results == 0 || rawData.data.search.results < params.size){
      console.log("IN formatAnalysis Data, ALL DATA RETRIEVED :>>>> ", $scope.analysisResult);
      console.log("TOTAL DATA RETRIEVED: >>> ", $scope.analysisResult.length);
    }else{
      if(params.href == rawData.data.related.next.href){
        console.log("TOTAL DATA RETRIEVED: >>> ", $scope.analysisResult.length);
        return;
      }
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

  $scope.showD3MultiChart = function(){
        var d3MultiChartData = [{"key":"POSITIVE", values: []}, {"key":"NEGATIVE", values: []}, {"key":"NEUTRAL", values: []}, {"key":"BOOKINGS", "bar": true, "values": [] }];
        for(var key in $scope.dataPoints["POSITIVE"].datewise){
          var valArr = [];
          valArr.push(key);
          valArr.push($scope.dataPoints["POSITIVE"].datewise[key]);
          d3MultiChartData[0].values.push(valArr);
        }

        for(var key in $scope.dataPoints["NEGATIVE"].datewise){
          var valArr = [];
          valArr.push(key);
          valArr.push($scope.dataPoints["NEGATIVE"].datewise[key]);
          d3MultiChartData[1].values.push(valArr);
        }

        for(var key in $scope.dataPoints["NEUTRAL"].datewise){
          var valArr = [];
          valArr.push(key);
          valArr.push($scope.dataPoints["NEUTRAL"].datewise[key]);
          d3MultiChartData[2].values.push(valArr);
        }

        d3MultiChartData.map(function(series) {
                series.values = series.values.map(function(d) { return {x: d[0], y: d[1] } });
                return series;
            });

      $scope.d3MultiChart = {};
      $scope.d3MultiChart = graphService.getMultiGraph(d3MultiChartData, $scope.getMultiGraphFunctions());
      console.log("IN showD3MultiChart: >>> ", $scope.d3MultiChart);
  };

  $scope.getMultiGraphFunctions = function(){
    var c10 = d3.scale.category10();
    var graphFunctions = {
                          colorFunc: function(d, i){
                                switch (d.originalKey) {
                                    case "POSITIVE": return "#048019";
                                    case "NEGATIVE": return "#F71B05";
                                    default: return c10(i);
                                  }
                              }
                        };
          return graphFunctions;
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
