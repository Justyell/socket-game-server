'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Paintingroom = mongoose.model('Paintingroom'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, paintingroom;

/**
 * Paintingroom routes tests
 */
describe('Paintingroom CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Paintingroom
		user.save(function() {
			paintingroom = {
				name: 'Paintingroom Name'
			};

			done();
		});
	});

	it('should be able to save Paintingroom instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Paintingroom
				agent.post('/paintingrooms')
					.send(paintingroom)
					.expect(200)
					.end(function(paintingroomSaveErr, paintingroomSaveRes) {
						// Handle Paintingroom save error
						if (paintingroomSaveErr) done(paintingroomSaveErr);

						// Get a list of Paintingrooms
						agent.get('/paintingrooms')
							.end(function(paintingroomsGetErr, paintingroomsGetRes) {
								// Handle Paintingroom save error
								if (paintingroomsGetErr) done(paintingroomsGetErr);

								// Get Paintingrooms list
								var paintingrooms = paintingroomsGetRes.body;

								// Set assertions
								(paintingrooms[0].user._id).should.equal(userId);
								(paintingrooms[0].name).should.match('Paintingroom Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Paintingroom instance if not logged in', function(done) {
		agent.post('/paintingrooms')
			.send(paintingroom)
			.expect(401)
			.end(function(paintingroomSaveErr, paintingroomSaveRes) {
				// Call the assertion callback
				done(paintingroomSaveErr);
			});
	});

	it('should not be able to save Paintingroom instance if no name is provided', function(done) {
		// Invalidate name field
		paintingroom.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Paintingroom
				agent.post('/paintingrooms')
					.send(paintingroom)
					.expect(400)
					.end(function(paintingroomSaveErr, paintingroomSaveRes) {
						// Set message assertion
						(paintingroomSaveRes.body.message).should.match('Please fill Paintingroom name');
						
						// Handle Paintingroom save error
						done(paintingroomSaveErr);
					});
			});
	});

	it('should be able to update Paintingroom instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Paintingroom
				agent.post('/paintingrooms')
					.send(paintingroom)
					.expect(200)
					.end(function(paintingroomSaveErr, paintingroomSaveRes) {
						// Handle Paintingroom save error
						if (paintingroomSaveErr) done(paintingroomSaveErr);

						// Update Paintingroom name
						paintingroom.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Paintingroom
						agent.put('/paintingrooms/' + paintingroomSaveRes.body._id)
							.send(paintingroom)
							.expect(200)
							.end(function(paintingroomUpdateErr, paintingroomUpdateRes) {
								// Handle Paintingroom update error
								if (paintingroomUpdateErr) done(paintingroomUpdateErr);

								// Set assertions
								(paintingroomUpdateRes.body._id).should.equal(paintingroomSaveRes.body._id);
								(paintingroomUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Paintingrooms if not signed in', function(done) {
		// Create new Paintingroom model instance
		var paintingroomObj = new Paintingroom(paintingroom);

		// Save the Paintingroom
		paintingroomObj.save(function() {
			// Request Paintingrooms
			request(app).get('/paintingrooms')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Paintingroom if not signed in', function(done) {
		// Create new Paintingroom model instance
		var paintingroomObj = new Paintingroom(paintingroom);

		// Save the Paintingroom
		paintingroomObj.save(function() {
			request(app).get('/paintingrooms/' + paintingroomObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', paintingroom.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Paintingroom instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Paintingroom
				agent.post('/paintingrooms')
					.send(paintingroom)
					.expect(200)
					.end(function(paintingroomSaveErr, paintingroomSaveRes) {
						// Handle Paintingroom save error
						if (paintingroomSaveErr) done(paintingroomSaveErr);

						// Delete existing Paintingroom
						agent.delete('/paintingrooms/' + paintingroomSaveRes.body._id)
							.send(paintingroom)
							.expect(200)
							.end(function(paintingroomDeleteErr, paintingroomDeleteRes) {
								// Handle Paintingroom error error
								if (paintingroomDeleteErr) done(paintingroomDeleteErr);

								// Set assertions
								(paintingroomDeleteRes.body._id).should.equal(paintingroomSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Paintingroom instance if not signed in', function(done) {
		// Set Paintingroom user 
		paintingroom.user = user;

		// Create new Paintingroom model instance
		var paintingroomObj = new Paintingroom(paintingroom);

		// Save the Paintingroom
		paintingroomObj.save(function() {
			// Try deleting Paintingroom
			request(app).delete('/paintingrooms/' + paintingroomObj._id)
			.expect(401)
			.end(function(paintingroomDeleteErr, paintingroomDeleteRes) {
				// Set message assertion
				(paintingroomDeleteRes.body.message).should.match('User is not logged in');

				// Handle Paintingroom error error
				done(paintingroomDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Paintingroom.remove().exec();
		done();
	});
});