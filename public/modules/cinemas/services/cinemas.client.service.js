'use strict';

//Cinemas service used to communicate Cinemas REST endpoints
angular.module('cinemas').factory('Cinemas', ['$resource',
    function ($resource) {
        return $resource('cinemas/:cinemaId', {
            cinemaId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
