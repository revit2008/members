var revitApp = angular.module('revitApp', ['ngRoute', 'revitControllers','ngTable','ui.bootstrap']);

revitApp.config(function($routeProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'index-list.html',
      controller: 'RevitListCtrl'
    }).
    when('/:revitId', {
      templateUrl: 'list-main.html',
      controller: 'RevitListCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });
});

revitApp.factory('revitfact', function($http){
  return {
    list: function (callback){
      $http({
        method: 'GET',
        url: 'members.json',
        cache: true
      }).success(callback);
    }
  };
});

revitApp.directive('revit', function(){
  return {
    scope: {
      revit: '='
    },
    restrict: 'A',
    templateUrl: 'revit.html',
    controller: function($scope, revitfact){
      revitfact.find($scope.revit.id, function(revit) {
        $scope.flagURL = revit.flagURL;
      });
    }
  };
});

revitApp.directive('compileTemplate', function($compile, $parse){
    return {
        link: function(scope, element, attr){
            var parsed = $parse(attr.ngBindHtml);
            function getStringValue() { return (parsed(scope) || '').toString(); }
            
            //Recompile if the template changes
            scope.$watch(getStringValue, function() {
                $compile(element, null, -9999)(scope);  //The -9999 makes it skip directives so that we do not recompile ourselves
            });
        }         
    }
});

revitApp.filter('groupBy', ['$parse', 'pmkr.filterStabilize', function ($parse, filterStabilize) {
    
    function groupBy(input, prop) {
      
      if (!input) { return; }
      
      var grouped = {};
      
      input.forEach(function(item) {
        var key = $parse(prop)(item);
        grouped[key] = grouped[key] || [];
        grouped[key].push(item);
      });
      
      return grouped;
      
    }
    
    return filterStabilize(groupBy);
    
 }])


revitApp.factory('pmkr.filterStabilize', [
  'pmkr.memoize',
  function(memoize) {

    function service(fn) {

      function filter() {
        var args = [].slice.call(arguments);
        // always pass a copy of the args so that the original input can't be modified
        args = angular.copy(args);
        // return the `fn` return value or input reference (makes `fn` return optional)
        var filtered = fn.apply(this, args) || args[0];
        return filtered;
      }

      var memoized = memoize(filter);

      return memoized;

    }

    return service;

  }
])


revitApp.factory('pmkr.memoize', [
  function() {

    function service() {
      return memoizeFactory.apply(this, arguments);
    }

    function memoizeFactory(fn) {

      var cache = {};

      function memoized() {

        var args = [].slice.call(arguments);

        var key = JSON.stringify(args);

        if (cache.hasOwnProperty(key)) {
          return cache[key];
        }

        cache[key] = fn.apply(this, arguments);

        return cache[key];

      }

      return memoized;

    }

    return service;

  }
])
    
