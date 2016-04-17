(function () {

	"use strict";

	angular
		.module('openWeather.controllers', [])
		.controller('mainController', mainController);

	mainController.$inject = ['weatherAPIService', '$timeout', '$q'];

	function mainController(weatherAPIService, $timeout, $q) {
		var vm           = this;
		vm.newCity       = '';
		vm.alert         = {};
		vm.requests      = [];
		vm.citiesObjects = [];
		vm.onSubmit      = onSubmit;
		vm.getForecast   = getForecast;
		vm.removeCity    = removeCity;
		vm.citiesNames   = ['London', 'Amsterdam', 'Paris', 'Tel Aviv'];

		function init() {
			alertFetching();

			vm.citiesNames.map(function (city) {
				vm.requests.push(getForecast(city));
			});

			$q.all(vm.requests).then(resetAlertObject);
		}

		function getForecast(city) {

			return weatherAPIService.getForecast(city)
				.then(function (data) {
					vm.citiesObjects.unshift(data);
					return data;
				});
		}

		function onSubmit() {
			var duration = 3000;

			if (isCityInList()) {
				alertError();
				$timeout(resetAlertObject, duration);
			}
			else {
				alertFetching();

				getForecast(vm.newCity)
					.then(function (data) {
						alertSuccess();

						vm.citiesNames.push(data.city.name);
						vm.newCity = '';

						$timeout(resetAlertObject, duration);
					});
			}
		}

		function removeCity(index, cityName) {
			vm.citiesObjects.splice(index, 1);
			_.remove(vm.citiesNames, function(name) {
				return name === cityName;
			});
		}

		function isCityInList() {
			return _.find(vm.citiesNames, function (cityName) {
				return cityName.toUpperCase() === vm.newCity.toUpperCase();
			});
		}

		function resetAlertObject() {
			vm.alert.message  = '';
			vm.alert.cssClass = 'alert-success';
		}

		function alertSuccess() {
			vm.alert.cssClass = 'alert-success';
			vm.alert.message  = 'The city was added successfully';
		}

		function alertFetching() {
			vm.alert.message  = 'Fetching data...';
			vm.alert.cssClass = 'alert-info';
		}

		function alertError() {
			vm.alert.message  = 'City already present, please add another city';
			vm.alert.cssClass = 'alert-danger';
		}

		init();
	}

})();