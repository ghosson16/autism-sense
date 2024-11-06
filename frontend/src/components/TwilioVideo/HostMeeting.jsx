import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import VideoRoom from "./VideoRoom";
import { startMeeting } from "../../services/videoService";

const HostMeeting = () => {
  const [roomName, setRoomName] = useState("");
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

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
    } catch (error) {
      console.error("Error starting the meeting:", error);
    }
  };

  // Styling
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent overlay for background visibility
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const modalStyle = {
    backgroundColor: "#d2eef9",
    border: "2px solid black",
    padding: "30px",
    width: "600px", // Increased width for better readability
    textAlign: "center",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: "0", // Retro square design
  };
const closeButtonStyle = {
  position: "absolute",
  top: "10px",
  right: "10px",
  width: "30px", // Slightly larger size
  height: "40px", // Square shape
  backgroundColor: "#FF4D4D", // Retro red color
  color: "black",
  border: "2px solid black",
  fontSize: "1.2rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  borderRadius: "0", // Square shape
  transition: "background-color 0.3s ease",
  outline: "none", // Remove outline
  boxShadow: "none", // Remove any shadow
};

// Hover style for the close button
const closeButtonHoverStyle = {
  backgroundColor: "#FF3333", // Brighter red on hover
};

  const buttonStyle = {
    backgroundColor: "#fff394",
    color: "black",
    border: "2px solid black",
    padding: "10px 20px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    borderRadius: "0",
    boxShadow: "none",
    marginTop: "20px",
  };

  return (
    <div style={{ textAlign: "center" }}>
      {!token ? (
        <div style={overlayStyle}>
          <div style={modalStyle}>
          <button
  style={closeButtonStyle}
  onClick={() => navigate("/")} // Navigate back to homepage
  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = closeButtonHoverStyle.backgroundColor)}
  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = closeButtonStyle.backgroundColor)}
>
  X
</button>
<br/>
            {/* Icon centered above the header */}
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
              <lord-icon
                src="https://cdn.lordicon.com/jikbqoam.json"
                trigger="loop"
                delay="2000"
                stroke="bold"
                state="morph-turn-on"
                style={{ width: "100px", height: "100px" }}
              ></lord-icon>
            </div>

            <h2 style={{ textAlign: "center", margin: 0 }}>Quick Tips Before you start!</h2> <br/>

            {/* Instructions List */}
            <ol style={{ lineHeight: "1.7", padding: "10px 0", textAlign: "justify" }}>
              <li style={{ marginBottom: "15px", }}>
                <strong>Create & Share the Meeting Link:
                  <br/>
                  </strong> Start the meeting and share the link with the child or their caregiver.
              </li>
              <li style={{ marginBottom: "15px" }}>
                <strong>Emotion Detection:</strong>
                <br/>
                 Emotions will appear as icons based on your expressions; encourage the child to observe and relate these icons.
              </li>
              <li style={{ marginBottom: "15px" }}>
                <strong>Guided Help:</strong>
                <br/>
                 If the child is struggling, remind them to use the Help button for response suggestions.
              </li>
              <li style={{ marginBottom: "15px" }}>
                <strong>Emotion Game:</strong> 
                <br/>The child can start an emotion-identification game, providing a fun, interactive learning experience.
              </li>
            </ol>

            <button
              style={buttonStyle}
              onClick={initiateMeeting}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fff300")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff394")}
            >
              Start Meeting
            </button>
            <br/>
          </div>
        </div>
      ) : (
        <VideoRoom token={token} roomName={roomName} role="host" />
      )}
    </div>
  );
};

export default HostMeeting;