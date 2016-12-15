define(['angular'], function (angular) {
    "use strict";

    var factory = function ($document, $window, $q, $rootScope) {
        var d = $q.defer(),
          d3service = {
            d3: function() { return d.promise; }
          };
          function onScriptLoad() {
            $rootScope.$apply(function() { d.resolve($window.d3); });
          }
          var scriptTag = $document[0].createElement('script');
          scriptTag.type = 'text/javascript';
          scriptTag.async = true;
          scriptTag.src = 'http://d3js.org/d3.v3.min.js';
          scriptTag.onreadystatechange = function () {
            if (this.readyState == 'complete') onScriptLoad();
          }
          scriptTag.onload = onScriptLoad;

          var s = $document[0].getElementsByTagName('body')[0];
          s.appendChild(scriptTag);

          return d3service;
     }

     factory.$inject = ['$document', '$window', '$q', '$rootScope'];
     return factory;

});
