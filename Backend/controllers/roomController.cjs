const { v4: uuidv4 } = require("uuid");
const { twilioClient } = require("../config/twilioConfig.cjs");
const AccessToken = require("twilio").jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const findOrCreateRoom = async (roomName) => {
  try {
    await twilioClient.video.rooms(roomName).fetch();
  } catch (error) {
    if (error.code === 20404) {
      await twilioClient.video.rooms.create({
        uniqueName: roomName,
        type: "go",
      });
    } else {
      throw error;
    }
  }
};

const getAccessToken = (roomName, role) => {
  const identity = uuidv4();
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY_SID,
    process.env.TWILIO_API_KEY_SECRET,
    { identity: identity, ttl: 3600 }
  );

  const videoGrant = new VideoGrant({
    room: roomName,
    region: "gll",
  });

  token.addGrant(videoGrant);

  return token.toJwt();
};

const joinRoom = async (req, res) => {
  const { roomName, role } = req.body;

  if (!roomName) {
    return res.status(400).send("Room name is required");
  }

  try {
    const token = getAccessToken(roomName, role);
    await findOrCreateRoom(roomName);
    res.status(200).send({ token });
  } catch (error) {
    console.error("Error creating/joining room:", error);
    res.status(500).send("Error creating/joining room");
  }
};

const endRoom = async (req, res) => {
  const { roomName } = req.body;

  if (!roomName) {
    return res.status(400).send("Room name is required");
  }

  try {
    await twilioClient.video.rooms(roomName).update({ status: "completed" });
    res.status(200).send("Room ended successfully");
  } catch (error) {
    console.error("Error ending room:", error);
    res.status(500).send("Error ending room");
  }
};

module.exports = {
  joinRoom,
  endRoom,
};
