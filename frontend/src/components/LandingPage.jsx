import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import  "../images/staticLogo.png";
import  "../images/animatedLogo.gif";
import "../styles/LandingPage.css"; // Custom CSS file for styling

// Import the images


const LandingPage = () => {
  const navigate = useNavigate();

  const handleCreateMeeting = () => {
    navigate("/host");
  };

  const handleCreateAccount = () => {
    navigate("/sign-up");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="landing-container">
      <div className="logo-container">
      </div>

      {/* Section for creating a meeting in normal mode */}
      <button className="btn" onClick={handleCreateMeeting}>
        Create Meeting (Normal Mode)
      </button>

      {/* Navigation for login or sign-up */}
      <button className="btn" onClick={handleCreateAccount}>
        Create An Account
      </button>
      <button className="btn" onClick={handleLogin}>
        Login
      </button>

      <footer className="landing-footer">
        <Link to="/about-us">About Us</Link>
        <p>&copy; 2024 AutismSense. All rights reserved.</p>
        <a href="https://lordicon.com/">Icons by Lordicon.com</a>
      </footer>
    </div>
  );
};

export default LandingPage;