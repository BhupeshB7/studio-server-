// models/Post.js

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  coverImage: String,
  title: String,
  details: String,
  content: String,
  images: [String],
});

const Portfolio = mongoose.model('Portfolio', postSchema);

module.exports = Portfolio;
