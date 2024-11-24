import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";
import AuthModal from "./Authentication/AuthModal";
import lottie from "lottie-web/build/player/lottie_light";
import { defineElement } from "@lordicon/element";

const LandingPage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();
  const footerSectionsRef = useRef([]); // Ref for each footer section

  const handleSignInUp = () => {
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  // Intersection Observer for Scroll Animation
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1, // Trigger when 10% of the section is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible"); // Show on scroll down
        } else {
          entry.target.classList.remove("visible"); // Hide on scroll up
        }
      });
    }, observerOptions);

    // Observe each footer section
    footerSectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    // Cleanup observer on component unmount
    return () => {
      footerSectionsRef.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="landing-container">
      <div className="logo-container"></div>
      <br />

      <section className="button-container">
        <button className="btn therapist-button" onClick={() => navigate("/host")}>
          <lord-icon
            src="https://cdn.lordicon.com/uwixxspd.json"
            trigger="morph"
            colors="primary:#000000,secondary:#3a3347,tertiary:#faddd1,quaternary:#e5e0e9,quinary:#545454,senary:#87ceed"
            className="therapist-icon"
            style={{ width: "140px", height: "140px" }}
          ></lord-icon>
          I'M A THERAPIST
        </button>

        <button className="btn child-button" onClick={handleSignInUp}>
          <lord-icon
            src="https://cdn.lordicon.com/cfbvvbil.json"
            trigger="morph"
            colors="primary:#000000,secondary:#faddd1,tertiary:#3a3347,quaternary:#f28ba8,quinary:#f49cc8"
            className="child-icon"
            style={{ width: "140px", height: "140px"}}
          ></lord-icon>
          I'M A CHILD
        </button>
      </section>
      <br />
      {showAuthModal && <AuthModal onClose={closeAuthModal} />}
      <br />

      {/* Footer Section */}
      <div className="footer-container">
        <div className="footer-section about" ref={(el) => (footerSectionsRef.current[0] = el)}>
          <lord-icon
            src="https://cdn.lordicon.com/ofzpbawy.json"
            trigger="loop"
            delay="4000"
            stroke="bold"
            colors="primary:#121331,secondary:#ebe6ef,tertiary:#e4e4e4,quaternary:#87ceed"
            className="footer-icon"
            style={{ width: "140px", height: "140px" }}
          ></lord-icon>
          <h2>Community & Inclusion</h2>
          <p>
            The gray puzzle symbolizes the community, and the sky-blue piece represents each autistic child joining it. AutismSense helps children with High-Functioning Autism (HFA) connect and engage with others comfortably.
          </p>
        </div>

        <div className="footer-section mission" ref={(el) => (footerSectionsRef.current[1] = el)}>
          <lord-icon
            src="https://cdn.lordicon.com/fmjvulyw.json"
            trigger="loop"
            delay="4000"
            stroke="bold"
            colors="primary:#121331,secondary:#ffffff,tertiary:#3a3347,quaternary:#87ceed,quinary:#f9c9c0,senary:#f24c00"
            className="footer-icon"
            style={{ width: "140px", height: "140px" }}
          ></lord-icon>
          <h2>Our Vision</h2>
          <p>
            We envision a world where children with High-Functioning Autism (HFA) can connect with others effortlessly. Through AutismSense, we use technology to make communication accessible, engaging, and secure, creating inclusive spaces for all families.
          </p>
        </div>

        <div className="footer-section features" ref={(el) => (footerSectionsRef.current[2] = el)}>
          <lord-icon
            src="https://cdn.lordicon.com/eewfjpmj.json"
            trigger="loop"
            delay="4000"
            stroke="bold"
            colors="primary:#121331,secondary:#ffffff,tertiary:#e8e230,quaternary:#9cc2f4"
            className="footer-icon"
            style={{ width: "140px", height: "140px" }}
          ></lord-icon>
          <h2>Key Features</h2>
          <p className="features-list">
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
