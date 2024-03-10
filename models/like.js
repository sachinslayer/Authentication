const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model if needed
    required: true,
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image', // Reference to the Image model
    required: true,
  },
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
