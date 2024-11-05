import React, { useState } from "react";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";
import ForgetPasswordForm from "./ForgetPasswordForm"; // Import ForgetPasswordForm
import "../../styles/AuthModal.css";

const AuthModal = ({ onClose }) => {
  const [mode, setMode] = useState("login"); // Start with login view

  const toggleMode = (newMode) => {
    setMode(newMode);
  };

  return (
    <div className="auth-modal">
      <div className="auth-modal-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        {/* Display different forms based on the mode */}
        {mode === "login" && <LoginForm onCancel={onClose} />}
        {mode === "sign-up" && <SignUpForm onCancel={onClose} />}
        {mode === "forget-password" && <ForgetPasswordForm onCancel={onClose} />}

        <p className="toggle-text">
          {mode === "login" && (
            <>
              <button className="forget-btn" onClick={() => toggleMode("forget-password")}>
                Forgot Password?
              </button>
              <br /> <br />
              Don't have an account?{" "}
              <span className="toggle-link" onClick={() => toggleMode("sign-up")}>
                Sign up
              </span>
            </>
          )}
          {mode === "sign-up" && (
            <>
              Already have an account?{" "}
              <span className="toggle-link" onClick={() => toggleMode("login")}>
                Login
              </span>
            </>
          )}
          {mode === "forget-password" && (
            <>
              Remembered your password?{" "}
              <span className="toggle-link" onClick={() => toggleMode("login")}>
                Login
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
