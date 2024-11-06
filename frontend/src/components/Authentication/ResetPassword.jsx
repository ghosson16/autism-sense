import React, { useState } from 'react';
import { useParams, useNavigate, replace } from 'react-router-dom';
import { resetPassword } from '../../services/authService';
import '../../styles/AuthModal.css';

const ResetPassword = ({ onClose }) => {
  const { token } = useParams(); // Get token from URL
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
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
      return 'Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, and one number.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordValidationError = validatePasswordStrength(password);
    if (passwordValidationError) {
      setError(passwordValidationError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await resetPassword(token, password);
      alert('Password has been reset. You can now log in with your new password.');
      navigate('/');
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError('Invalid or expired token.');
      } else {
        setError('Unable to reset password. Please try again later.');
      }
      console.error(err);
    }
  };

  const handleClose = () => {
    navigate('/', { replace: true });
  };
  

  return (
    <div className="auth-modal">
      <div className="auth-modal-content">
        <button className="close-btn" onClick={handleClose}>
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
                className="input-field"
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
                className="input-field"
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className="form-buttons" style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
              <button type="submit" className="reset-btn">Reset Password</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
