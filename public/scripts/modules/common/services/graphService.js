define(['angular'], function (angular) {
    "use strict";

    var factory = function ($parse) {
      var graphService = {
              getPieGraph: function(funcObj) {
                  console.log("IN graphService.getPolarityGraph: >>> ");
                  var pieGraph = {
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
                                            color: funcObj.colorFunc,
                                            pie: {
                                              dispatch: {
                                                renderEnd: function(e) { console.log('Chart renderEnd') },
                                                elementClick: funcObj.elementClickFunct,
                                                stateChange: function(e){ console.log('stateChange') },
                                                changeState: function(e){ console.log('changeState') }
                                              }
                                            },
                                            height: 500,
                                            x: function(d){return d.x},
                                            y: function(d){return d.y;},
                                            data: function(d){return d.data},
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

                  return pieGraph;

                },
            getMultiGraph: function(data) {
                var multiGraph = {
                  "data": data,
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
                  "options": {
                    chart: {
                        type: 'linePlusBarChart',
                        height: 500,
                        margin: {
                            top: 30,
                            right: 75,
                            bottom: 50,
                            left: 75
                        },
                        bars: {
                            forceY: [0]
                        },
                        bars2: {
                            forceY: [0]
                        },
                        color: ['#2ca02c', 'darkred'],
                        x: function(d,i) { return i },
                        xAxis: {
                            axisLabel: 'X Axis',
                            tickFormat: function(d) {
                                var dx = data[0].values[d] && data[0].values[d].x || 0;
                                if (dx > 0) {
                                    return d3.time.format('%x')(new Date(dx))
                                }
                                return null;
                            }
                        },
                        x2Axis: {
                            tickFormat: function(d) {
                                var dx = data[0].values[d] && data[0].values[d].x || 0;
                                return d3.time.format('%b-%Y')(new Date(dx))
                            },
                            showMaxMin: false
                        },
                        y1Axis: {
                            axisLabel: 'Y1 Axis',
                            tickFormat: function(d){
                                return d3.format(',f')(d);
                            },
                            axisLabelDistance: 12
                        },
                        y2Axis: {
                            axisLabel: 'Y2 Axis',
                            tickFormat: function(d) {
                                return '$' + d3.format(',.2f')(d)
                            }
                        },
                        y3Axis: {
                            tickFormat: function(d){
                                return d3.format(',f')(d);
                            }
                        },
                        y4Axis: {
                            tickFormat: function(d) {
                                return '$' + d3.format(',.2f')(d)
                            }
                        }
                      }
                  }
                }

                return multiGraph;
            }

         };

         return graphService;
       }
     factory.$inject = ['$parse'];
     return factory;

});
