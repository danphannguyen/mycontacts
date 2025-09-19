const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    maxlength: 20,
    minlength: 6,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);