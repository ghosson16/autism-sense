import React, { useState, useEffect } from "react";
import axios from "axios";
import VideoRoom from "./VideoRoom";
import { v4 as uuidv4 } from "uuid";
import "../../styles/VideoRoom.css";


const HostMeeting = () => {
  const [roomName, setRoomName] = useState(localStorage.getItem("roomName") || "");
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isMeetingEnded, setIsMeetingEnded] = useState(false); // Track if the meeting has ended
  const [copySuccess, setCopySuccess] = useState(""); // State to track copy status
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  // Start meeting function
  const startMeeting = async () => {
    const generatedRoomName = uuidv4(); // Generate a unique room name
    setRoomName(generatedRoomName);

    try {
      const response = await axios.post(`${apiUrl}/api/room/join-room`, {
        roomName: generatedRoomName,
        role: "host", // Specify role as 'host'
      });
      const token = response.data.token;
      setToken(token); // Save the token for later use

      // Store room details in localStorage
      localStorage.setItem("roomName", generatedRoomName);
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Error starting meeting:", error);
    }
  };

  // End meeting function
  const endMeeting = async () => {
    try {
      await axios.post(`${apiUrl}/api/room/end-room`, { roomName });
      setRoomName(""); // Clear room name in the component state
      setToken(null); // Clear token in the component state
      setIsMeetingEnded(true);

      // Clear room details from localStorage
      localStorage.removeItem("roomName");
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Error ending meeting:", error);
    }
  };

  // Copy room ID to clipboard
  const copyToClipboard = () => {
    if (roomName) {
      navigator.clipboard.writeText(roomName).then(() => {
        setCopySuccess("Room ID copied to clipboard!");  // Show success message
      }).catch((err) => {
        console.error("Failed to copy: ", err);
        setCopySuccess("Failed to copy Room ID");
      });
    } else {
      setCopySuccess("Room ID is not available.");
    }
  };

  // Restore meeting on page load if there is a room
  useEffect(() => {
    if (roomName && token) {
      setIsMeetingEnded(false); // Reset meeting end flag when restoring
    }
  }, [roomName, token]);

  return (
    <div>
      <h1>Welcome to AutismSense</h1>
      {!token ? (
        <button onClick={startMeeting}>Start Meeting</button>
      ) : (
        <div>
          <VideoRoom token={token} roomName={roomName} role="host" />
          <p>Video Room: {roomName}</p>
          <button onClick={copyToClipboard}>Copy Room ID</button>
          {copySuccess && <p style={{ color: 'green' }}>{copySuccess}</p>} {/* Show copy success message */}
          <button onClick={endMeeting}>End Room</button>
          {isMeetingEnded && <p style={{ color: "red" }}>The meeting has ended.</p>}
        </div>
      )}
    </div>
  );
};

export default HostMeeting;
