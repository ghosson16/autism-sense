const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    minlength: 8, // Keep the minlength constraint but remove custom validation
  },
  photo: {
    type: String, // URL or path to the photo
    default: null, // Indicates no photo was uploaded
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

// Password hashing middleware
childSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash password if modified
  this.password = await bcrypt.hash(this.password, 10); // Hash the password
  next();
});

// Method to compare passwords
childSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Child = mongoose.model('Child', childSchema);

module.exports = Child;
