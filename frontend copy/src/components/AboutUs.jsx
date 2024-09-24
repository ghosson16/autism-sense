import React from 'react';
import '../styles/AboutUs.css'; // Optional: Include a CSS file for styling
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };
  
  return (
    <div className="container">
      <header className="header">
        <h1>Welcome to AutismSense</h1>
        <p>Your companion in creating a supportive environment for children with Autism.</p>
      </header>
      <section className="content">
        <p>
          AutismSense is dedicated to creating a supportive environment for children with 
          High-Functioning Autism (HFA). Our platform offers tools to assist in online interactions, 
          making them more accessible and engaging for children with HFA. We believe that every 
          child deserves the opportunity to connect with others in a way that is comfortable and 
          supportive.
        </p>
        <p>
          Our team is passionate about using technology to make a positive impact in the lives of 
          children and their families. We are committed to providing a platform that is both 
          user-friendly and effective in helping children with HFA navigate the challenges of 
          online communication.
        </p>
        <p>Features</p>
        <ul>
          <li>Facial Expression Analysis</li>
          <li>Conversation Transcription</li>
          <li>Gamified Learning Modules</li>
          <li>Profile Management</li>
        </ul>
      </section>

      <button className="btn" onClick={handleBack}>Back</button>

      <footer className="landing-footer">
        <p>&copy; 2024 AutismSense. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutUs;
