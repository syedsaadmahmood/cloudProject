'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Item Schema
 */
var ItemSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  item: {
    type: String,
    default: '',
    trim: true,
    required: 'Item cannot be blank'
  },
  price: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Item', ItemSchema);
