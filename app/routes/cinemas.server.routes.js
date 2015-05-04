'use strict';

module.exports = function (app) {
    var users = require('../../app/controllers/users.server.controller');
    var cinemas = require('../../app/controllers/cinemas.server.controller');

    // Cinemas Routes
    app.route('/cinemas')
        .get(cinemas.list)
        .post(users.requiresLogin, cinemas.create);

    app.route('/cinemas/:cinemaId')
        .get(cinemas.read)
        .put(users.requiresLogin, cinemas.hasAuthorization, cinemas.update)
        .delete(users.requiresLogin, cinemas.hasAuthorization, cinemas.delete);

    // Finish by binding the Cinema middleware
    app.param('cinemaId', cinemas.cinemaByID);
};
