// components/VideoRoom.js
import React, { useEffect, useState } from "react";
import { connect } from "twilio-video";
import "../../styles/VideoRoom.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faVideoSlash,
  faMicrophone,
  faMicrophoneSlash,
  faPhone,
  faClipboard,
  faEllipsisV,
  faGamepad,
} from "@fortawesome/free-solid-svg-icons";
import AudioRecorder from "./AudioRecorder";
import { detectEmotion } from "../../services/videoService";
import Game from "../Game/Game";
import { useNavigate } from "react-router-dom";

const VideoRoom = ({ token: initialToken, roomName: initialRoomName, role }) => {
  const [room, setRoom] = useState(null);
  const [token, setToken] = useState(initialToken);
  const [roomName, setRoomName] = useState(initialRoomName);
  const [emoji, setEmoji] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [copySuccess, setCopySuccess] = useState("");
  const [openGame, setOpenGame] = useState(false);
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

  // Persist token and roomName in localStorage for reconnection
  useEffect(() => {
    if (token && roomName) {
      localStorage.setItem("meetingToken", token);
      localStorage.setItem("meetingRoomName", roomName);
    }
  }, [token, roomName]);

  // Load token and roomName from localStorage on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem("meetingToken");
    const savedRoomName = localStorage.getItem("meetingRoomName");
    const meetingEnded = localStorage.getItem("meetingEnded");

    if (savedToken && savedRoomName && !meetingEnded) {
      setToken(savedToken);
      setRoomName(savedRoomName);
    } else if (meetingEnded) {
      localStorage.removeItem("meetingToken");
      localStorage.removeItem("meetingRoomName");
      localStorage.removeItem("meetingEnded");
      navigate(role === "host" ? "/" : "/home");
    }
  }, [role, navigate]);

  // Connect to Twilio room
  useEffect(() => {
    const connectToRoom = async () => {
      if (!token || !roomName) return;

      try {
        const room = await connect(token, {
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
  }, [token, roomName, role]);

  // End the meeting for all participants (host only)
  const endMeeting = () => {
    if (room) {
      room.disconnect();
      console.log("Meeting ended by host.");
      localStorage.setItem("meetingEnded", "true"); // Signal all clients that the meeting has ended
      localStorage.removeItem("meetingToken");
      localStorage.removeItem("meetingRoomName");
      navigate("/"); // Navigate the host to the landing page
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
      localStorage.removeItem("meetingRoomName");
      navigate("/home"); // Navigate guests to the home page
    }
  };

  // Capture emotion from remote video for guest role
  useEffect(() => {
    const capturePhoto = () => {
      if (role === "guest") {
        const remoteVideos = document
          .getElementById("remote-video")
          .getElementsByTagName("video");
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
                  setEmoji(mapEmotionToEmoji(emotion));
                } catch (error) {
                  console.error("Error detecting emotion:", error);
                }
              }
            }, "image/jpeg");
          }
        }
      }
    };

    const intervalId = setInterval(capturePhoto, 15000);
    return () => clearInterval(intervalId);
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
        {role === "host" && (
          <div id="local-video" className="video-section"></div>
        )}
        <div id="remote-video" className="video-section"></div>
      </div>

      {role === "guest" && emoji && (
        <div className="emoji-display">
          <span>{emoji}</span>
        </div>
      )}

      <div className="call-controls">
        <div className="three-dot-container">
          <button className="three-dot-button">
            <FontAwesomeIcon icon={faEllipsisV} />
          </button>
          <div className="control-panel">
            {role === "host" ? (
              <button onClick={endMeeting} className="control-button end-call">
                <FontAwesomeIcon icon={faPhone} /> End Meeting
              </button>
            ) : (
              <button onClick={leaveMeeting} className="control-button leave-call">
                <FontAwesomeIcon icon={faPhone} /> Leave Meeting
              </button>
            )}
            <button onClick={toggleCamera} className="control-button video">
              <FontAwesomeIcon icon={isCameraOn ? faVideo : faVideoSlash} />
              {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
            </button>
            <button onClick={toggleMic} className="control-button microphone">
              <FontAwesomeIcon icon={isMicOn ? faMicrophone : faMicrophoneSlash} />
              {isMicOn ? "Mute Mic" : "Unmute Mic"}
            </button>
            {role === "host" && (
              <button onClick={copyRoomName} className="control-button copy-room">
                <FontAwesomeIcon icon={faClipboard} /> Copy Room Name
              </button>
            )}
          </div>
        </div>

        {role === "guest" && (
          <div className="control">
            <AudioRecorder />
            <button onClick={() => setOpenGame(true)}>
              <b>Game</b>
              <FontAwesomeIcon icon={faGamepad} style={{ marginLeft: "10px" }} />
            </button>
            {openGame && <Game onClose={() => setOpenGame(false)} />}
          </div>
        )}

        {copySuccess && <p className="copy-success">{copySuccess}</p>}
      </div>
    </div>
  );
};

export default VideoRoom;
