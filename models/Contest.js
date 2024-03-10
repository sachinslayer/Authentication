const mongoose = require('mongoose');
const User = require('./UserModel');

// Define a schema for the Contest
const contestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  entryFee: {
    type: String,
    required: true,
  },
  prizePool: {
    type: String,
    required: true,
  },
  maxParticipants: {
    type: Number,
    default: 2, // Set the maximum participants to 2
    validate: {
      validator: function (value) {
        return value === 2;
      },
      message: 'Only two participants are allowed.',
    },
  },
  participants: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
      },
    ],
    validate: [participantsLimit, 'Contest is full'],
  }
  
});

// Custom validator function to limit participants to 2
function participantsLimit(val) {
  return val.length <= 2;
}

// Create a model for the Contest
const Contest = mongoose.model('Contest', contestSchema);

module.exports = Contest;
