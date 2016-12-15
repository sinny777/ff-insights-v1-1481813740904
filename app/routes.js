module.exports = function(app) {

  var ffEndpoint = require('./endpoints/ffEndpoint.js')();

    app.get('/', function(req, res){
        res.render('index');
    });

    app.get('/views/:name', showClientRequest, function (req, res) {
        var name = req.params.name;
        res.render('views/' + name);
    });

    app.post('/api/ff/insights', showClientRequest, ffEndpoint.fetchInsights);
    app.post('/api/ff/aviations', showClientRequest, ffEndpoint.getAviationData);

    function showClientRequest(req, res, next) {
        var request = {
            REQUEST : {
                HEADERS: req.headers,
                BODY : req.body
            }
        }
        return next();
    }

}
