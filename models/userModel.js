const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter Username'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your Email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please enter your Password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your Password'],
  },
  photo: {
    type: String,
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
