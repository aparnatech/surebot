const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Create Schema
const menuSchema = new Schema({
  image: {
    type: Schema.Types.Mixed,
    required: true
  },

  dishName: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  price: {
    type: Number,
    required: true,
    match: /^\d+(\.\d{2})?$/
  },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Menu = mongoose.model('MenuDetail', menuSchema);
