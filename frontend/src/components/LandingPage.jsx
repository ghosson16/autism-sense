import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/LandingPage.css";
import AuthModal from "./Authentication/AuthModal";

const LandingPage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const handleSignInUp = () => {
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  return (
    <div className="landing-container">
      <div className="logo-container"></div>
      <div className="button-container">
        <button className="btn" onClick={() => navigate("/host")}>
          Remote Person
        </button>
        <button className="btn" onClick={handleSignInUp}>
          Sign In/Up
        </button>
      </div>
      {showAuthModal && <AuthModal onClose={closeAuthModal} />}
      <footer className="landing-footer">
        <Link to="/about-us">About Us</Link>
        <p>&copy; 2024 AutismSense. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
