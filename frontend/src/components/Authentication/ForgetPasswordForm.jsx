import React, { useState } from "react";
import { sendResetPasswordEmail } from "../../services/authService"; // Import reset password email function
import '../../styles/AuthModal.css';

const ForgetPasswordForm = ({ onCancel }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false); // Track loading state

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

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const result = await sendResetPasswordEmail(email);
      if (result.message === "Password reset email sent") {
        alert("Check your email for a password reset link");
        onCancel(); // Close the modal on success
      }
    } catch (err) {
      console.error("Error during reset password:", err);
      setServerError("An error occurred while sending the reset email. Please try again.");
    } finally {
      setLoading(false); // Reset loading state after request
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
          />
          {emailError && <span className="error-message">{emailError}</span>}
          {serverError && <span className="server-error-message">{serverError}</span>}
        </div>
        <div className="form-buttons">
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Email'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgetPasswordForm;
