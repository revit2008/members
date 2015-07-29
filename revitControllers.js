var revitControllers = angular.module('revitControllers', []);

revitControllers.controller('RevitListCtrl', function ($scope, revitfact,$sce, $filter, $q, ngTableParams) {
  revitfact.list(function(revitfact) {
    $scope.revitfact = revitfact;
	$scope.pageShow  = "ng-show";
	$scope.selectedIndex = 2;
	$scope.itemClicked = function ($index) {
    $scope.selectedIndex = $index;
  };
	$scope.renderHtml = function(html_code)
			{
				return $sce.trustAsHtml(html_code);
			};
  });
});

revitControllers.controller('RevitInfoCtrl', function ($scope, $routeParams, revitfact){
   revitfact.list(function(myrevit) {
	   angular.forEach(myrevit, function(item) {
		  if (item.url == $routeParams.revitId) 
			$scope.inrevit = item;			
			//console.log("PASS");
			
		});
   
	
  });
});

revitControllers.controller('RevitMainCtrl', function ($scope, $routeParams,$sce, revitfact, $filter, $q, ngTableParams) {
  $scope.pageShow  = "ng-show";
  $scope.pageConstruction = "ng-hide";
  revitfact.list(function(menurevit) {
	$scope.menuheadrevit = menurevit;
	   angular.forEach(menurevit, function(item) {
		  if (item.url == $routeParams.revitId) 
			{$scope.inrevit = item;
			//console.log("PASS");
			$scope.renderHtml = function(html_code)
			{
				return $sce.trustAsHtml(html_code);
			};
			}
			else {
			console.log ("FAIL");
			}
		});
   
	
  });
  
  //console.log ("-"+$routeParams.stateId+"-")
	
  
	 
});