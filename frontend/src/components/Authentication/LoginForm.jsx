import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService"; // Import login function
import '../../styles/LoginForm.css'

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState(""); // New state for login error

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!validateEmail(value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (!validatePassword(value)) {
      setPasswordError("Password must be at least 8 characters long and contain both letters and numbers.");
    } else {
      setPasswordError("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters long and contain both letters and numbers.");
      return;
    }

    try {
      const result = await login(email, password);
      console.log('Login result:', result); 
      if (result.message === "Login successful") {
        if (result.user) {
          console.log('Navigating with user:', result.user);
          navigate("/home", { state: { user: result.user } });
        } else {
          console.error('No user data received from backend');
          setLoginError("No user data received.");
        }
      } else {
        setLoginError(result.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setLoginError("An error occurred during login. Please try again.");
      console.error("Login error:", err);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleForgetPassword = () => {
    navigate("/forget-password");
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
            className="input-field"
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
            className="input-field"
          />
          {passwordError && <span className="error-message">{passwordError}</span>}
        </div>
        <div>
          <button type="button" className="forget-btn" onClick={handleForgetPassword}>
            Forget password?
          </button>
        </div>
        {loginError && <span className="error-message">{loginError}</span>} {/* Display login errors */}
        <div className="form-buttons">
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="add-child-btn">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
