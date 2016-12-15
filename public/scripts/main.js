
console.log('\n\n<<<<<<<<< INSIDE main.js >>>>>>>>>');

require.config({
    paths :{
    	'jquery' : '../scripts/lib/jquery/dist/jquery.min',
        'angular' :'../scripts/lib/angular/angular.min',
        'angularRoute' : '../scripts/lib/angular-route/angular-route.min',
        'angularLocalStorage' : '../scripts/lib/angular-local-storage/dist/angular-local-storage.min',
        'angularAnimate' : '../scripts/lib/angular-animate/angular-animate.min',
        'angularFilesystem': '../scripts/lib/angular-filesystem/src/filesystem',
        'angularToastr': '../scripts/lib/angular-toastr/dist/angular-toastr.tpls.min',
        'angularCookies' : '../scripts/lib/angular-cookies/angular-cookies.min',
        'angularjsDatepicker' : '../scripts/lib/angularjs-datepicker/dist/angular-datepicker.min',
        'googlechart' : '../scripts/lib/angular-google-chart/ng-google-chart.min',
        'd3' : '../scripts/lib/d3/d3.min',
        'nvd3' : '../scripts/lib/nvd3/build/nv.d3.min',
        'angular-nvd3' : '../scripts/lib/angular-nvd3/dist/angular-nvd3.min',
        'bootstrap' : '../scripts/lib/bootstrap/dist/js/bootstrap.min',
        'ui.bootstrap':'../scripts/lib/angular-bootstrap/ui-bootstrap.min',
        'cryptojslib' : '../scripts/lib/cryptojslib/rollups/pbkdf2',
        'querystring': '../scripts/lib/querystring/querystring.min',
        'text': '../scripts/lib/text'
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
