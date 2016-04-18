'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Paintingroom Schema
 */
var PaintingroomSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Paintingroom name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Paintingroom', PaintingroomSchema);