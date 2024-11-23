import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VideoRoom from "./VideoRoom";
import "../../styles/Meeting.css";
import { startMeeting } from "../../services/videoService"; // Import the service function

const GuestMeeting = () => {
  const [roomName, setRoomName] = useState(""); // state for room name
  const [token, setToken] = useState(null); // state for token
  const [errorMessage, setErrorMessage] = useState(""); // state for error messages
  const navigate = useNavigate();

  // Load the room name and token from localStorage when the component mounts
  useEffect(() => {
    const savedRoomName = localStorage.getItem('roomName');
    const savedToken = localStorage.getItem('token');

    if (savedToken && savedRoomName) {
      // If both the token and roomName are found, directly set the state and skip the room name input
      setToken(savedToken);
      setRoomName(savedRoomName);
    }

    // Dynamically load the Lord Icon library (it only needs to be loaded once)
    const script = document.createElement("script");
    script.src = "https://cdn.lordicon.com/lordicon.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Save the room name to localStorage whenever it changes
  useEffect(() => {
    if (roomName) {
      localStorage.setItem('roomName', roomName);
    }
  }, [roomName]);

  // Handle joining the meeting
  const joinMeeting = async () => {
    try {
      const newToken = await startMeeting(roomName, "guest"); // Get token from service
      setToken(newToken); // Save the token in the state
      localStorage.setItem('token', newToken); // Store the token in localStorage
      setErrorMessage(""); // Clear any previous errors
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage("Room does not exist. Please check the room link.");
      } else {
        console.error("Error joining meeting:", error);
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  // Handle leaving the meeting
  const leaveMeeting = () => {
    // Clear the room name and token from localStorage and state
    localStorage.removeItem('roomName');
    localStorage.removeItem('token');
    setRoomName(""); // Clear room name from state
    setToken(null); // Clear token from state
    setErrorMessage(""); // Clear any error message
    navigate("/"); // Optionally, navigate to the home page or some other page
  };

  // If token exists, render VideoRoom, else show room input modal
  return (
    <div className="meeting-container">
      {!token ? (
        <div className="overlay">
          <div className="modal">
            <button className="close-button" onClick={() => navigate(-1)}>
              X
            </button>
            <div className="icon-container">
              <lord-icon
                src="https://cdn.lordicon.com/jikbqoam.json"
                trigger="loop"
                delay="2000"
                stroke="bold"
                state="morph-turn-on"
                style={{ width: "100px", height: "100px" }}
              ></lord-icon>
            </div>

            <h2 className="modal-header">Quick Tips Before you start!</h2>
            <ol className="tips-list">
              <li>
                <strong>Join the Meeting:</strong> Paste in the room name shared by the therapist, then click (Join Meeting) to enter.
              </li>
              <li>
                <strong>Watch for Emotions:</strong> Icons will appear that show how the therapist is feeling. Try to pay attention to these icons to understand different emotions.
              </li>
              <li>
                <strong>Need Help?</strong> If you’re not sure what to say, click the Help button for some ideas.
              </li>
              <li>
                <strong>Play the Emotion Game:</strong> You can start a game to practice recognizing emotions. It’s fun and helps you learn!
              </li>
              <li>
                <strong>For the Best Experience:</strong> Use Google Chrome or Firefox as your browser.
              </li>
            </ol>

            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)} // Update room name state
              placeholder="Enter the invitation's link"
              className="input-field"
            />
            <button className="start-button" onClick={joinMeeting}>
              Join Meeting
            </button>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          </div>
        </div>
      ) : (
          <VideoRoom token={token} roomName={roomName} role="guest" />
      )}
    </div>
  );
};

export default GuestMeeting;
