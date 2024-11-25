import React, { useState } from "react";
import { sendResetPasswordEmail } from "../../services/authService";
import '../../styles/AuthModal.css';

const ForgetPasswordForm = ({ onCancel }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (validateEmail(value)) {
      setEmailError("");
    } else {
      setEmailError("Please enter a valid email address.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setServerError("");

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const result = await sendResetPasswordEmail(email);
      if (result.message === "Password reset email sent") {
        setSuccessMessage("Check your email for a password reset link.");
        onCancel();
      }
    } catch (err) {
      console.error("Error during reset password:", err);
      setServerError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Forgot Password</h2>
      <p>If you forgot your password, enter your email and we will send you a reset link.</p>
      <form onSubmit={handleResetPassword}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            required
            className="input-field"
            aria-describedby="email-error"
          />
          {emailError && <span id="email-error" className="error-message">{emailError}</span>}
          {serverError && <span className="server-error-message">{serverError}</span>}
          {successMessage && <span className="success-message">{successMessage}</span>}
        </div>
        <div className="form-buttons" style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <button 
            type="submit" 
            className="reset-btn" 
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Email'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgetPasswordForm;