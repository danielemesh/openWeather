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

			vm.citiesNames.map(function (cityName) {
				vm.requests.push(getForecast(cityName));
			});

			$q.all(vm.requests).then(function () {
				resetAlertObject(3000, 'All requests are done.');
			});
		}

		function getForecast(cityName) {

			return weatherAPIService.getForecast(cityName)
				.then(function (data) {
					if (data) {
						return getForecastSuccess(data);
					}
					else {
						getForecastFailed(cityName);
					}
				});
		}

		function getForecastSuccess(cityObject) {
			vm.citiesObjects.unshift(cityObject);
			alertSuccess(cityObject.city.name);

			return cityObject;
		}

		function getForecastFailed(cityName) {
			alertError(`Could not find city: ${cityName}`);
		}

		function onSubmit() {
			if (isCityInList()) {
				alertError('City already present, please add another city');
				resetAlertObject();
			}
			else {
				alertFetching();

				getForecast(vm.newCity)
					.then(function () {
						vm.newCity = '';
						resetAlertObject();

					});
			}
		}

		function removeCity(index) {
			vm.citiesObjects.splice(index, 1);
		}

		function isCityInList() {
			var regex = new RegExp('^' + vm.newCity + '$', 'i');

			return _.find(vm.citiesObjects, function (cityObject) {
				return cityObject.city.name.match(regex);
			});
		}

		function resetAlertObject(delay = 3000, message = '') {
			if (message) {
				vm.alert.message = message;
			}

			$timeout(function () {
				vm.alert.message  = '';
				vm.alert.cssClass = 'alert-success';
			}, delay);
		}

		function alertSuccess(cityName) {
			vm.alert.message  = `${cityName} was added successfully`;
			vm.alert.cssClass = 'alert-success';
		}

		function alertFetching() {
			vm.alert.message  = 'Fetching data, please wait...';
			vm.alert.cssClass = 'alert-info';
		}

		function alertError(message) {
			vm.alert.message  = message;
			vm.alert.cssClass = 'alert-danger';
		}

		init();
	}

})();