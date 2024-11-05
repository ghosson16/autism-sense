// components/VideoRoom.js
import React, { useEffect, useState } from "react";
import { connect } from "twilio-video";
import "../../styles/VideoRoom.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faVideoSlash, faMicrophone, faMicrophoneSlash, faPhone, faClipboard, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import AudioRecorder from "./AudioRecorder";
import { detectEmotion } from "../../services/videoService"; // Import the detectEmotion service

const VideoRoom = ({ token, roomName, role }) => {
  const [room, setRoom] = useState(null);
  const [emoji, setEmoji] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [copySuccess, setCopySuccess] = useState("");

  const mapEmotionToEmoji = (emotion) => {
    const emojiMap = {
      happy: "😊",
      sad: "😢",
      angry: "😠",
      neutral: "😐",
    };
    return emojiMap[emotion];
  };

  useEffect(() => {
    const connectToRoom = async () => {
      try {
        const room = await connect(token, {
          name: roomName,
          region: "gll",
          audio: true,
          video: true
        });
        setRoom(room);
        console.log("Connected to room:", room);
      } catch (error) {
        console.error("Error connecting to room:", error);
      }
    };

    connectToRoom();

    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [token, roomName, role]);

  useEffect(() => {
    const capturePhoto = () => {
      if (role === "guest") {
        const remoteVideos = document.getElementById("remote-video").getElementsByTagName("video");
        if (remoteVideos.length > 0) {
          const videoElement = remoteVideos[0];
          if (videoElement.readyState >= 2) {
            const videoWidth = videoElement.videoWidth;
            const videoHeight = videoElement.videoHeight;
            const canvas = document.createElement("canvas");
            canvas.width = videoWidth;
            canvas.height = videoHeight;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(videoElement, 0, 0, videoWidth, videoHeight);

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
      const localParticipant = room.localParticipant;
      localParticipant.videoTracks.forEach((trackPub) => {
        const track = trackPub.track;
        if (isCameraOn) {
          track.disable();
        } else {
          track.enable();
        }
      });
      setIsCameraOn(!isCameraOn);
    }
  };

  // Toggle mic on/off
  const toggleMic = () => {
    if (room) {
      const localParticipant = room.localParticipant;
      localParticipant.audioTracks.forEach((trackPub) => {
        const track = trackPub.track;
        if (isMicOn) {
          track.disable();
        } else {
          track.enable();
        }
      });
      setIsMicOn(!isMicOn);
    }
  };

  const copyRoomName = () => {
    navigator.clipboard.writeText(roomName)
      .then(() => setCopySuccess("Room name copied to clipboard!"))
      .catch(() => setCopySuccess("Failed to copy room name."));

    // Clear the success message after a few seconds
    setTimeout(() => setCopySuccess(""), 2000);
  };

  return (
    <div className="video-room">
      <div className="video-container">
        <div id="local-video" className="video-section"></div>
        <div id="remote-video" className="video-section"></div>
      </div>

      {role === "guest" && (
        <>
        <div className="emoji-display">
          <span>{emoji}</span>
        </div>
        </>
        
      )}
     <div className="call-controls">
      <div className="three-dot-container">
        <button className="three-dot-button">
        <FontAwesomeIcon icon={faEllipsisV} />
        </button>
        <div className="control-panel">
        <button className="control-button end-call">
            <FontAwesomeIcon icon={faPhone} /> End Call
          </button>
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
          <div><AudioRecorder/></div>
          <button onClick={() => console.log("Game button clicked")}>
          <b>Game</b>
          <FontAwesomeIcon icon={faGamepad} style={{ marginLeft: '10px' }} />
          </button>
      </div>
      )}
      
      {copySuccess && <p className="copy-success">{copySuccess}</p>}
    </div>


    </div>
  );
};

export default VideoRoom;
