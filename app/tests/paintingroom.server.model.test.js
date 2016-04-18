'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Paintingroom = mongoose.model('Paintingroom');

/**
 * Globals
 */
var user, paintingroom;

/**
 * Unit tests
 */
describe('Paintingroom Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			paintingroom = new Paintingroom({
				name: 'Paintingroom Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return paintingroom.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			paintingroom.name = '';

			return paintingroom.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Paintingroom.remove().exec();
		User.remove().exec();

		done();
	});
});