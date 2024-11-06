import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";
import AuthModal from "./Authentication/AuthModal";
import lottie from "lottie-web";
import { defineElement } from "@lordicon/element";

const LandingPage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  const handleSignInUp = () => {
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  return (
    <div className="landing-container">
      <div className="logo-container"></div>
      <br /> <br /> <br />

      <section className="button-container">
        <button
          className="btn therapist-button"
          onClick={() => navigate("/host")}
          style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px" }}
        >
          <lord-icon
            src="https://cdn.lordicon.com/uwixxspd.json"
            trigger="morph"
            colors="primary:#000000,secondary:#3a3347,tertiary:#faddd1,quaternary:#e5e0e9,quinary:#545454,senary:#87ceed"
            style={{ width: "140px", height: "140px" }}
            className="therapist-icon"
          ></lord-icon>
          I'M A THERAPIST
        </button>

        <button
          className="btn child-button"
          onClick={handleSignInUp}
          style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px" }}
        >
          <lord-icon
            src="https://cdn.lordicon.com/cfbvvbil.json"
            trigger="morph"
            colors="primary:#000000,secondary:#faddd1,tertiary:#3a3347,quaternary:#f28ba8,quinary:#f49cc8"
            style={{ width: "140px", height: "140px" }}
            className="child-icon"
          ></lord-icon>
          I'M A CHILD
        </button>
      </section>
      <br />
      {showAuthModal && <AuthModal onClose={closeAuthModal} />}
      <br /> <br /> <br />

      {/* Footer Section */}
      <div className="footer-container">
        <div className="footer-section about" style={{ textAlign: "center" }}>
  <lord-icon
    src="https://cdn.lordicon.com/ofzpbawy.json"
    trigger="loop"
    delay="4000"
    stroke="bold"
    colors="primary:#121331,secondary:#ebe6ef,tertiary:#e4e4e4,quaternary:#87ceed"
    style={{ width: "100px", height: "100px", marginBottom: "10px" }}
  ></lord-icon>
  
          <h2> Community & Inclusion</h2>
          <p>
          The gray puzzle symbolizes the community, and the sky-blue piece represents each autistic child joining it. AutismSense helps children with High-Functioning Autism (HFA) connect and engage with others comfortably.                 </p>

          </div>
<div className="footer-section mission" style={{ textAlign: "center" }}>
  <lord-icon
    src="https://cdn.lordicon.com/fmjvulyw.json"
    trigger="loop"
    delay="4000"
    stroke="bold"
    colors="primary:#121331,secondary:#ffffff,tertiary:#3a3347,quaternary:#87ceed,quinary:#f9c9c0,senary:#f24c00"
    style={{ width: "100px", height: "100px", marginBottom: "10px" }}
  ></lord-icon>
  <h2>Our Vision</h2>
  <p> we invision a world where children with High-Functioning Autism (HFA) can connect with others effortlessly. Through AutismSense, we use technology to make communication accessible, engaging, and secure, creating inclusive spaces for all families.
          </p>
        </div>
        <div className="footer-section features" style={{ textAlign: "center" }}>
  <lord-icon
    src="https://cdn.lordicon.com/eewfjpmj.json"
    trigger="loop"
    delay="4000"
    stroke="bold"
    colors="primary:#121331,secondary:#ffffff,tertiary:#e8e230,quaternary:#9cc2f4"
    style={{ width: "100px", height: "100px", marginBottom: "10px" }}
  ></lord-icon >
          <h2>Key Features</h2>
          <p class="features-list">
  <span>Facial Expression Analysis to aid in understanding cues.</span>
  <span>Conversation Transcription for accessible communication.</span>
  <span>Gamified Learning to build social skills in a fun way.</span>
</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;