import React, { useState } from "react";
import axios from "axios";
import VideoRoom from "./VideoRoom";
import { v4 as uuidv4 } from "uuid";

const HostMeeting = () => {
  const [roomName, setRoomName] = useState("");
  const [token, setToken] = useState(null);
  const [copySuccess, setCopySuccess] = useState(""); // State to track copy status

  const startMeeting = async () => {
    const generatedRoomName = uuidv4(); // Generate a unique room name
    setRoomName(generatedRoomName);

    try {
      const response = await axios.post("http://localhost:5001/api/room/join-room", {
        roomName: generatedRoomName,
        role: "host", // Specify role as 'host'
      });
      const token = response.data.token;
      setToken(token); // Save the token for later use
    } catch (error) {
      console.error("Error starting meeting:", error);
    }
  };

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
        </div>
      )}
    </div>
  );
};

export default HostMeeting;