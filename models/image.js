const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
  },
  image: Buffer,
  likes: {
      type: Number,
      default: 0,
  },
  likesBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
  }],
});


const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
