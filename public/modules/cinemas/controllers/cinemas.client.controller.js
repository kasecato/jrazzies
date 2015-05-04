'use strict';

// Cinemas controller
angular.module('cinemas').controller('CinemasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Cinemas',
    function ($scope, $stateParams, $location, Authentication, Cinemas) {
        $scope.authentication = Authentication;

        // Create new Cinema
        $scope.create = function () {
            // Create new Cinema object
            var cinema = new Cinemas({
                name: this.name,
                rate: this.$$childHead.rate,
                comment: this.comment
            });

            // Redirect after save
            cinema.$save(function (response) {
                $location.path('cinemas/' + response._id);

                // Clear form fields
                $scope.name = '';
                $scope.rate = 1;
                $scope.comment = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Cinema
        $scope.remove = function (cinema) {
            if (cinema) {
                cinema.$remove();

                for (var i in $scope.cinemas) {
                    if ($scope.cinemas [i] === cinema) {
                        $scope.cinemas.splice(i, 1);
                    }
                }
            } else {
                $scope.cinema.$remove(function () {
                    $location.path('cinemas');
                });
            }
        };

        // Update existing Cinema
        $scope.update = function () {
            var cinema = $scope.cinema;

            cinema.$update(function () {
                $location.path('cinemas/' + cinema._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Cinemas
        $scope.find = function () {
            $scope.cinemas = Cinemas.query();
        };

        // Find existing Cinema
        $scope.findOne = function () {
            $scope.cinema = Cinemas.get({
                cinemaId: $stateParams.cinemaId
            });
        };
    }
]);
