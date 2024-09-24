// eslint-disable-next-line no-unused-vars
import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import "../styles/LandingPage.css"; // Custom CSS file for styling
import Logo from "../images/logo.png"

const LandingPage = () => {
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate("/sign-up");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="landing-container">
      <div className="logo-container">
        <img
          src= {Logo}
          alt="AutismSense Logo"
          className="logo"
        />
        <h1 className="title">AutismSense</h1>
      </div>
      
      <button className="btn" onClick={handleCreateAccount}>
        Create An Account
      </button>
      <button className="btn" onClick={handleLogin}>
        Login
      </button>

      <footer className="landing-footer">
        <Link to="/about-us">About Us</Link>
        <p>&copy; 2024 AutismSense. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
