'use strict';

//Setting up route
angular.module('cinemas').config(['$stateProvider',
    function ($stateProvider) {
        // Cinemas state routing
        $stateProvider.
            state('listCinemas', {
                url: '/cinemas',
                templateUrl: 'modules/cinemas/views/list-cinemas.client.view.html'
            }).
            state('createCinema', {
                url: '/cinemas/create',
                templateUrl: 'modules/cinemas/views/create-cinema.client.view.html'
            }).
            state('viewCinema', {
                url: '/cinemas/:cinemaId',
                templateUrl: 'modules/cinemas/views/view-cinema.client.view.html'
            }).
            state('editCinema', {
                url: '/cinemas/:cinemaId/edit',
                templateUrl: 'modules/cinemas/views/edit-cinema.client.view.html'
            });
    }
]);
