'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Customer Schema
 */
var CustomerSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  firstName: {
    type: String,
    default: '',
    trim: true,
  },
    number: {
        type: String,
        default: '',
        trim: true,
    },
    country: {
        type: String,
        default: '',
        trim: true,
    },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Customer', CustomerSchema);
