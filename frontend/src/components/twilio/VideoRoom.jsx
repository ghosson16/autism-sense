import React, { useEffect, useState } from "react";
import { connect } from "twilio-video";
import "../../styles/VideoRoom.css";


const VideoRoom = ({ token, roomName, role }) => {
  const [room, setRoom] = useState(null);

  useEffect(() => {
    const connectToRoom = async () => {
      try {
        const room = await connect(token, {
          name: roomName,
          region: 'gll',  // Specify region if necessary
        });
        setRoom(room);
        console.log("Connected to room:", room);

        // If the participant is a host, show both local and remote video
        if (role === 'host') {
          const localParticipant = room.localParticipant;
          // Attach local video track
          localParticipant.videoTracks.forEach(trackPub => {
            const track = trackPub.track;
            document.getElementById('local-video').appendChild(track.attach());
          });
        }

        // Attach remote participants' video tracks
        room.participants.forEach(participant => {
          participant.on('trackSubscribed', track => {
            document.getElementById('remote-video').appendChild(track.attach());
          });
        });

        room.on('participantConnected', participant => {
          participant.on('trackSubscribed', track => {
            document.getElementById('remote-video').appendChild(track.attach());
          });
        });

        room.on('participantDisconnected', participant => {
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

  return (
    <div id="video-room">
      <h2>Video Room: {roomName}</h2>
      {/* Only show the local video if the role is host */}
      {role === 'host' && (
        <div id="local-video">Local Video</div>
      )}
      <div id="remote-video" >Remote Video</div>
    </div>
  );
};

export default VideoRoom;
