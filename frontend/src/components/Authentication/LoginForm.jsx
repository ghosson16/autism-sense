import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { login } from "../../services/authService";
import '../../styles/AuthModal.css';

const LoginForm = ({ onCancel }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate(); // Initialize navigate

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value) ? "" : "Please enter a valid email address.");
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value) ? "" : "Password must be at least 8 characters long and contain both letters and numbers.");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError("");

    try {
      const result = await login(email, password);
      if (result.message === "Login successful" && result.user) {
        console.log("Navigating with user:", result.user);
        navigate("/home", { state: { user: result.user } }); // Navigate to /home after successful login
      } else {
        setLoginError(result.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setLoginError("An error occurred during login. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            required
            className={`input-field ${emailError ? "error" : ""}`}
          />
          {emailError && <span className="error-message">{emailError}</span>}
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
            className={`input-field ${passwordError ? "error" : ""}`}
          />
          {passwordError && <span className="error-message">{passwordError}</span>}
        </div>
        {loginError && <span className="error-message">{loginError}</span>}
        <div className="form-buttons">
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="add-child-btn" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
