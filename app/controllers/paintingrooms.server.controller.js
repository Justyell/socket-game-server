'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Paintingroom = mongoose.model('Paintingroom'),
	_ = require('lodash');

/**
 * Create a Paintingroom
 */
exports.create = function(req, res) {
	var paintingroom = new Paintingroom(req.body);
	paintingroom.user = req.user;

	paintingroom.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(paintingroom);
		}
	});
};

/**
 * Show the current Paintingroom
 */
exports.read = function(req, res) {
	res.jsonp(req.paintingroom);
};

/**
 * Update a Paintingroom
 */
exports.update = function(req, res) {
	var paintingroom = req.paintingroom ;

	paintingroom = _.extend(paintingroom , req.body);

	paintingroom.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(paintingroom);
		}
	});
};

/**
 * Delete an Paintingroom
 */
exports.delete = function(req, res) {
	var paintingroom = req.paintingroom ;

	paintingroom.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(paintingroom);
		}
	});
};

/**
 * List of Paintingrooms
 */
exports.list = function(req, res) { 
	Paintingroom.find().sort('-created').populate('user', 'displayName').exec(function(err, paintingrooms) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(paintingrooms);
		}
	});
};

/**
 * Paintingroom middleware
 */
exports.paintingroomByID = function(req, res, next, id) { 
	Paintingroom.findById(id).populate('user', 'displayName').exec(function(err, paintingroom) {
		if (err) return next(err);
		if (! paintingroom) return next(new Error('Failed to load Paintingroom ' + id));
		req.paintingroom = paintingroom ;
		next();
	});
};

/**
 * Paintingroom authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.paintingroom.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};


