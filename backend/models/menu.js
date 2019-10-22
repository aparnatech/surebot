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
