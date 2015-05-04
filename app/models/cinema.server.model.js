'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Cinema Schema
 */
var CinemaSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill Cinema name',
        trim: true
    },
    rate: {
        type: Number,
        required: 'Please rate'
    },
    comment: {
        type: String,
        default: '',
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Cinema', CinemaSchema);
