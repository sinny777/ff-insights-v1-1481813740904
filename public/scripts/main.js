
console.log('\n\n<<<<<<<<< INSIDE main.js >>>>>>>>>');

require.config({
    paths :{
    	'jquery' : '/../bower_components/jquery/dist/jquery.min',
        'angular' :'/../bower_components/angular/angular.min',
        'angularRoute' : '/../bower_components/angular-route/angular-route.min',
        'angularLocalStorage' : '/../bower_components/angular-local-storage/dist/angular-local-storage.min',
        'angularAnimate' : '/../bower_components/angular-animate/angular-animate.min',
        'angularFilesystem': '/../bower_components/angular-filesystem/src/filesystem',
        'angularToastr': '/../bower_components/angular-toastr/dist/angular-toastr.tpls.min',
        'angularCookies' : '/../bower_components/angular-cookies/angular-cookies.min',
        'angularjsDatepicker' : '/../bower_components/angularjs-datepicker/dist/angular-datepicker.min',
        'googlechart' : '/../bower_components/angular-google-chart/ng-google-chart.min',
        'd3' : '/../bower_components/d3/d3.min',
        'nvd3' : '/../bower_components/nvd3/build/nv.d3.min',
        'angular-nvd3' : '/../bower_components/angular-nvd3/dist/angular-nvd3.min',
        'bootstrap' : '/../bower_components/bootstrap/dist/js/bootstrap.min',
        'ui.bootstrap':'/../bower_components/angular-bootstrap/ui-bootstrap.min',
        'cryptojslib' : '/../bower_components/cryptojslib/rollups/pbkdf2',
        'querystring': '/../bower_components/querystring/querystring.min',
        'text': '/../bower_components/text'
    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angularRoute' :{
            deps: ['angular']
        },
        'angularAnimate' :{
            deps: ['angular']
        },
        'angularToastr': {
            deps: ['angularAnimate']
        },
        'angularLocalStorage' :{
            deps: ['angular']
        },
        'angularFilesystem' :{
            deps: ['angular']
        },
        'angularCookies' :{
            deps: ['angular']
        },
        'angularjsDatepicker' :{
            deps: ['angular']
        },
        'googlechart' :{
            deps: ['angular']
        },
        'd3' :{
          exports : 'd3'
        },
        'nvd3' : {
          deps: ['d3'],
          exports : 'nvd3'
        },
        'angular-nvd3':{
          deps: ['angular', 'd3', 'nvd3']
        },
        'cryptojslib' : {
            exports : 'cryptojslib'
        },
        'querystring' : {
            exports : 'querystring'
        },
        'jquery':{
        	 exports : 'jquery'
        },
        'bootstrap' : {
        	deps: ['jquery'],
        	exports: 'bootstrap'
        },
        'ui.bootstrap': {
            deps: ['angular','bootstrap'],
            exports: 'ui.bootstrap'
        }
    },
    priority:
    	[
         'jquery',
	       'angular',
	       'cryptojslib',
	       'querystring',
	       'bootstrap',
	       'ui.bootstrap',
         'angular-nvd3'
	   ],
   deps: [
          'initialize'
          ]
});

/*
require(['require','angular','bootstrap','app'], function () {
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['myworkstyle']);
    });
});
*/
