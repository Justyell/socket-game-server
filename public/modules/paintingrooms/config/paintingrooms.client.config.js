'use strict';

// Configuring the Articles module
angular.module('paintingrooms').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Paintingrooms', 'paintingrooms', 'dropdown', '/paintingrooms(/create)?');
		Menus.addSubMenuItem('topbar', 'paintingrooms', 'Entrance', 'paintingrooms');
		Menus.addSubMenuItem('topbar', 'paintingrooms', 'NOTOPEN', 'paintingrooms/create');
	}
]);