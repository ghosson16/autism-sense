import React, { useState } from 'react';
//import '../../styles/MeetingPage.css'; // Custom CSS for this layout

const MeetingPage = ({ zoomLink }) => {
  // For handling mic, video toggle states
  const [isMicOn, setMicOn] = useState(true);
  const [isVideoOn, setVideoOn] = useState(true);

  const handleEndCall = () => {
    // Handle end call logic (perhaps redirect to a home page or logout)
    window.location.href = '/';
  };

  const handleMicToggle = () => {
    setMicOn(!isMicOn);
    // Handle mic toggle logic
  };

  const handleVideoToggle = () => {
    setVideoOn(!isVideoOn);
    // Handle video toggle logic
  };

  const handleHelpClick = () => {
    // Handle help button logic (can open a help modal or redirect)
    alert('Help is on the way!');
  };

  const handleGameClick = () => {
    // Handle game button click (can open a game module or redirect)
    alert('Game will start soon!');
  };

  return (
    <div className="meeting-container">
      {/* Video section, you can embed the Zoom meeting here */}
      <div className="video-section">
        {/* Placeholder for video or embed */}
        <iframe 
          src={zoomLink} 
          title="Zoom Meeting" 
          frameBorder="0" 
          className="zoom-frame" 
        ></iframe>
        {/* Placeholder for emotion icon */}
        <div className="emotion-icon">
          <span>😊</span>
        </div>
      </div>

      {/* Control buttons */}
      <div className="controls">
        <div className="left-controls">
          <button onClick={handleEndCall}>End Call</button>
          <button onClick={handleVideoToggle}>
            {isVideoOn ? 'Video On' : 'Video Off'}
          </button>
          <button onClick={handleMicToggle}>
            {isMicOn ? 'Mic On' : 'Mic Off'}
          </button>
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="bottom-controls">
        <button onClick={handleHelpClick} className="help-button">Help!</button>
        <button onClick={handleGameClick} className="game-button">Game</button>
      </div>
    </div>
  );
};

export default MeetingPage;
