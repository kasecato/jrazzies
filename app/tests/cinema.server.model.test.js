'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Cinema = mongoose.model('Cinema');

/**
 * Globals
 */
var user, cinema;

/**
 * Unit tests
 */
describe('Cinema Model Unit Tests:', function () {
    beforeEach(function (done) {
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password'
        });

        user.save(function () {
            cinema = new Cinema({
                name: 'Cinema Name',
                user: user
            });

            done();
        });
    });

    describe('Method Save', function () {
        it('should be able to save without problems', function (done) {
            return cinema.save(function (err) {
                should.not.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without name', function (done) {
            cinema.name = '';

            return cinema.save(function (err) {
                should.exist(err);
                done();
            });
        });
    });

    afterEach(function (done) {
        Cinema.remove().exec();
        User.remove().exec();

        done();
    });
});
