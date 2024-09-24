const express = require('express');
const { signUp, login, logout, sendPasswordResetEmail, resetPassword } = require('../controllers/authController.cjs');

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/logout', logout);

router.post('/forgot-password', sendPasswordResetEmail);
router.post('/reset-password/:token', resetPassword);


module.exports = router;
