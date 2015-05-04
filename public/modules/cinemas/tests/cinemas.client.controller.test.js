'use strict';

(function () {
    // Cinemas Controller Spec
    describe('Cinemas Controller Tests', function () {
        // Initialize global variables
        var CinemasController,
            scope,
            $httpBackend,
            $stateParams,
            $location;

        // The $resource service augments the response object with methods for updating and deleting the resource.
        // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
        // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
        // When the toEqualData matcher compares two objects, it takes only object properties into
        // account and ignores methods.
        beforeEach(function () {
            jasmine.addMatchers({
                toEqualData: function (util, customEqualityTesters) {
                    return {
                        compare: function (actual, expected) {
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
        beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
            // Set a new global scope
            scope = $rootScope.$new();

            // Point global variables to injected services
            $stateParams = _$stateParams_;
            $httpBackend = _$httpBackend_;
            $location = _$location_;

            // Initialize the Cinemas controller.
            CinemasController = $controller('CinemasController', {
                $scope: scope
            });
        }));

        it('$scope.find() should create an array with at least one Cinema object fetched from XHR', inject(function (Cinemas) {
            // Create sample Cinema using the Cinemas service
            var sampleCinema = new Cinemas({
                name: 'New Cinema'
            });

            // Create a sample Cinemas array that includes the new Cinema
            var sampleCinemas = [sampleCinema];

            // Set GET response
            $httpBackend.expectGET('cinemas').respond(sampleCinemas);

            // Run controller functionality
            scope.find();
            $httpBackend.flush();

            // Test scope value
            expect(scope.cinemas).toEqualData(sampleCinemas);
        }));

        it('$scope.findOne() should create an array with one Cinema object fetched from XHR using a cinemaId URL parameter', inject(function (Cinemas) {
            // Define a sample Cinema object
            var sampleCinema = new Cinemas({
                name: 'New Cinema'
            });

            // Set the URL parameter
            $stateParams.cinemaId = '525a8422f6d0f87f0e407a33';

            // Set GET response
            $httpBackend.expectGET(/cinemas\/([0-9a-fA-F]{24})$/).respond(sampleCinema);

            // Run controller functionality
            scope.findOne();
            $httpBackend.flush();

            // Test scope value
            expect(scope.cinema).toEqualData(sampleCinema);
        }));

        it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function (Cinemas) {
            // Create a sample Cinema object
            var sampleCinemaPostData = new Cinemas({
                name: 'New Cinema'
            });

            // Create a sample Cinema response
            var sampleCinemaResponse = new Cinemas({
                _id: '525cf20451979dea2c000001',
                name: 'New Cinema'
            });

            // Fixture mock form input values
            scope.name = 'New Cinema';

            // Set POST response
            $httpBackend.expectPOST('cinemas', sampleCinemaPostData).respond(sampleCinemaResponse);

            // Run controller functionality
            scope.create();
            $httpBackend.flush();

            // Test form inputs are reset
            expect(scope.name).toEqual('');

            // Test URL redirection after the Cinema was created
            expect($location.path()).toBe('/cinemas/' + sampleCinemaResponse._id);
        }));

        it('$scope.update() should update a valid Cinema', inject(function (Cinemas) {
            // Define a sample Cinema put data
            var sampleCinemaPutData = new Cinemas({
                _id: '525cf20451979dea2c000001',
                name: 'New Cinema'
            });

            // Mock Cinema in scope
            scope.cinema = sampleCinemaPutData;

            // Set PUT response
            $httpBackend.expectPUT(/cinemas\/([0-9a-fA-F]{24})$/).respond();

            // Run controller functionality
            scope.update();
            $httpBackend.flush();

            // Test URL location to new object
            expect($location.path()).toBe('/cinemas/' + sampleCinemaPutData._id);
        }));

        it('$scope.remove() should send a DELETE request with a valid cinemaId and remove the Cinema from the scope', inject(function (Cinemas) {
            // Create new Cinema object
            var sampleCinema = new Cinemas({
                _id: '525a8422f6d0f87f0e407a33'
            });

            // Create new Cinemas array and include the Cinema
            scope.cinemas = [sampleCinema];

            // Set expected DELETE response
            $httpBackend.expectDELETE(/cinemas\/([0-9a-fA-F]{24})$/).respond(204);

            // Run controller functionality
            scope.remove(sampleCinema);
            $httpBackend.flush();

            // Test array after successful delete
            expect(scope.cinemas.length).toBe(0);
        }));
    });
}());
