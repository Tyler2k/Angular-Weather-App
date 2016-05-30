//MODULE
var weatherApp = angular.module("weatherApp", ["ngRoute", "ngResource"]);

//ROUTES
weatherApp.config(function ($routeProvider){
   
    $routeProvider
    
    .when("/", {
        templateUrl: "pages/home.htm",
        controller: "homeController"
    })
    
    .when("/forecast", {
        templateUrl: "pages/forecast.htm",
        controller: "forecastController"
    })
    
    .when("/forecast/:days", {
    templateUrl: "pages/forecast.htm",
    controller: "forecastController"
    })
    
});

//SERVICES
weatherApp.service("cityService", function(){
   
    this.city = "Chandler, AZ";
    
});

//CONTROLLERS
weatherApp.controller("homeController", ["$scope", "$location", "cityService", function($scope, $location, cityService){
    
    $scope.city = cityService.city;
    
    $scope.$watch("city", function(){
       cityService.city = $scope.city;    
    });
    
    $scope.submit = function() {
        $location.path("/forecast");
    }
    
}]);

weatherApp.controller("forecastController", ["$scope", "$resource", "$routeParams", "cityService", function($scope, $resource, $routeParams, cityService){
    
    $scope.city = cityService.city;
    
    $scope.days = $routeParams.days || "2";
    
    $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily?units=imperial&APPID=17869c1943433e57861a580bf6b302f9", {callback: "JSON_CALLBACK"}, { get: { method: "JSONP" }});
    
    $scope.weatherResult = $scope.weatherAPI.get({ q: $scope.city, cnt: $scope.days });
    
    $scope.convertToDate = function(dt) {
        
        return new Date(dt * 1000);
        
    };
    
    $scope.titleCase = function(desc) {        
        desc = desc.split(" ");
        for (var i = 0; i < desc.length; i++) {
            desc[i] = desc[i].charAt(0).toUpperCase() + desc[i].substring(1).toLowerCase();
        }
        desc = desc.join(" ");
        return desc; 
        
    };
}]);

//FILTERS
weatherApp.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);


