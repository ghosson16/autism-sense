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
      <section className="button-container">
      <button
        className="btn therapist-button"
        onClick={() => navigate("/host")}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px' }}
      >
        <lord-icon
          src="https://cdn.lordicon.com/uwixxspd.json"
          trigger="morph"
          colors="primary:#000000,secondary:#3a3347,tertiary:#faddd1,quaternary:#e5e0e9,quinary:#545454,senary:#87ceed"
          style={{ width: '140px', height: '140px' }}
          class="therapist-icon"
        ></lord-icon>
        I'M A THERAPIST
      </button>

      <button
        className="btn child-button"
        onClick={handleSignInUp}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px' }}
      >
        <lord-icon
          src="https://cdn.lordicon.com/cfbvvbil.json"
          trigger="morph"
          colors="primary:#000000,secondary:#faddd1,tertiary:#3a3347,quaternary:#f28ba8,quinary:#f49cc8"
          style={{ width: '140px', height: '140px' }}
          class="child-icon"
        ></lord-icon>
        I'M A CHILD
      </button>
    </section>
      {showAuthModal && <AuthModal onClose={closeAuthModal} />}
      <footer className="landing-footer">
        <Link to="/about-us">About Us</Link>
        <p>&copy; 2024 AutismSense. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
