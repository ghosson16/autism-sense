import React, { useEffect, useState } from "react";
import { connect } from "twilio-video";
import "../../styles/VideoRoom.css";
import axios from "axios";
import AudioRecorder from "./AudioRecorder";

const VideoRoom = ({ token, roomName, role }) => {
  const [room, setRoom] = useState(null);
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const [emoji, setEmoji] = useState(null); // Default neutral emoji

  const [isCameraOn, setIsCameraOn] = useState(true); // Track camera state
  const [isMicOn, setIsMicOn] = useState(true); // Track mic state
  const [copySuccess, setCopySuccess] = useState(""); // State to track copy status


  // Map detected emotion to an emoji
  const mapEmotionToEmoji = (emotion) => {
    const emojiMap = {
      happy: "😊",
      sad: "😢",
      angry: "😠",
      neutral: "😐",
    };
    return emojiMap[emotion] ;
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
            const remoteVideoContainer = document.getElementById("remote-video");
            remoteVideoContainer.innerHTML = "";
            document.getElementById("remote-video").appendChild(track.attach());
          });
        });

        room.on("participantConnected", (participant) => {
          participant.on("trackSubscribed", (track) => {
            const remoteVideoContainer = document.getElementById("remote-video");
            remoteVideoContainer.innerHTML = "";
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
  
              // Convert the canvas to a Blob
              canvas.toBlob(async (blob) => {
                if (blob) {
                  const imageData = new FormData();
                  imageData.append("image", blob, "frame.jpg"); // Append blob as a file
  
                  // Send captured image for emotion detection
                  await detectEmotion(imageData);
                }
              }, "image/jpeg");
            }
          }
        }
      };
  
      const detectEmotion = async (imageData) => {
        try {
          const requestUrl = `${apiUrl}/api/detection/detect-emotion`;
          console.log('Request URL:', requestUrl);
          
          const response = await axios.post(requestUrl, imageData, {
            headers: {
              'Content-Type': 'multipart/form-data', // Important for file uploads
            },
          });
          
          const emotion = response.data.emotion;
          setEmoji(mapEmotionToEmoji(emotion)); // Update emoji based on detected emotion
        } catch (error) {
          console.error("Error detecting emotion:", error);
        }
      };

    // Set up interval to capture video frame every 15 seconds
    const intervalId = setInterval(capturePhoto, 15000);

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
        <div className="control">
          <div><AudioRecorder/></div>
          <button onClick={() => console.log("Game button clicked")}>Game</button>
        </div>
        </>
        
      )}
     <div className="call-controls">
      <div className="three-dot-container">
        <button className="three-dot-button">•••</button>
        <div className="control-panel">
          <button className="control-button end-call">
            <span role="img" aria-label="End Call">📞</span> End Call
          </button>
          <button onClick={toggleCamera} className="control-button video">
            <span role="img" aria-label="Video">📹</span>
            {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
          </button>
          <button onClick={toggleMic} className="control-button microphone">
            <span role="img" aria-label="Microphone">🎤</span>
            {isMicOn ? "Mute Mic" : "Unmute Mic"}
          </button>

          {role === "host" && (
            <button onClick={copyRoomName} className="control-button copy-room">
              <span role="img" aria-label="Copy Room Name">📋</span> Copy Room Name
            </button>
          )}

          {copySuccess && <p className="copy-success">{copySuccess}</p>}

        </div>
      </div>
    </div>


    </div>
  );
};

export default VideoRoom;
