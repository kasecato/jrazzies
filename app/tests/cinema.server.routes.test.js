'use strict';

var should = require('should'),
    request = require('supertest'),
    app = require('../../server'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Cinema = mongoose.model('Cinema'),
    agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, cinema;

/**
 * Cinema routes tests
 */
describe('Cinema CRUD tests', function () {
    beforeEach(function (done) {
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

        // Save a user to the test db and create new Cinema
        user.save(function () {
            cinema = {
                name: 'Cinema Name'
            };

            done();
        });
    });

    it('should be able to save Cinema instance if logged in', function (done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Cinema
                agent.post('/cinemas')
                    .send(cinema)
                    .expect(200)
                    .end(function (cinemaSaveErr, cinemaSaveRes) {
                        // Handle Cinema save error
                        if (cinemaSaveErr) done(cinemaSaveErr);

                        // Get a list of Cinemas
                        agent.get('/cinemas')
                            .end(function (cinemasGetErr, cinemasGetRes) {
                                // Handle Cinema save error
                                if (cinemasGetErr) done(cinemasGetErr);

                                // Get Cinemas list
                                var cinemas = cinemasGetRes.body;

                                // Set assertions
                                (cinemas[0].user._id).should.equal(userId);
                                (cinemas[0].name).should.match('Cinema Name');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to save Cinema instance if not logged in', function (done) {
        agent.post('/cinemas')
            .send(cinema)
            .expect(401)
            .end(function (cinemaSaveErr, cinemaSaveRes) {
                // Call the assertion callback
                done(cinemaSaveErr);
            });
    });

    it('should not be able to save Cinema instance if no name is provided', function (done) {
        // Invalidate name field
        cinema.name = '';

        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Cinema
                agent.post('/cinemas')
                    .send(cinema)
                    .expect(400)
                    .end(function (cinemaSaveErr, cinemaSaveRes) {
                        // Set message assertion
                        (cinemaSaveRes.body.message).should.match('Please fill Cinema name');

                        // Handle Cinema save error
                        done(cinemaSaveErr);
                    });
            });
    });

    it('should be able to update Cinema instance if signed in', function (done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Cinema
                agent.post('/cinemas')
                    .send(cinema)
                    .expect(200)
                    .end(function (cinemaSaveErr, cinemaSaveRes) {
                        // Handle Cinema save error
                        if (cinemaSaveErr) done(cinemaSaveErr);

                        // Update Cinema name
                        cinema.name = 'WHY YOU GOTTA BE SO MEAN?';

                        // Update existing Cinema
                        agent.put('/cinemas/' + cinemaSaveRes.body._id)
                            .send(cinema)
                            .expect(200)
                            .end(function (cinemaUpdateErr, cinemaUpdateRes) {
                                // Handle Cinema update error
                                if (cinemaUpdateErr) done(cinemaUpdateErr);

                                // Set assertions
                                (cinemaUpdateRes.body._id).should.equal(cinemaSaveRes.body._id);
                                (cinemaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should be able to get a list of Cinemas if not signed in', function (done) {
        // Create new Cinema model instance
        var cinemaObj = new Cinema(cinema);

        // Save the Cinema
        cinemaObj.save(function () {
            // Request Cinemas
            request(app).get('/cinemas')
                .end(function (req, res) {
                    // Set assertion
                    res.body.should.be.an.Array.with.lengthOf(1);

                    // Call the assertion callback
                    done();
                });

        });
    });


    it('should be able to get a single Cinema if not signed in', function (done) {
        // Create new Cinema model instance
        var cinemaObj = new Cinema(cinema);

        // Save the Cinema
        cinemaObj.save(function () {
            request(app).get('/cinemas/' + cinemaObj._id)
                .end(function (req, res) {
                    // Set assertion
                    res.body.should.be.an.Object.with.property('name', cinema.name);

                    // Call the assertion callback
                    done();
                });
        });
    });

    it('should be able to delete Cinema instance if signed in', function (done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Cinema
                agent.post('/cinemas')
                    .send(cinema)
                    .expect(200)
                    .end(function (cinemaSaveErr, cinemaSaveRes) {
                        // Handle Cinema save error
                        if (cinemaSaveErr) done(cinemaSaveErr);

                        // Delete existing Cinema
                        agent.delete('/cinemas/' + cinemaSaveRes.body._id)
                            .send(cinema)
                            .expect(200)
                            .end(function (cinemaDeleteErr, cinemaDeleteRes) {
                                // Handle Cinema error error
                                if (cinemaDeleteErr) done(cinemaDeleteErr);

                                // Set assertions
                                (cinemaDeleteRes.body._id).should.equal(cinemaSaveRes.body._id);

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to delete Cinema instance if not signed in', function (done) {
        // Set Cinema user
        cinema.user = user;

        // Create new Cinema model instance
        var cinemaObj = new Cinema(cinema);

        // Save the Cinema
        cinemaObj.save(function () {
            // Try deleting Cinema
            request(app).delete('/cinemas/' + cinemaObj._id)
                .expect(401)
                .end(function (cinemaDeleteErr, cinemaDeleteRes) {
                    // Set message assertion
                    (cinemaDeleteRes.body.message).should.match('User is not logged in');

                    // Handle Cinema error error
                    done(cinemaDeleteErr);
                });

        });
    });

    afterEach(function (done) {
        User.remove().exec();
        Cinema.remove().exec();
        done();
    });
});
