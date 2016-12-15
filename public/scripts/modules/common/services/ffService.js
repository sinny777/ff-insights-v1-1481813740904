define(['angular'], function (angular) {
    "use strict";

    var factory = function ($parse, $http, $httpParamSerializer) {

    	var networkService = {
          fetchAviationData: function(searchReq) {
                console.log("IN fetchAviationData, searchReq: >>> ", searchReq);
                var req = {
                      method: "POST",
                      url: "/api/ff/aviations",
                      data: searchReq,
                      headers: {
                        "Accept": "application/json",
                         "Content-Type": "application/json"
                      }
                     };
                  var promise = $http(req).then(function(response) {
                       console.log("API RESPONSE: >>> ", response);
                      return response;
                    }).catch(function(e){
                       console.log("API ERROR: >>> ", e);
                      throw e;
                    });
                  return promise;
           },
           searchFlights: function(searchReq) {
    					  var reqUrl = "https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyB1M_k_dCRbSAfIl3_t5dEGibC_jpoP7kw";
    			    	console.log("IN searchFlights, searchReq: >>> ", searchReq);
    			      var req = {
    				    		  method: 'POST',
    				    		  url: reqUrl,
                      data: searchReq,
    				    		  headers: {
    				    		    "Accept": "application/json",
                        "Content-Type": "application/json"
    				    		  }
    				    		 };
    				      var promise = $http(req).then(function (response) {
    		  		        return response.data;
    		  		      }).catch(function(e){
    		  		    	  throw e;
    		  		      });
    				      return promise;
			     },
           fetchAnalytics: function(searchReq) {
    					  var qs = $httpParamSerializer(searchReq);
    			    	var params = {"query": qs, "searchFor": searchReq.q, "href": searchReq.href};
    			    	console.log("IN fetchAnalytics, searchReq: >>> ", params);
    			      var req = {
    				    		  method: "POST",
    				    		  url: "/api/ff/insights",
                      data: params,
    				    		  headers: {
    				    		    "Accept": "application/json",
                        "Content-Type": "application/json"
    				    		  }
    				    		 };
    				      var promise = $http(req).then(function(response) {
                      return response;
    		  		      }).catch(function(e){
                      console.log("API ERROR: >>> ", e);
    		  		    	  throw e;
    		  		      });
    				      return promise;
			     }

         };

         return networkService;
       }
     factory.$inject = ['$parse', '$http', '$httpParamSerializer'];
     return factory;

});
