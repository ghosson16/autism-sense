// components/VideoRoom.js
import {
  faClipboard,
  faEllipsisV,
  faGamepad,
  faMicrophone,
  faMicrophoneSlash,
  faPhone,
  faVideo,
  faVideoSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "twilio-video";
import { detectEmotion , endMeeting } from "../../services/videoService";
import "../../styles/VideoRoom.css";
import Game from "../Game/Game";
import AudioRecorder from "./AudioRecorder";

const VideoRoom = ({ token: initialToken, roomName: initialRoomName, role }) => {
  const [room, setRoom] = useState(null);
  const [meetingToken, setMeetingToken] = useState(initialToken);
  const [roomName, setRoomName] = useState(initialRoomName);
  const [emoji, setEmoji] = useState(null);
  const [isGuestPanelVisible, setGuestPanelVisible] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isMeetingEnded, setIsMeetingEnded] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");

  const [openGame, setOpenGame] = useState(false);
  const [gameStartMessage, setGameStartMessage] = useState("");
  const [gamePhoto, setGamePhoto] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  // Map detected emotion to an emoji
  const mapEmotionToEmoji = (emotion) => {
    const emojiMap = {
      happy: "😊",
      sad: "😢",
      angry: "😠",
      neutral: "😐",
    };
    return emojiMap[emotion];
  };

  // Connect to Twilio room
  useEffect(() => {
    const connectToRoom = async () => {
      if (!meetingToken || !roomName) return;

      try {
        const room = await connect(meetingToken, {
          name: roomName,
          region: "gll",
          audio: true,
          video: true,
        });
        setRoom(room);
        console.log("Connected to room:", room);

        // Attach local video track if the user is the host
        if (role === "host") {
          const localVideoContainer = document.getElementById("local-video");
          localVideoContainer.innerHTML = "";
          room.localParticipant.videoTracks.forEach((trackPub) => {
            const track = trackPub.track;
            localVideoContainer.appendChild(track.attach());
          });
        }

        // Attach remote participants' video tracks
        room.participants.forEach((participant) => {
          participant.on("trackSubscribed", (track) => {
            const remoteVideoContainer = document.getElementById("remote-video");
            remoteVideoContainer.innerHTML = "";
            remoteVideoContainer.appendChild(track.attach());
          });
        });

        room.on("participantConnected", (participant) => {
          participant.on("trackSubscribed", (track) => {
            const remoteVideoContainer = document.getElementById("remote-video");
            remoteVideoContainer.innerHTML = "";
            remoteVideoContainer.appendChild(track.attach());
          });
        });

        room.on("participantDisconnected", (participant) => {
          console.log(`${participant.identity} disconnected.`);
        });
      } catch (error) {
        console.error("Error connecting to room:", error);
      }
    };

    connectToRoom();
  }, [meetingToken, roomName, role]);

  // End the meeting for all participants (host only)
  const endMeetingRoom = async () => {
    try {
      if (room) {
        // Stop and unpublish all tracks
        room.localParticipant.tracks.forEach((trackPub) => {
          trackPub.track.stop();
          trackPub.unpublish();
        });
        room.disconnect();
        console.log("Room disconnected locally.");
      }

      // Call backend to end the meeting
      await endMeeting(roomName, "host");

      // Clear local state
      setRoom(null);
      setRoomName("");
      setMeetingToken(null);
      setIsMeetingEnded(true);

      // Clear room details from localStorage
      localStorage.removeItem("roomName");
      localStorage.removeItem("meetingToken");

      // Navigate to the correct location
      navigate(role === "host" ? "/" : "/home");
    } catch (error) {
      console.error("Error ending meeting:", error);
      alert("An error occurred while ending the meeting. Please try again.");
    }
  };

  // Leave the meeting (for guests or individual participants)
  const leaveMeeting = () => {
    if (room) {
      room.localParticipant.tracks.forEach((trackPub) => {
        trackPub.track.stop();
        trackPub.unpublish();
      });
      room.disconnect();
      console.log("Left the meeting.");
      localStorage.removeItem("meetingToken");
      localStorage.removeItem("roomName");
      navigate("/home");
    }
  };

// Capture emotion from remote video for guest role
const capturePhoto = async (retryCount = 0) => {
  const remoteVideos = document.getElementById("remote-video").getElementsByTagName("video");
  if (remoteVideos.length > 0) {
    const videoElement = remoteVideos[0];
    if (videoElement.readyState >= 2) {
      const canvas = document.createElement("canvas");
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoElement, 0, 0, videoElement.videoWidth, videoElement.videoHeight);

      canvas.toBlob(async (blob) => {
        if (blob) {
          const imageData = new FormData();
          imageData.append("image", blob, "frame.jpg");
          try {
            const emotion = await detectEmotion(imageData);

            // Check if a valid emotion was detected
            if (emotion) {
              setEmoji(mapEmotionToEmoji(emotion));
              setGamePhoto({ blob: URL.createObjectURL(blob), result: emotion });
            } else {
              // If no emotion detected and retry count is below the limit, try again
              if (retryCount < 3) {
                console.log(`Emotion not detected, retrying capture... Attempt ${retryCount + 1}`);
                capturePhoto(retryCount + 1);
              } else {
                console.error("Emotion detection failed after multiple attempts.");
              }
            }
          } catch (error) {
            console.error("Error detecting emotion:", error);
          }
        }
      }, "image/jpeg");
    }
  }
};


  // Start the game
  const startGame = () => {
    const message = "Child has started the game!";
    localStorage.setItem("gameStartMessage", message);
    setGameStartMessage(message);

    setTimeout(() => {
      localStorage.removeItem("gameStartMessage");
      setGameStartMessage("");
      startCountdown();
    }, 2000);
  };

  // Start countdown
  const startCountdown = () => {
    let count = 3;
    setCountdown(count);
    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count === 0) {
        clearInterval(interval);
        setCountdown(0);
        capturePhoto();
        setOpenGame(true);
      }
    }, 1000);
  };

  // Host Listener for Game Start
  useEffect(() => {
    const handleStorageChange = () => {
      const message = localStorage.getItem("gameStartMessage");
      if (message) {
        setGameStartMessage(message);
        setTimeout(() => {
          setGameStartMessage("");
          startCountdown();
        }, 2000);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

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

  useEffect(() => {
    if (role === "guest") {
      const intervalId = setInterval(capturePhoto, 15000);
      return () => clearInterval(intervalId);
    }
  }, [role]);

  return (
    <div className="video-room">
      <div className="video-container">
        {role === "host" && <div id="local-video" className="video-section"></div>}
        <div id="remote-video" className="video-section"></div>
      </div>

      {role === "guest" && emoji && (
        <div className="emoji-display">
          <span>{emoji}</span>
        </div>
      )}

{role === "guest" && (
  <div className="call-controls">
    <div className="three-dot-container">
      <button
        className="three-dot-button"
        onClick={() => setGuestPanelVisible(!isGuestPanelVisible)}
      >
        <FontAwesomeIcon icon={faEllipsisV} />
      </button>
      {isGuestPanelVisible && (
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
)}

{role === "host" && (
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
)}

{role === "guest" && (
  <div className="control">
    <AudioRecorder />
    <button
      onClick={() => {
        setGamePhoto(null); // Reset the game photo when starting
        startGame();
        setOpenGame(true);
      }}
      className="control-button game"
    >
      <b>Game</b>
      <FontAwesomeIcon icon={faGamepad} style={{ marginLeft: "10px" }} />
    </button>
    {openGame && (
      <Game
        gameImage={gamePhoto}
        onClose={() => {
          setOpenGame(false);
          setGamePhoto(null); // Reset the photo when game closes
        }}
        fetchNewImage={() => {
          setGamePhoto(null); // Reset photo for new image
          capturePhoto(); // Capture a fresh photo
        }}
        onAnswer={(isCorrect) => {
          if (isCorrect) {
            setGamePhoto(null); // Prepare for the next question
            capturePhoto();
          }
        }}
      />
    )}
  </div>
)}



      {countdown > 0 && (
        <div className="countdown-overlay">
          <div className="countdown-circle">
            <span>{countdown}</span>
          </div>
        </div>
      )}

      {copySuccess && <p className="copy-success">{copySuccess}</p>}
      {role === "host" && gameStartMessage && (
        <div className="game-start-message">
          <p>{gameStartMessage}</p>
        </div>
      )}
    </div>
  );
};

export default VideoRoom;