const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    minlength: 2,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    minlength: 2,
  },
  dob: {
    type: Date,
    required: [true, 'Date of birth is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
  },
  photo: {
    type: String, // URL or path to the photo
    default: '', // Default empty string if no photo is uploaded
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

const Child = mongoose.model('Child', childSchema);

module.exports = Child;