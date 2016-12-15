/**
 * Module dependencies
*/
var express  = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	http = require('http'),
	path = path = require('path'),
	uuid = require('node-uuid'),
	util = require('util'),
	watson = require('watson-developer-cloud');

var bluemix = require('./app/config/bluemix');

var port     = process.env.PORT || 9000;
var ip     = process.env.IP || "localhost";

app.configure(function() {
    // set up our express application
    app.set('port', port);
    app.use(express.logger('dev')); // log every request to the console
    app.set('view engine', 'html'); // set up html for templating
    app.engine('.html', require('ejs').__express);
    // app.set('views', __dirname + 'public');
    app.use(express.bodyParser()); // get information from html forms
    app.use(express.cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.session({ secret: 'keyboard cat' }));// persistent login sessions
    app.use(express.methodOverride());
    app.use(express.json({limit: '50mb'}));
    app.use(express.urlencoded({ extended: true }));

    app.use(express.session({ secret: 'keyboard cat' }));

});

app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
	});


require('./app/bootstrap.js')(app);
require('./app/routes.js')(app);

//var sttEndpoint = require('./app/endpoints/sttEndpoint.js')(io);

app.use(app.router); //init routing

// development only
if (app.get('env') === 'development') {
    app.use(express.errorHandler());
};

// production only
if (app.get('env') === 'production') {
    // TODO
};

// express.vhost(vhost, app);

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' +server.address().port);
});
//server.timeout = 2000;
