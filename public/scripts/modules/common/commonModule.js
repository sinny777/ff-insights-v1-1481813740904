define(function (require) {
    'use strict';

    var angular = require('angular'),
	config = require('config'),
	ngRoute = require('angularRoute'),
	ngStorage = require('angularLocalStorage'),
    commonModule = angular.module('commonModule', ['ngRoute',
                                                   'ngAnimate',
                                                   'LocalStorageModule',
                                                   'app.config']);

    commonModule.factory('commonService', require('modules/common/services/commonService'));
    commonModule.factory('graphService', require('modules/common/services/graphService'));
    commonModule.factory('ffService', require('modules/common/services/ffService'));
    // commonModule.factory('d3Service', require('modules/common/services/d3Service'));

    commonModule.directive('ngAirports', require('modules/common/directives/airportsDirective'));
    // commonModule.directive('d3Bars', require('modules/common/directives/d3BarsDirective'));

    commonModule.controller('dashboardController', require('modules/common/controllers/dashboardController'));
    commonModule.controller('CommonController', ['$rootScope', '$cookies', '$http', function CommonController($rootScope, $cookies, $http){

      $rootScope.currentUser = {};
      $rootScope.footerLinks = [];
      $rootScope.initNavBar = function(){
	    //  commonService.pageLoadCalls();
	    };

	    $rootScope.allLinks = [];

	    $rootScope.getAllLinks = function(callBack){
	    	console.log('IN getAllLinks >>>>>>>>>> ');
	    	var req = {
	    			 method: 'GET',
	    			 url: '/resources/alllinks.json',
	    			 headers: {
	    			   'Accept': 'application/json'
	    			 }
	    			}

			$http(req).then(function(jsonResp){
				$rootScope.allLinks = jsonResp.data;
				if(callBack){
					callBack(jsonResp.data);
				}
			}, function(err){
				console.log(err);
			});
	    };

	    $rootScope.checkCurrentUser = function(){
	    	var cookies = $cookies.getAll();
	    	console.log('COOKIES: >>>>>>>', cookies);
			var userKey = cookies['user_key'];
			if(userKey){
				var userEmail = userKey.substring(userKey.lastIndexOf('/')+1);
				$rootScope.currentUser.email = userEmail;
				console.log('$rootScope.currentUser:>>>>> ', $rootScope.currentUser);
			}
	    };

    }]);

    commonModule.directive('fileModel', require('modules/common/directives/fileModelDirective'));
    commonModule.directive('toggle', require('modules/common/directives/toggleDirective'));

    commonModule.filter('interpolate', ['version', function(version) {
        return function(text) {
            return String(text).replace(/\%VERSION\%/mg, version);
          }
        }
        ]).
        filter('unsafe', ['$sce', function($sce) {
          return function(val) {
          	return $sce.trustAsHtml(val);
            }
          }
        ]);

    commonModule.config(['$routeProvider',
                         function($routeProvider) {
  		$routeProvider.
  			when('/dashboard', {
  				templateUrl: 'public/scripts/modules/common/views/dashboard.html',
  				controller: 'dashboardController',
  				controllerAs: 'vm',
  				access: { requiredLogin: false }
  			}).
        otherwise('/dashboard');
  	}]);


    return commonModule;

});
