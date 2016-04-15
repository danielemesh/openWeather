(function() {

	"use strict";

	angular
		.module('openWeather.controllers', [])
		.controller('mainController', mainController);

	mainController.$inject = ['weatherAPIService'];

	function mainController(weatherAPIService) {
		var vm = this;
		vm.citiesNames = ['London', 'Amsterdam', 'Paris', 'Tel Aviv'];
		vm.getForecast = getForecast;
		vm.citiesObjects = [];

		function init() {
			vm.citiesNames.map(function(city) {
				getForecast(city);
			});
		}


		function getForecast(city) {
			return weatherAPIService.getForecast(city)
				.then(function(data) {
					vm.citiesObjects.push(data);
					return vm.citiesObjects;
				});
		}

		init();
	}

})();