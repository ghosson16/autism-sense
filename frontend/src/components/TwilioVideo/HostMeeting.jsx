import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import VideoRoom from "./VideoRoom";
import { startMeeting } from "../../services/videoService";
import "../../styles/AuthModal.css";

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

  return (
    <div style={{ textAlign: "center" }}>
      {!token ? (
        <div className="overlay">
          <div className="modal">
            <button
              className="close-button"
              onClick={() => navigate("/")}
            >
              X
            </button>
            <br />

            {/* Icon centered above the header */}
            <div className="icon">
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
              className="start-button"
              onClick={initiateMeeting}
            >
              Start Meeting
            </button>
            <br />
          </div>
        </div>
      ) : (
        <VideoRoom token={token} roomName={roomName} role="host" />
      )}
    </div>
  );
};

export default HostMeeting;
