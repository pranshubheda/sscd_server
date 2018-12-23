let mongoose = require('mongoose');

let userLocationSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        unique: true,
    },
    latitude: {
        type: String,
        required: true,
    },
    longitude: {
        type: String,
        required: true,
    }
  });

module.exports = mongoose.model('UserLocation', userLocationSchema);
