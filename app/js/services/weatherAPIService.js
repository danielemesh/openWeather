(function() {

	"use strict";

	angular
		.module('openWeather.services', [])
		.service('weatherAPIService', weatherAPIService);

	weatherAPIService.$inject = ['$http'];

	function weatherAPIService($http) {

		var context          = this;
		const API_KEY        = 'c5ac0098c8c7b7a5512b4679a5b11f9f';
		const BASE_API_URL   = 'http://api.openweathermap.org/data/2.5/';
		const FORECAST_URL   = `${BASE_API_URL}/forecast/daily?APPID=${API_KEY}&units=metric&q=`;
		const ICONS_BASE_URL = 'http://openweathermap.org/img/w/';

		context.getForecast = getForecast;

		function getForecast(city) {
			return $http.get(FORECAST_URL + city)
				.then(getForecastComplete)
				.catch(getForecastFailed);

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
		}
	}

})();
