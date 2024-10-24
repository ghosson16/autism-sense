import React, { useState } from "react";
import axios from "axios";
import VideoRoom from "./VideoRoom";
import { v4 as uuidv4 } from "uuid"; // To generate unique room names

const HostMeeting = () => {
  const [roomName, setRoomName] = useState("");
  const [token, setToken] = useState(null);
  const [copySuccess, setCopySuccess] = useState(""); // State to track copy status

  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  const startMeeting = async () => {
    const generatedRoomName = uuidv4(); // Generate a unique room name
    setRoomName(generatedRoomName);

    try {
      const response = await axios.post(`${apiUrl}/api/room/join-room`, {
        roomName: generatedRoomName,
        role: "host", // Specify role as 'host'
      });

      const token = response.data.token;
      setToken(token); // Set the token for later use

      // Automatically copy the room name to the clipboard
      navigator.clipboard.writeText(generatedRoomName)
        .then(() => {
          setCopySuccess("Room name copied to clipboard!");
        })
        .catch(err => {
          setCopySuccess("Failed to copy room name.");
          console.error("Copy failed:", err);
        });

    } catch (error) {
      console.error("Error starting the meeting:", error);
    }
  };

  return (
    <div>
      <h1>Start a Meeting</h1>
      {/* Always display the room name and copy button */}
      {roomName && token && (
        <div>
          <p>Room Name: {roomName}</p>
          <button onClick={() => navigator.clipboard.writeText(roomName)}>
            Copy Room Name
          </button>
          {copySuccess && <p>{copySuccess}</p>}
        </div>
      )}
      
      {!token ? (
        <>
          <button onClick={startMeeting}>Start Meeting</button>
        </>
      ) : (
        <VideoRoom token={token} roomName={roomName} role="host" />
      )}
    </div>
  );
};

export default HostMeeting;
