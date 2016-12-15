
var CONFIG = require('../config/config').get();
var commonHandler = require('../handlers/commonHandler')();

var watson = require('watson-developer-cloud');
var Twitter = require('twitter');
var rest = require('restler');
var aviationJson = require("aviation-json");

var client = new Twitter({
	consumer_key: 'HgabJ73ut83WKomes4qb8A',
	consumer_secret: 'GIRJVj0yS79uGj94xNK11dcoVFZlxnqTuBKffU4ptI',
	access_token_key: '545334954-coxdqjANZdIAcDs3kQhgmiiFgyaT6Kwvh4F7n7wI',
	access_token_secret: 'xRhDYtbRem077Lmcy2qO128Nc1PXN8BYxT1rHNuf3A'
});

var methods = {};

module.exports = function() {

	methods.getAviationData = function(req, resp, next){
		console.log('\n\n<<<<<<<< IN getAviationData >>>>>>>', req.body);
		result = {};
		var params = req.body;
		if(params.fetch == "airlineDestinations"){
			result = aviationJson.airline_destinations;
		}
		if(params.fetch == "airlines"){
			result = aviationJson.airlines;
		}
		/*
		var airlines = aviationJson.airlines;
		var airportAirlines = aviationJson.airport_airlines;
		var airportsCities = aviationJson.airport_cities;
		var airportRunways = aviationJson.airport_runways;
		var airports = aviationJson.airports;
		var cityAirports = aviationJson.city_airports;
		*/
		resp.json(result);
	};

	methods.searchTweets = function(searchFor){
		console.log('\n\n<<<<<<<< IN searchTweets >>>>>>> searchFor: ', searchFor);
		var params = {q: searchFor, count: 50};
		client.get('search/tweets', params, function(error, tweets, response){
        if (error) {
					console.log(error);
				}
				// console.log("TWEETS FROM TWITTER API: >>> ", tweets);
				if(tweets && tweets.statuses){
					console.log("TOTAL TWEETS FROM TWITTER API: >>> ", tweets.statuses.length);
	        for(var i=0; i<tweets.statuses.length; i++){
						var tweet = tweets.statuses[i];
						console.log(tweet.text);
					}
				}
    });

	};

	methods.fetchInsights = function(req, resp, next){
		params = req.body;
		var reqUrl = "https://dc42d418-9363-4911-bade-4e92dbaf2ebf:M5uwnyPVtQ@cdeservice.mybluemix.net:443/api/v1/messages/search?";

		if(params.href){
			reqUrl += params.href.substring(params.href.indexOf("?") + 1);
		}else{
			reqUrl += params.query;
		}
		console.log('\n\n<<<<<<<< IN fetchInsights, reqUrl: ', reqUrl);
		rest.get(reqUrl).on('complete', function(result) {
			if (result instanceof Error) {
				console.log('Error:', result.message);
				this.retry(5000); // try again after 5 sec
			} else {
				resp.json(result);
			}
		});

	};

return methods;

}
