import React, { useState } from "react";
import axios from "axios";
import VideoRoom from "./VideoRoom";
import "../../styles/VideoRoom.css";

const GuestMeeting = () => {
  const [roomName, setRoomName] = useState("");
  const [token, setToken] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  const joinMeeting = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/room/join-room`, {
        roomName: roomName,
        role: "guest", // Specify role as 'guest'
      });
      const token = response.data.token;
      setToken(token); // Save the token for later use
      setIsConnected(true); // Set connected to true once the token is received
      setErrorMessage(""); // Clear any previous errors
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Room does not exist
        setErrorMessage("Room does not exist. Please check the room name.");
      } else {
        console.error("Error joining meeting:", error);
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div>
      <h1>Join Meeting</h1>
      {!token ? (
        <>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter Room Name"
          />
          <button onClick={joinMeeting}>Join Meeting</button>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message */}
        </>
      ) : (
        <VideoRoom token={token} roomName={roomName} role="guest" />
      )}

      {isConnected && (
        <div>
          <div id="controls"></div>
          <button onClick={() => console.log("Game button clicked")}>Game</button>
        </div>
      )}
    </div>
  );
};

export default GuestMeeting;
