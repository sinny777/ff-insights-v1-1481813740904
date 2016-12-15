define(function () {
    'use strict';

  function ctrl($rootScope, $scope, $http, ffService, commonService){

  var analysisResult = [];
  $rootScope.airlines;
	$scope.search ={"enable": false, "params": {"origin": "", "destination": "", "date": ""}};
  $scope.searchResults;
  $scope.trips = [];
  $scope.selectedAirline;
	$rootScope.airportData;
  $scope.dataPoints = {"POSITIVE": 0, "NEGATIVE": 0, "NEUTRAL": 0};
  $scope.selectedSegment = {data: [], color: ""};
  var c10 = d3.scale.category10();
  $scope.d3Chart = {
                      "config":{
                          visible: true, // default: true
                          extended: false, // default: false
                          disabled: false, // default: false
                          refreshDataOnly: true, // default: true
                          deepWatchOptions: true, // default: true
                          deepWatchData: true, // default: true
                          deepWatchDataDepth: 2, // default: 2
                          debounce: 10 // default: 10
                      },
                      "options":{
                        "chart": {
                            type: 'pieChart',
                            color: function(d,i){
                              switch (d.polarity) {
                  			          case "POSITIVE": return "#048019";
                  			          case "NEGATIVE": return "#F71B05";
                  			          case "NEUTRAL": return "#052DF7";
                                  case "AMBIVALENT": return "#F1F908";
                  			          default: return c10(i);
                			          }
                            },
                            pie: {
                              dispatch: {
                                renderEnd: function(e) { console.log('Chart renderEnd') },
                                elementClick: function(e){
                                  $scope.selectedSegment.data = e.data;
                                  $scope.selectedSegment.color = e.color;
                                  console.log('SelectedSegment: ', e);
                                  $scope.$apply();
                                },
                                stateChange: function(e){ console.log('stateChange') },
                                changeState: function(e){ console.log('changeState') }
                              }
                            },
                            height: 500,
                            x: function(d){return d.polarity},
                            y: function(d){return d.count;},
                            tweets: function(d){return d.tweets},
                            showLabels: true,
                            duration: 500,
                            labelThreshold: 0.01,
                            labelSunbeamLayout: true,
                            legend: {
                                margin: {
                                    top: 5,
                                    right: 35,
                                    bottom: 5,
                                    left: 0
                                }
                            },
                            showValues: false,
                            valueFormat: function(d){
                                return d3.format(',.4f')(d);
                            },
                            transitionDuration: 500
                          }
                    },
                        "data": []
  };
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
      }
    };

    $scope.fetchAirlines = function(){
      var req = {
           method: 'GET',
           url: '/resources/airlines.json',
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
	    			 url: '/resources/IATACodes.csv',
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
        $scope.dataPoints = {"POSITIVE": 0, "NEGATIVE": 0, "NEUTRAL": 0};
        analysisResult = [];
        var params = {"q": query, "size": 100, total: 500};
        fetchInsights(params, function(err, resp){
            formatAnalysisData(params, err, resp);
        });
      }
  };

  $scope.showAnalytics = function(carrier){
    console.log("IN showAnalytics: >> ", carrier);
    $scope.dataPoints = {"POSITIVE": 0, "NEGATIVE": 0, "NEUTRAL": 0};
    analysisResult = [];
    var query = "("+carrier.code +" AND frequent flyer) OR ("+ carrier.name +" frequent flyer)";
    if($scope.search.params.startDate){
      query += " posted: "+$scope.search.params.startDate;
      if($scope.search.params.endDate){
        query += ","+$scope.search.params.endDate;
      }
    }
    var params = {"q": query, "size": 100, total: 500};
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

    if(analysisResult && analysisResult.length > 0){
      console.log("CONCAT ARRAY WITH DATA: >>>CURRENT COUNT: ", analysisResult.length);
      analysisResult.push.apply(analysisResult, rawData.data.tweets);
    }else{
      analysisResult = rawData.data.tweets;
    }

    for(var i=0; i<analysisResult.length; i++){
      var dataPoint = analysisResult[i];
        if(dataPoint.cde && dataPoint.cde.content && dataPoint.cde.content.sentiment && dataPoint.cde.content.sentiment.polarity){
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

    if(analysisResult.length >= params.total){
      console.log("<<<<<< TOTAL LIMIT REACHED >>>>>> ");
      return;
    }else{
      console.log("DATA RETRIEVED: >> ", analysisResult.length, " PARAMS.TOTAL:  ", params.total);
    }
    $scope.showD3Chart();
    // $scope.showGoogleChart();
    if(rawData.data.search.results == 0 || rawData.data.search.results < params.size){
      console.log("IN formatAnalysis Data, ALL DATA RETRIEVED :>>>> ", rawData);
      console.log("TOTAL DATA RETRIEVED: >>> ", analysisResult.length);
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
    $scope.d3Chart.options.title = $scope.selectedAirline+" Twitter Insights";
    $scope.d3Chart.data = [];
    for(var key in $scope.dataPoints){
         $scope.d3Chart.data.push({"polarity": key, "count": $scope.dataPoints[key].count, "tweets": $scope.dataPoints[key].tweets});
    }
    console.log("d3Chart: >>> ", $scope.d3Chart);
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

  ctrl.$inject = ['$rootScope', '$scope', '$http', 'ffService', 'commonService'];
  return ctrl;

});
