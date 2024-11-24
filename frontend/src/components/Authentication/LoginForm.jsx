import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import EnterInput from "../EnterInput"; // Adjust path based on your structure
import '../../styles/AuthModal.css';

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

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
    setPasswordError(validatePassword(value) ? "" : "Invalid password. Please try again.");
  };

  // Simplified handleLogin to confirm "Enter" works as expected
  const handleLogin = async (e) => {
    if (e) e.preventDefault(); // Add this to handle cases where this is invoked via button click

    // Ensure that there are no validation errors before submission
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    if (!validatePassword(password)) {
      setPasswordError("Invalid password. Please try again.");
      return;
    }

    setIsSubmitting(true);
    setLoginError("");

    try {
      const result = await login(email, password);
      if (result.message === "Login successful" && result.user) {
        localStorage.setItem('childData', JSON.stringify(result.user));
        navigate("/home");
      } else {
        setLoginError(result.message || "Invalid email or password");
      }
    } catch (err) {
      setLoginError("An error occurred during login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <EnterInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            required
            ref={emailRef}
            onEnter={() => passwordRef.current.focus()}
            className={`input-field ${emailError ? "error" : ""}`}
            aria-describedby="email-error"
          />
          {emailError && (
            <span
              id="email-error"
              className="error-message"
              aria-live="assertive"
            >
              {emailError}
            </span>
          )}
        </div>
        <div className="form-group">
          <EnterInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
            ref={passwordRef}
            onEnter={handleLogin}
            className={`input-field ${passwordError ? "error" : ""}`}
            aria-describedby="password-error"
          />
          {passwordError && (
            <span
              id="password-error"
              className="error-message"
              aria-live="assertive"
            >
              {passwordError}
            </span>
          )}
        </div>
        {loginError && (
          <span className="error-message" aria-live="assertive">
            {loginError}
          </span>
        )}

        <div
          className="form-buttons"
          style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
        >
          <button
            type="submit"
            className="add-child-btn"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;