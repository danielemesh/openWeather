(function () {

	"use strict";

	angular
		.module('openWeather.directives', [])
		.directive('city', city);

	function city() {
		var directive = {
			restrict: 'E',
			templateUrl: 'directives/city/city.html',
			link: link,
			scope: {
				city: '='
			}
		};

		return directive;

		function link(scope) {

			scope.name        = getName();
			scope.iconUrl     = getIconUrl();
			scope.description = getDescription();
			scope.maxTemp     = getTemperature().max;
			scope.minTemp     = getTemperature().min;
			scope.date        = getParsedDate();

			scope.getParsedDate  = getParsedDate;
			scope.getIconUrl     = getIconUrl;
			scope.getDescription = getDescription;

			function getForecastList() {
				return scope.city.list;
			}

			function getWeatherObject(index = 0) {
				return getForecastList()[index].weather[0];
			}

			function getIconUrl(index = 0) {
				return getWeatherObject(index).icon;
			}

			function getName() {
				return scope.city.city.name;
			}

			function getDescription(index = 0) {
				return getWeatherObject(index).description;
			}

			function getTemperature(index = 0) {
				return getForecastList()[index].temp;
			}

			function getParsedDate(index = 0) {
				return getForecastList()[index].dt * 1000;
			}

		}
	}

})();