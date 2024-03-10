const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min:2,
    max:20,
    unique:false,
    trim: true,
    default:null
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    unique:true,
    min:8
  },
  resetPasswordToken: {
    type: String,
    default: null, // You can set this to null initially
  },
  resetPasswordExpires: {
    type: Date,
    default: null, // You can set this to null initially
  },



 
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
