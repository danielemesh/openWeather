(function() {

	"use strict";

	angular
		.module('openWeather.directives', [])
		.directive('city', city);

	function city() {
		var directive = {
			restrict: 'E',
			templateUrl: 'js/directives/city/city.html',
			link: link,
			scope: {
				city: '='
			}
		};

		return directive;

		function link(scope) {

			console.log(scope.city);

			scope.name        = getName();
			scope.iconUrl     = getIconUrl();
			scope.description = getDescription();
			scope.maxTemp     = getTemperature().max;
			scope.minTemp     = getTemperature().min;
			scope.date        = parseDate();


			function getWeatherObject() {
				return scope.city.list[0].weather[0];
			}

			function getIconUrl() {
				return getWeatherObject().icon;
			}

			function getName() {
				return scope.city.city.name;
			}

			function getDescription() {
				return getWeatherObject().description;
			}

			function getTemperature() {
				return scope.city.list[0].temp;
			}

			function parseDate() {
				return scope.city.list[0].dt * 1000;
			}

		}
	}

})();