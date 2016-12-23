
var CONFIG = require('../config/config').get();
var commonHandler = require('../handlers/commonHandler')();

var watson = require('watson-developer-cloud');
var Twitter = require('twitter');
var rest = require('restler');
var aviationJson = require("aviation-json");
var graph     = require('fbgraph');

var client = new Twitter({
	consumer_key: 'HgabJ73ut83WKomes4qb8A',
	consumer_secret: 'GIRJVj0yS79uGj94xNK11dcoVFZlxnqTuBKffU4ptI',
	access_token_key: '545334954-coxdqjANZdIAcDs3kQhgmiiFgyaT6Kwvh4F7n7wI',
	access_token_secret: 'xRhDYtbRem077Lmcy2qO128Nc1PXN8BYxT1rHNuf3A'
});

  // this should really be in a config file!
var conf = {
    client_id:      '676775262334675'
  , client_secret:  'a9d28ff440df75c06363cf3eb46bbc2a'
  , scope:          'email, user_about_me, user_birthday, user_location, user_posts'
  , redirect_uri:   'http://localhost:9000/auth/facebook'
  , client_token: 'eb3e04afbdc331aec3637aa3cbb14e66'
};

var fbOptions = {"appId": "676775262334675", "appSecret": "a9d28ff440df75c06363cf3eb46bbc2a", "version": "v2.2"};
var FB = require('fb'),
    fb = new FB.Facebook(fbOptions);

var methods = {};

module.exports = function() {

	methods.fbAuth = function(req, res){
		graph.setVersion("2.4");
		if (!req.query.code) {
			var authUrl = graph.getOauthUrl({
					"client_id":     conf.client_id
				, "redirect_uri":  conf.redirect_uri
				, "scope":         conf.scope
				, "type":          "client_cred"
			});

			if (!req.query.error) { //checks whether a user denied the app facebook login/permissions
				res.redirect(authUrl);
			} else {  //req.query.error == 'access_denied'
				res.send('access denied');
			}
			return;
	 }
	 // code is set
		// we'll send that and get the access token
		graph.authorize({
				"client_id":      conf.client_id
			, "redirect_uri":   conf.redirect_uri
			, "client_secret":  conf.client_secret
			, "code":           req.query.code
		}, function (err, facebookRes) {
				console.log("facebookRes: >> ", facebookRes);
				graph.setAccessToken(facebookRes.access_token);
				res.redirect('/');
		});
	};

	methods.searchFB = function(params, cb){
		graph.search(params, function(err, res) {
			if(err) {
				console.log("ERROR: >> ", err);
				return;
			}
			console.log(res); // {data: [{id: xxx, from: ...}, {id: xxx, from: ...}]}
			if(cb){
				cb(res);
			}
		});
	};

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
		//TODO Just for testing FB Graph APIs
		/*
		var searchOptions = {
				q:     "Gurvinder Singh"
			, type:  "user"
			, fields: "id, name, email, birthday"
		};

		methods.searchFB(searchOptions, function(results){
			if(results.data && results.data.length > 0){
				for(var i=0; i< results.data.length; i++){
					var user = results.data[i];
					if(i <= 3){
						var params = { fields: "id, name, birthday, email, feed" };
						graph.get(user.id, params, function(err, res) {
							if(err) console.log("ERROR in fetching User Data: >> ", err);
							console.log("USER DATA: >>> ", res); // {data: [{id: xxx, from: ...}, {id: xxx, from: ...}]}
						});
					}
				}
			}
		});
		*/

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
