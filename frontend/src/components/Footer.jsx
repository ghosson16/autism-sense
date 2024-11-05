// Footer.js
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        textAlign: "center",
        padding: "10px",
        color: "#008f7a",
        fontSize: "0.9em",

      }}
    >
      <Link to="/about-us" style={{ color: "#008f7a", marginRight: "10px" }}>
        About Us
      </Link>
      <p>&copy; 2024 AutismSense. All rights reserved.</p>
    </footer>
  );
};

export default Footer;