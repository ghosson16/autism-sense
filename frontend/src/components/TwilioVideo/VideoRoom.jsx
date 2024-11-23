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
      surprised: "😲",
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

      // Attach local video and audio tracks if the user is the host
      if (role === "host") {
        const localVideoContainer = document.getElementById("local-video");
        const localAudioContainer = document.getElementById("local-audio");

        // Attach local video tracks
        localVideoContainer.innerHTML = "";
        room.localParticipant.videoTracks.forEach((trackPub) => {
          const track = trackPub.track;
          localVideoContainer.appendChild(track.attach());
        });

        // Attach local audio tracks (hidden audio elements for playback)
        localAudioContainer.innerHTML = "";
        room.localParticipant.audioTracks.forEach((trackPub) => {
          const track = trackPub.track;
          const audioElement = track.attach();
          localAudioContainer.appendChild(audioElement);
        });
      }

      // Attach remote participants' video and audio tracks
      room.participants.forEach((participant) => {
        participant.tracks.forEach((trackPub) => {
          trackPub.on("subscribed", (track) => {
            const remoteVideoContainer = document.getElementById("remote-video");
            const remoteAudioContainer = document.getElementById("remote-audio");

            if (track.kind === "video") {
              remoteVideoContainer.innerHTML = ""; // Clear previous video
              remoteVideoContainer.appendChild(track.attach());
            } else if (track.kind === "audio") {
              remoteAudioContainer.innerHTML = ""; // Clear previous audio
              const audioElement = track.attach();
              remoteAudioContainer.appendChild(audioElement);
            }
          });
        });
      });

      // Handle new participant connections
      room.on("participantConnected", (participant) => {
        console.log(`${participant.identity} connected.`);
        participant.tracks.forEach((trackPub) => {
          trackPub.on("subscribed", (track) => {
            const remoteVideoContainer = document.getElementById("remote-video");
            const remoteAudioContainer = document.getElementById("remote-audio");

            if (track.kind === "video") {
              remoteVideoContainer.innerHTML = ""; // Clear previous video
              remoteVideoContainer.appendChild(track.attach());
            } else if (track.kind === "audio") {
              remoteAudioContainer.innerHTML = ""; // Clear previous audio
              const audioElement = track.attach();
              remoteAudioContainer.appendChild(audioElement);
            }
          });
        });
      });

      // Handle participant disconnections
      room.on("participantDisconnected", (participant) => {
        console.log(`${participant.identity} disconnected.`);
        detachAndStopTracks([...participant.videoTracks.values(), ...participant.audioTracks.values()]);
      });

    } catch (error) {
      console.error("Error connecting to room:", error);
    }
  };

  connectToRoom();

  // Cleanup on unmount
  return () => {
    if (room) {
      detachAndStopTracks([...room.localParticipant.tracks.values()]);
      room.disconnect();
      setRoom(null);
    }
  };
}, [meetingToken, roomName, role]);

// Utility function to detach and stop tracks
const detachAndStopTracks = (tracks) => {
  tracks.forEach((track) => {
    track.stop();
    const elements = track.detach();
    elements.forEach((element) => element.remove());
  });
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
      setMeetingToken(null);
      localStorage.removeItem("roomName");
      localStorage.removeItem("meetingToken");
      navigate(role === "host" ? "/" : "/home");
    } catch (error) {
      console.error("Error ending meeting:", error);
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

  // Capture emotion from remote video for emoji display
  const continuousCapturePhoto = async () => {
    const remoteVideos = document.getElementById("remote-video")?.getElementsByTagName("video");
    if (remoteVideos?.length > 0) {
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
              if (emotion) setEmoji(mapEmotionToEmoji(emotion));
            } catch (error) {
              console.error("Error detecting emotion:", error);
            }
          }
        }, "image/jpeg");
      }
    }
  };

// Game-specific capture with retry logic
const gameCapturePhotoWithRetry = async (retryCount = 0) => {
  const remoteVideos = document
    .getElementById("remote-video")
    ?.getElementsByTagName("video");
  if (remoteVideos?.length > 0) {
    const videoElement = remoteVideos[0];
    if (videoElement.readyState >= 2) {
      const canvas = document.createElement("canvas");
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        videoElement,
        0,
        0,
        videoElement.videoWidth,
        videoElement.videoHeight
      );

      canvas.toBlob(async (blob) => {
        if (blob) {
          const imageData = new FormData();
          imageData.append("image", blob, "frame.jpg");
          try {
            const emotion = await detectEmotion(imageData);

            if (emotion) {
              console.log("Game photo emotion detected:", emotion);
              setGamePhoto({
                blob: URL.createObjectURL(blob),
                result: emotion,
              });
            } else if (retryCount < 1) {
              console.log(`Retrying game photo capture... Attempt ${retryCount + 1}`);
              startRetryCountdown(() => gameCapturePhotoWithRetry(retryCount + 1));
            } else {
              console.error("Failed to detect emotion after 3 attempts.");
            }
          } catch (error) {
            console.error("Error detecting emotion:", error);
          }
        }
      }, "image/jpeg");
    }
  }
};

// Retry countdown
const startRetryCountdown = (callback) => {
  let retryCountdown = 3;
  setCountdown(retryCountdown);

  const interval = setInterval(() => {
    retryCountdown -= 1;
    setCountdown(retryCountdown);

    if (retryCountdown === 0) {
      clearInterval(interval);
      setCountdown(0);
      if (callback) callback();
    }
  }, 1000);
};

// Game countdown and start
const startGame = () => {
  const message = "Game Start: Guest has started the game!";
  localStorage.setItem("gameStartMessage", message); // Notify the host
  setGameStartMessage(message);

  let gameCountdown = 3;
  setCountdown(gameCountdown);

  const interval = setInterval(() => {
    gameCountdown -= 1;
    setCountdown(gameCountdown);

    if (gameCountdown === 0) {
      clearInterval(interval);
      setCountdown(0);

      // Capture the first photo for the game
      gameCapturePhotoWithRetry();
      setOpenGame(true);
    }
  }, 1000);
};

// Host Listener for Game Start
useEffect(() => {
  const handleStorageChange = () => {
    const message = localStorage.getItem("gameStartMessage");

    if (message && message.startsWith("Game Start:")) {
      setGameStartMessage(message); // Update the message to display on the host's side

      let gameCountdown = 3;
      setCountdown(gameCountdown);

      const interval = setInterval(() => {
        gameCountdown -= 1;
        setCountdown(gameCountdown);

        if (gameCountdown === 0) {
          clearInterval(interval);
          setCountdown(0);
          console.log("Host detected game start by the guest.");
        }
      }, 1000);
    }
  };

  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
}, []);
  

  // Continuous capture for emoji updates
  useEffect(() => {
    if (role === "guest") {
      const intervalId = setInterval(continuousCapturePhoto, 15000);
      return () => clearInterval(intervalId);
    }
  }, [role]);


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


  return (
 <div className="video-room">
      <div className="video-container">
         {/* Local Video and Audio Containers for the Host */}
    {role === "host" && (
      <>
        <div id="local-video" className="video-section"></div>
        <div id="local-audio" style={{ display: "none" }}></div>
      </>
    )}

    {/* Remote Video and Audio Containers */}
    <div id="remote-video" className="video-section"></div>
    <div id="remote-audio" style={{ display: "none" }}></div>
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
          gameCapturePhotoWithRetry(); // Capture a fresh photo
        }}
        onAnswer={(isCorrect) => {
          if (isCorrect) {
            setGamePhoto(null); // Prepare for the next question
            gameCapturePhotoWithRetry();
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