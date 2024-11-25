import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../../services/authService';
import '../../styles/AuthModal.css';

const ResetPassword = () => {
  const { token } = useParams(); // Get token from URL
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const validatePasswordStrength = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!regex.test(password)) {
      return 'Password must be at least 8 characters long, including an uppercase letter, a lowercase letter, and a number.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validate Password Strength
    const passwordValidationError = validatePasswordStrength(password);
    if (passwordValidationError) {
      setError(passwordValidationError);
      return;
    }

    // Check Password Match
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please ensure both passwords are identical.');
      return;
    }

    try {
      await resetPassword(token, password);
      setSuccessMessage('Password has been successfully reset. You can now log in with your new password.');
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError('Invalid or expired token. Please request a new password reset link.');
      } else {
        setError('Unable to reset password. Please try again later.');
      }
    }
  };

  const handleClose = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="auth-modal">
      <div className="auth-modal-content">
        <button className="close-button" onClick={handleClose}>
          &times;
        </button>
        <div className="form-container">
          <h2>Reset Your Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={handlePasswordChange}
                required
                className={`input-field ${error && !successMessage ? "error" : ""}`}
                aria-describedby="password-error"
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
                className={`input-field ${error && !successMessage ? "error" : ""}`}
                aria-describedby="confirm-password-error"
              />
            </div>
            {error && (
              <p id="password-error" className="error-message" aria-live="assertive">
                {error}
              </p>
            )}
            {successMessage && (
              <p className="success-message" aria-live="polite">
                {successMessage}
              </p>
            )}
            <div className="form-buttons" style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
              <button type="submit" className="reset-btn">
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
