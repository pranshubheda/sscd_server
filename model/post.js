let mongoose = require('mongoose');

let postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    body: {
        type: String,
        required: true,
    }
  });

module.exports = mongoose.model('Post', postSchema);
