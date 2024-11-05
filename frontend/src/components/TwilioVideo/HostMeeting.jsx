// components/twilio/HostMeeting.js
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import VideoRoom from "./VideoRoom";
import { startMeeting } from "../../services/videoService";

const HostMeeting = () => {
  const [roomName, setRoomName] = useState("");
  const [token, setToken] = useState(null);

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
    <div>
      {!token ? (
        <>
          <h1>Start Meeting</h1>
          <p>description host mode</p>
          <button onClick={initiateMeeting}>Start Meeting</button>
        </>
      ) : (
        <VideoRoom token={token} roomName={roomName} role="host" />
      )}
    </div>
  );
};

export default HostMeeting;
