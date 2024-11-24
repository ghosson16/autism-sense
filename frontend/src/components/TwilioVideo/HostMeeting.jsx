import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faMicrophone, faMicrophoneSlash, faPhone, faVideo, faVideoSlash } from "@fortawesome/free-solid-svg-icons";
import VideoRoom from "./VideoRoom";
import { startMeeting, endMeeting } from "../../services/videoService"; // Import startMeeting and endMeeting
import "../../styles/Meeting.css";
import "../../styles/VideoRoom.css";


const HostMeeting = () => {
  const [roomName, setRoomName] = useState("");
  const [token, setToken] = useState(null);
  const [room, setRoom] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [copySuccess, setCopySuccess] = useState("");
  const navigate = useNavigate();

  // Load existing meeting details from localStorage
  useEffect(() => {
    const savedRoomName = localStorage.getItem("roomName");
    const savedToken = localStorage.getItem("meetingToken");

    // If roomName and token are available in localStorage, use them
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

  // End the meeting for all participants (host only)
  const endMeetingRoom = async () => {
    try {
      if (room) {
        room.localParticipant.tracks.forEach((trackPub) => {
          trackPub.track.stop();
          trackPub.unpublish();
        });
        room.disconnect();
        console.log("Room disconnected locally.");
      }
      await endMeeting(roomName, "host");
      setRoom(null);
      setRoomName("");
      setToken(null);
      localStorage.removeItem("roomName");
      localStorage.removeItem("meetingToken");
      navigate("/");
    } catch (error) {
      console.error("Error ending meeting:", error);
    }
  };

  // Toggle camera on/off
  const toggleCamera = () => {
    if (room) {
      room.localParticipant.videoTracks.forEach((trackPub) => {
        const track = trackPub.track;
        isCameraOn ? track.disable() : track.enable();
      });
      setIsCameraOn(!isCameraOn);
    }
  };

  // Toggle microphone on/off
  const toggleMic = () => {
    if (room) {
      room.localParticipant.audioTracks.forEach((trackPub) => {
        const track = trackPub.track;
        isMicOn ? track.disable() : track.enable();
      });
      setIsMicOn(!isMicOn);
    }
  };

  // Copy room name to clipboard
  const copyRoomName = () => {
    navigator.clipboard
      .writeText(roomName)
      .then(() => setCopySuccess("Room name copied to clipboard!"))
      .catch(() => setCopySuccess("Failed to copy room name."));
    setTimeout(() => setCopySuccess(""), 2000);
  };

  // If token exists, display the VideoRoom and control buttons
  if (token && roomName) {
    return (
      <div className="meeting-container">
        <VideoRoom token={token} roomName={roomName} role="host" setRoom={setRoom} />

        {/* Host Control Panel */}
        <div className="host-control-panel">
          <button onClick={endMeetingRoom} className="control-button leave-call">
            <FontAwesomeIcon icon={faPhone} /> End Meeting
          </button>
          <button onClick={toggleCamera} className="control-button video">
            <FontAwesomeIcon icon={isCameraOn ? faVideo : faVideoSlash} />
            {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
          </button>
          <button onClick={toggleMic} className="control-button microphone">
            <FontAwesomeIcon icon={isMicOn ? faMicrophone : faMicrophoneSlash} />
            {isMicOn ? "Mute Mic" : "Unmute Mic"}
          </button>
          <button onClick={copyRoomName} className="control-button copy-room">
            <FontAwesomeIcon icon={faClipboard} /> Copy Room Name
          </button>
          {copySuccess && <p className="copy-success">{copySuccess}</p>}
        </div>
      </div>
    );
  }

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