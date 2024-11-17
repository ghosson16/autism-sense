import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import VideoRoom from "./VideoRoom";
import { startMeeting } from "../../services/videoService";
import "../../styles/Meeting.css";

const HostMeeting = () => {
  const [roomName, setRoomName] = useState("");
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  // Load existing meeting details from localStorage
  useEffect(() => {
    const savedRoomName = localStorage.getItem("roomName");
    const savedToken = localStorage.getItem("token");

    if (savedRoomName && savedToken) {
      setRoomName(savedRoomName);
      setToken(savedToken);
    }
  }, []);

  // Add Lordicon script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.lordicon.com/lordicon.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const initiateMeeting = async () => {
    const generatedRoomName = uuidv4();
    setRoomName(generatedRoomName);

    try {
      const token = await startMeeting(generatedRoomName, "host");
      setToken(token);
      // Store room details in localStorage
      localStorage.setItem("roomName", generatedRoomName);
      localStorage.setItem("meetingToken", token);
    } catch (error) {
      console.error("Error starting the meeting:", error);
    }
  };

  return (
    <div className="meeting-container">
      {!token ? (
        <div className="overlay">
          <div className="modal">
            <button className="close-button" onClick={() => navigate("/")}>
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
                <strong>Create & Share the Meeting Link:</strong> Start the
                meeting and share the link with the child or their caregiver.
              </li>
              <li>
                <strong>Emotion Detection:</strong> Emotions will appear as
                icons based on your expressions; encourage the child to observe
                and relate these icons.
              </li>
              <li>
                <strong>Guided Help:</strong> If the child is struggling, remind
                them to use the Help button for response suggestions.
              </li>
              <li>
                <strong>Emotion Game:</strong> The child can start an
                emotion-identification game, providing a fun, interactive
                learning experience.
              </li>
              <li>
                <strong>For the Best Experience:</strong> Use Google Chrome or
                Firefox as your browser.
              </li>
            </ol>

            <button className="start-button" onClick={initiateMeeting}>
              Start Meeting
            </button>
          </div>
        </div>
      ) : (
        <VideoRoom token={token} roomName={roomName} role="host" />
      )}
    </div>
  );
};

export default HostMeeting;
