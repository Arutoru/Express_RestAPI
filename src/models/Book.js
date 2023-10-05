const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  author: {
    type: String,
  },
  publishedDate: {
    type: Date,
  }
});

module.exports = mongoose.model('Book', bookSchema);
