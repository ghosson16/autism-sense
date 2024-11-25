import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VideoRoom from "./VideoRoom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faMicrophone,
  faMicrophoneSlash,
  faPhone,
  faVideo,
  faVideoSlash,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/Meeting.css";
import "../../styles/VideoRoom.css";
import { startMeeting } from "../../services/videoService";

const GuestMeeting = () => {
  const [roomName, setRoomName] = useState(""); // state for room name
  const [token, setToken] = useState(null); // state for token
  const [room, setRoom] = useState(null); // state to manage the Twilio room
  const [errorMessage, setErrorMessage] = useState(""); // state for error messages
  const [successMessage, setSuccessMessage] = useState(""); // state for success messages
  const [isCameraOn, setIsCameraOn] = useState(true); // state for camera control
  const [isMicOn, setIsMicOn] = useState(true); // state for microphone control
  const [isLoading, setIsLoading] = useState(false); // state for loading status during join
  const [showControlPanel, setShowControlPanel] = useState(false); // state for toggling control panel visibility
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

  // Dynamically load the Lord Icon library (it only needs to be loaded once)
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.lordicon.com/lordicon.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Handle joining the meeting
  const joinMeeting = async () => {
    try {
      setIsLoading(true);
      if (!roomName.trim()) {
        setErrorMessage("Please enter a valid room name before joining the meeting.");
        return;
      }
      
      const newToken = await startMeeting(roomName, "guest");
      setToken(newToken);
      localStorage.setItem("meetingToken", newToken);
      localStorage.setItem("roomName", roomName);
      setErrorMessage("");
      setSuccessMessage("You have successfully joined the meeting!");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage(
          "The meeting room you're trying to join doesn't exist or has already ended. Please verify the room name or link and try again."
        );
      } else if (error.response && error.response.status === 500) {
        setErrorMessage("An internal issue occurred while joining the meeting. Please try again in a few moments.");
      } else {
        console.error("Error joining meeting:", error);
        setErrorMessage("Something went wrong. Please check your internet connection and try again.");
      }
    } finally {
      setRoomName("");
      setIsLoading(false);
    }
  };

  // Handle leaving the meeting
  const leaveMeeting = () => {
    // Disconnect from Twilio room
    if (room) {
      room.disconnect();
      setRoom(null);
    }

    // Clear the room name and token from localStorage and state
    localStorage.removeItem("roomName");
    localStorage.removeItem("token");
    localStorage.removeItem("isJoining"); // Clear joining state
    setRoomName(""); // Clear room name from state
    setToken(null); // Clear token from state
    setErrorMessage(""); // Clear any error message
    setSuccessMessage(""); // Clear success message
    navigate("/home");
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

  // Toggle the visibility of the control panel
  const toggleControlPanel = () => {
    setShowControlPanel((prev) => !prev);
  };

  // Clear success message after a certain time
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000); // Clear success message after 5 seconds

      return () => clearTimeout(timer); // Clean up the timer
    }
  }, [successMessage]);

  // If token exists, render VideoRoom and control buttons, else show room input modal
  return (
    <div className="meeting-container">
      {!token ? (
        <div className="overlay">
          <div className="modal">
            <button className="close-button" onClick={() => navigate(-1)}>
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
                <strong>Join the Meeting:</strong> Paste in the room name shared by the therapist, then click (Join Meeting) to enter.
              </li>
              <li>
                <strong>Watch for Emotions:</strong> Icons will appear that show how the therapist is feeling. Try to pay attention to these icons to understand different emotions.
              </li>
              <li>
                <strong>Need Help?</strong> If you’re not sure what to say, click the Help button for some ideas.
              </li>
              <li>
                <strong>Play the Emotion Game:</strong> You can start a game to practice recognizing emotions. It’s fun and helps you learn!
              </li>
              <li>
                <strong>For the Best Experience:</strong> Use Google Chrome or Firefox as your browser.
              </li>
            </ol>

            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)} // Update room name state
              placeholder="Enter the invitation's link"
              className="input-field"
            />
            <button className="start-button" onClick={joinMeeting} disabled={isLoading}>
              {isLoading ? "Joining..." : "Join Meeting"}
            </button>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          </div>
        </div>
      ) : (
        <>
          {successMessage && <p className="join-success">{successMessage}</p>}
          <VideoRoom token={token} roomName={roomName} role="guest" setRoom={setRoom} />
          <div className="call-controls">
            <div className="three-dot-container">
              <button className="three-dot-button" onClick={toggleControlPanel}>
                <FontAwesomeIcon icon={faEllipsisV} />
              </button>
              {showControlPanel && (
                <div className="guest-control-panel">
                  <button onClick={leaveMeeting} className="control-button leave-call">
                    <FontAwesomeIcon icon={faPhone} /> Leave Meeting
                  </button>
                  <button onClick={toggleCamera} className="control-button video">
                    <FontAwesomeIcon icon={isCameraOn ? faVideo : faVideoSlash} />
                    {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
                  </button>
                  <button onClick={toggleMic} className="control-button microphone">
                    <FontAwesomeIcon icon={isMicOn ? faMicrophone : faMicrophoneSlash} />
                    {isMicOn ? "Mute Mic" : "Unmute Mic"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GuestMeeting;
