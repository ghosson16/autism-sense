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
    setPasswordError(validatePassword(value) ? "" : "Password must be at least 8 characters long and contain both letters and numbers.");
  };

  // Simplify handleLogin to confirm "Enter" works as expected
  const handleLogin = async (e) => {
    if (e) e.preventDefault(); // Add this to handle cases where this is invoked via button click

    setIsSubmitting(true);
    setLoginError("");

    try {
      const result = await login(email, password);
      if (result.message === "Login successful" && result.user) {
        localStorage.setItem('childData', JSON.stringify(result.user));
        navigate("/home");
      } else {
        setLoginError(result.message || "Login failed. Please try again.");
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
          />
          {emailError && <span className="error-message">{emailError}</span>}
        </div>
        <div className="form-group">
          <EnterInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
            ref={passwordRef} 
            onEnter={handleLogin} // Trigger handleLogin directly on Enter
            className={`input-field ${passwordError ? "error" : ""}`}
          />
          {passwordError && <span className="error-message">{passwordError}</span>}
        </div>
        {loginError && <span className="error-message">{loginError}</span>}
        
        <div className="form-buttons" style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <button type="submit" className="add-child-btn" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;