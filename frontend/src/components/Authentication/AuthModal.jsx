import React, { useState } from "react";
import "../../styles/AuthModal.css";
import ForgetPasswordForm from "./ForgetPasswordForm";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

const AuthModal = ({ onClose }) => {
  const [mode, setMode] = useState("login");

  const toggleMode = (newMode) => {
    setMode(newMode);
  };

  return (
    <div className="auth-modal">
      <div className="auth-modal-content">
        {/* Close button on the top right to close the modal */}
        <button className="close-button" onClick={onClose}>
          X
        </button>

        {/* Display different forms based on the mode */}
        {mode === "login" && <LoginForm />}
        {mode === "sign-up" && <SignUpForm />}
        {mode === "forget-password" && <ForgetPasswordForm />}

        <p className="toggle-text">
          {mode === "login" && (
            <>
              <br />
              Forgot password?{" "}
              <span className="toggle-link" onClick={() => toggleMode("forget-password")}>
                Reset password
              </span>
              <br />
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