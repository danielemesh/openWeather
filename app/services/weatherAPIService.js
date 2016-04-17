(function () {

	"use strict";

	angular
		.module('openWeather.services', [])
		.service('weatherAPIService', weatherAPIService);

	weatherAPIService.$inject = ['$http'];

	function weatherAPIService($http) {

		var context          = this;
		const API_KEY        = 'c5ac0098c8c7b7a5512b4679a5b11f9f';
		const BASE_API_URL   = 'http://api.openweathermap.org/data/2.5/';
		const CITIES_JSON    = 'city.list.json';
		const FORECAST_URL   = `${BASE_API_URL}/forecast/daily?APPID=${API_KEY}&units=metric&cnt=6&id=`;
		const ICONS_BASE_URL = 'http://openweathermap.org/img/w/';

		context.getForecast = getForecast;

		function getForecast(cityName) {

			return getCityObject(cityName)
				.then(getCityObjectComplete);

			function getCityObjectComplete(response) {
				if (response) {
					return $http.get(FORECAST_URL + response._id)
						.then(getForecastComplete)
						.catch(getForecastFailed);
				}
				else return false;
			}

			function getForecastComplete(response) {
				// Set the base url for all the icons
				response.data.list.map(setIconUrl);

				return response.data;
			}

			function getForecastFailed(response) {
				console.log(response.data);
			}

			function setIconUrl(cityObject) {
				return cityObject.weather[0].icon = `${ICONS_BASE_URL}${cityObject.weather[0].icon}.png`;
			}

			function getCityObject(cityName) {
				return $http.get(CITIES_JSON)
					.then(function (response) {
						var regex = new RegExp('^' + cityName + '$', 'i');

						return _.find(response.data, function (cityObject) {
							return cityObject.name.match(regex);
						});
					}).catch(function (response) {
						console.log(response.data);
					});
			}
		}
	}

})();
