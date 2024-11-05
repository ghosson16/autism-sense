// components/twilio/GuestMeeting.js
import React, { useState } from "react";
import VideoRoom from "./VideoRoom";
import "../../styles/VideoRoom.css";
import { startMeeting } from "../../services/videoService"; // Import the service function

const GuestMeeting = () => {
  const [roomName, setRoomName] = useState("");
  const [token, setToken] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const joinMeeting = async () => {
    try {
      const token = await startMeeting(roomName, "guest"); // Use the service function
      setToken(token);
      setIsConnected(true);
      setErrorMessage("");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage("Room does not exist. Please check the room name.");
      } else {
        console.error("Error joining meeting:", error);
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div>
      {!token ? (
        <>
          <h1>Join Meeting</h1>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter Room Name"
          />
          <button onClick={joinMeeting}>Join Meeting</button>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </>
      ) : (
        <VideoRoom token={token} roomName={roomName} role="guest" />
      )}
    </div>
  );
};

export default GuestMeeting;
