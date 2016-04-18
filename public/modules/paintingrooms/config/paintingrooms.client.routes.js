'use strict';

//Setting up route
angular.module('paintingrooms').config(['$stateProvider',
	function($stateProvider) {
		// Paintingrooms state routing
		$stateProvider.
		state('listPaintingrooms', {
			url: '/paintingrooms',
			templateUrl: 'modules/paintingrooms/views/list-paintingrooms.client.view.html'
		}).
		state('createPaintingroom', {
			url: '/paintingrooms/create',
			templateUrl: 'modules/paintingrooms/views/create-paintingroom.client.view.html'
		}).
		state('viewPaintingroom', {
			url: '/paintingrooms/:paintingroomId',
			templateUrl: 'modules/paintingrooms/views/view-paintingroom.client.view.html'
		}).
		state('editPaintingroom', {
			url: '/paintingrooms/:paintingroomId/edit',
			templateUrl: 'modules/paintingrooms/views/edit-paintingroom.client.view.html'
		});
	}
]);