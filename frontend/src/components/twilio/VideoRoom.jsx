import React, { useEffect, useState } from "react";
import { connect } from "twilio-video";
import "../../styles/VideoRoom.css";
import axios from "axios";

const VideoRoom = ({ token, roomName, role }) => {
  const [room, setRoom] = useState(null);
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const [emoji, setEmoji] = useState("😐"); // Default neutral emoji
  const [isCameraOn, setIsCameraOn] = useState(true); // Track camera state
  const [isMicOn, setIsMicOn] = useState(true); // Track mic state

  // Map detected emotion to an emoji
  const mapEmotionToEmoji = (emotion) => {
    const emojiMap = {
      happy: "😊",
      sad: "😢",
      angry: "😠",
      neutral: "😐",
    };
    return emojiMap[emotion] || "😐"; // Default to neutral emoji
  };

  useEffect(() => {
    const connectToRoom = async () => {
      try {
        const room = await connect(token, {
          name: roomName,
          region: "gll", // Global low-latency region
        });
        setRoom(room);
        console.log("Connected to room:", room);

        // Attach local video track for host
        if (role === "host") {
          const localVideoContainer = document.getElementById("local-video");
          localVideoContainer.innerHTML = "";

          const localParticipant = room.localParticipant;
          localParticipant.videoTracks.forEach((trackPub) => {
            const track = trackPub.track;
            localVideoContainer.appendChild(track.attach());
          });
        }

        // Attach remote participants' video tracks
        room.participants.forEach((participant) => {
          participant.on("trackSubscribed", (track) => {
            document.getElementById("remote-video").appendChild(track.attach());
          });
        });

        room.on("participantConnected", (participant) => {
          participant.on("trackSubscribed", (track) => {
            document.getElementById("remote-video").appendChild(track.attach());
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

    // Clean up the room connection on unmount
    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [token, roomName, role]);

  // Capture and send emotions for guest role
  useEffect(() => {
    const capturePhoto = () => {
      if (role === "guest") {
        const remoteVideos = document
          .getElementById("remote-video")
          .getElementsByTagName("video");

        if (remoteVideos.length > 0) {
          const videoElement = remoteVideos[0];

          // Check if the video is ready
          if (videoElement.readyState >= 2) {
            const videoWidth = videoElement.videoWidth;
            const videoHeight = videoElement.videoHeight;

            const canvas = document.createElement("canvas");
            canvas.width = videoWidth;
            canvas.height = videoHeight;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(videoElement, 0, 0, videoWidth, videoHeight);

            // Convert canvas to an image in base64 format
            const imageData = canvas.toDataURL("image/jpeg");

            // Send the captured image to the backend for emotion detection
            axios
              .post(`${apiUrl}/detect-emotion`, { image: imageData })
              .then((response) => {
                const detectedEmotion = response.data.emotion;
                const mappedEmoji = mapEmotionToEmoji(detectedEmotion);
                setEmoji(mappedEmoji);
              })
              .catch((error) => {
                console.error("Error detecting emotion:", error);
              });
          }
        }
      }
    };

    // Set up interval to capture video frame every 5 seconds
    const intervalId = setInterval(capturePhoto, 5000);

    // Clean up interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [role, apiUrl]);

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

  return (
    <div className="video-room">
      <div className="video-container">
        <div id="local-video" className="video-section"></div>
        <div id="remote-video" className="video-section"></div>
      </div>

      {role === "guest" && (
        <div className="emoji-display">
          <span>Detected Emotion: {emoji}</span>
        </div>
      )}

      {/* Camera and Mic Controls */}
      <div className="controls">
        <button onClick={toggleCamera}>
          {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
        </button>
        <button onClick={toggleMic}>
          {isMicOn ? "Mute Mic" : "Unmute Mic"}
        </button>
      </div>
    </div>
  );
};

export default VideoRoom;
