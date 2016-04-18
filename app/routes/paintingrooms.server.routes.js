'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var paintingrooms = require('../../app/controllers/paintingrooms.server.controller');

	// Paintingrooms Routes
	app.route('/paintingrooms')
		.get(paintingrooms.list)
		.post(users.requiresLogin, paintingrooms.create);

	app.route('/paintingrooms/:paintingroomId')
		.get(paintingrooms.read)
		.put(users.requiresLogin, paintingrooms.hasAuthorization, paintingrooms.update)
		.delete(users.requiresLogin, paintingrooms.hasAuthorization, paintingrooms.delete);

	
	// Finish by binding the Paintingroom middleware
	app.param('paintingroomId', paintingrooms.paintingroomByID);
};
