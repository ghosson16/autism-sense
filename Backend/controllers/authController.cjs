const bcrypt = require('bcrypt');
const childModel = require('../models/ChildSchema.cjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// Signup
const signUp = async (req, res) => {
  try {
    const existingChild = await childModel.findOne({ email: req.body.email });
    if (existingChild) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newChild = new childModel({ ...req.body, password: hashedPassword });
    await newChild.save();
    res.status(201).json({ message: 'Child data saved successfully' , user:newChild});
  } catch (err) {
    res.status(500).json({ message: 'Error saving child data', error: err.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingChild = await childModel.findOne({ email });
    if (!existingChild) {
      return res.status(404).json({ message: 'No records found' });
    }
    const passwordMatch = await bcrypt.compare(password, existingChild.password);
    if (passwordMatch) {
      req.session.user = {
        id: existingChild.id,
        firstName: existingChild.firstName,
        lastName: existingChild.lastName,
        email: existingChild.email,
        photo: existingChild.photo,
        dob: existingChild.dob,
      };
      res.json({ message: "Login successful" , user: req.session.user });
    } else {
      res.status(401).json({ message: 'Email or password is incorrect' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Logout
const logout = (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.status(500).json({ message: 'Failed to logout', error: err.message });
      } else {
        res.status(200).json({ message: 'Logout successful' });
      }
    });
  } else {
    res.status(400).json({ message: 'No session found' });
  }
};

// Send reset password email
const sendPasswordResetEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await childModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    // Generate a token
    const token = crypto.randomBytes(20).toString('hex');
    const resetToken = jwt.sign({ userId: user._id, token }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set resetToken and expiry on user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email with the reset link
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Or any other service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      from: 'noreply@autism-sense.com',
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested a password reset for your account.
             Please click on the following link, or paste this into your browser to complete the process:
             https://ghosson16.github.io/autism-sense/#/reset-password/${resetToken}`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(500).json({ message: 'Error sending email' });
      }
      console.log('Email sent: ', info.response); // Add logging for tracking
      res.json({ message: 'Password reset email sent' });
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Reset password using the token
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await childModel.findById(decoded.userId);
    if (!user || user.resetPasswordToken !== token || user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash new password and save
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Optional: Notify user after password is reset
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetMailOptions = {
      to: user.email,
      from: 'noreply@autism-sense.com',
      subject: 'Password Successfully Reset',
      text: 'Your password has been successfully reset.'
    };

    transporter.sendMail(resetMailOptions, (err, info) => {
      if (err) {
        console.error('Error sending password reset confirmation email:', err);
      }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Export all controllers
module.exports = { signUp, login, logout, sendPasswordResetEmail, resetPassword };
