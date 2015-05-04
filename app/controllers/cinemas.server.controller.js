'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Cinema = mongoose.model('Cinema'),
    _ = require('lodash');

/**
 * Create a Cinema
 */
exports.create = function (req, res) {
    var cinema = new Cinema(req.body);
    cinema.user = req.user;

    cinema.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(cinema);
        }
    });
};

/**
 * Show the current Cinema
 */
exports.read = function (req, res) {
    res.jsonp(req.cinema);
};

/**
 * Update a Cinema
 */
exports.update = function (req, res) {
    var cinema = req.cinema;

    req.body.updated = new Date();

    cinema = _.extend(cinema, req.body);

    cinema.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(cinema);
        }
    });
};

/**
 * Delete an Cinema
 */
exports.delete = function (req, res) {
    var cinema = req.cinema;

    cinema.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(cinema);
        }
    });
};

/**
 * List of Cinemas
 */
exports.list = function (req, res) {
    Cinema.find().sort('-created').populate('user', 'displayName').exec(function (err, cinemas) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(cinemas);
        }
    });
};

/**
 * Cinema middleware
 */
exports.cinemaByID = function (req, res, next, id) {
    Cinema.findById(id).populate('user', 'displayName').exec(function (err, cinema) {
        if (err) return next(err);
        if (!cinema) return next(new Error('Failed to load Cinema ' + id));
        req.cinema = cinema;
        next();
    });
};

/**
 * Cinema authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.cinema.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
