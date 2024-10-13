import React, { useEffect, useState } from "react";
import { connect } from "twilio-video";
import "../../styles/VideoRoom.css";
import axios from "axios";

const VideoRoom = ({ token, roomName, role }) => {
  const [room, setRoom] = useState(null);
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    const connectToRoom = async () => {
      try {
        const room = await connect(token, {
          name: roomName,
          region: "gll",
        });
        setRoom(room);
        console.log("Connected to room:", room);

        // Attach local video track for host
        if (role === "host") {
          const localParticipant = room.localParticipant;
          localParticipant.videoTracks.forEach((trackPub) => {
            const track = trackPub.track;
            document.getElementById("local-video").appendChild(track.attach());
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

  useEffect(() => {
    const capturePhoto = () => {
      if (role === "guest") {
        const remoteVideos = document
          .getElementById("remote-video")
          .getElementsByTagName("video");

        if (remoteVideos.length > 0) {
          const videoElement = remoteVideos[0];

          // Check if the video is playing and ready
          if (videoElement.readyState >= 2) {
            const canvas = document.createElement("canvas");
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            const ctx = canvas.getContext("2d");

            // Draw the current frame of the video onto the canvas
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(async (blob) => {
              if (blob) {
                const imageUrl = URL.createObjectURL(blob);
                setCapturedImage(imageUrl); // Set the captured image in state

                // Send the photo blob to the backend
                await sendPhotoToBackend(blob);
              }
            }, "image/jpeg");
          } else {
            console.log("Video is not ready yet.");
          }
        } else {
          console.log("No remote video found.");
        }
      }
    };

    const intervalId = setInterval(() => {
      requestAnimationFrame(capturePhoto); // Use requestAnimationFrame for capturing
      // capturePhoto();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [role]);

  const sendPhotoToBackend = async (photoBlob) => {
    const formData = new FormData();
    formData.append("image", photoBlob, "snapshot.jpg");

    try {
      const response = await axios.post(
        `${apiUrl}/api/detection/detect-emotion`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to send photo to backend");
      }

      console.log("Photo sent successfully");
    } catch (error) {
      console.error("Error sending photo to backend:", error);
    }
  };

  return (
    <div id="video-room">
      <h2>Video Room: {roomName}</h2>
      {/* Only show the local video if the role is host */}
      {role === "host" ? (
        <div id="local-video">Local Video</div>
      ) : (
        <div id="remote-video">Remote Video</div>
      )}
      {capturedImage && (
        <div>
          <h3>Captured Image:</h3>
          <img src={capturedImage} alt="Captured" />
        </div>
      )}
    </div>
  );
};

export default VideoRoom;
