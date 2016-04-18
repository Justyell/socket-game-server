'use strict';

(function() {
	// Paintingrooms Controller Spec
	describe('Paintingrooms Controller Tests', function() {
		// Initialize global variables
		var PaintingroomsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Paintingrooms controller.
			PaintingroomsController = $controller('PaintingroomsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Paintingroom object fetched from XHR', inject(function(Paintingrooms) {
			// Create sample Paintingroom using the Paintingrooms service
			var samplePaintingroom = new Paintingrooms({
				name: 'New Paintingroom'
			});

			// Create a sample Paintingrooms array that includes the new Paintingroom
			var samplePaintingrooms = [samplePaintingroom];

			// Set GET response
			$httpBackend.expectGET('paintingrooms').respond(samplePaintingrooms);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.paintingrooms).toEqualData(samplePaintingrooms);
		}));

		it('$scope.findOne() should create an array with one Paintingroom object fetched from XHR using a paintingroomId URL parameter', inject(function(Paintingrooms) {
			// Define a sample Paintingroom object
			var samplePaintingroom = new Paintingrooms({
				name: 'New Paintingroom'
			});

			// Set the URL parameter
			$stateParams.paintingroomId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/paintingrooms\/([0-9a-fA-F]{24})$/).respond(samplePaintingroom);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.paintingroom).toEqualData(samplePaintingroom);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Paintingrooms) {
			// Create a sample Paintingroom object
			var samplePaintingroomPostData = new Paintingrooms({
				name: 'New Paintingroom'
			});

			// Create a sample Paintingroom response
			var samplePaintingroomResponse = new Paintingrooms({
				_id: '525cf20451979dea2c000001',
				name: 'New Paintingroom'
			});

			// Fixture mock form input values
			scope.name = 'New Paintingroom';

			// Set POST response
			$httpBackend.expectPOST('paintingrooms', samplePaintingroomPostData).respond(samplePaintingroomResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Paintingroom was created
			expect($location.path()).toBe('/paintingrooms/' + samplePaintingroomResponse._id);
		}));

		it('$scope.update() should update a valid Paintingroom', inject(function(Paintingrooms) {
			// Define a sample Paintingroom put data
			var samplePaintingroomPutData = new Paintingrooms({
				_id: '525cf20451979dea2c000001',
				name: 'New Paintingroom'
			});

			// Mock Paintingroom in scope
			scope.paintingroom = samplePaintingroomPutData;

			// Set PUT response
			$httpBackend.expectPUT(/paintingrooms\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/paintingrooms/' + samplePaintingroomPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid paintingroomId and remove the Paintingroom from the scope', inject(function(Paintingrooms) {
			// Create new Paintingroom object
			var samplePaintingroom = new Paintingrooms({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Paintingrooms array and include the Paintingroom
			scope.paintingrooms = [samplePaintingroom];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/paintingrooms\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePaintingroom);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.paintingrooms.length).toBe(0);
		}));
	});
}());