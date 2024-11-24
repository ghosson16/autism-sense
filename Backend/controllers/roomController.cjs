const { v4: uuidv4 } = require("uuid");
const { twilioClient } = require("../config/twilioConfig.cjs");
const AccessToken = require("twilio").jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

// Function to find or create a room (only for hosts)
const findOrCreateRoom = async (roomName, role) => {
  try {
    // Fetch the room; create it only if it doesn't exist and the role is host
    await twilioClient.video.rooms(roomName).fetch();
    console.log(`Room "${roomName}" already exists.`);
  } catch (error) {
    if (error.code === 20404 && role === "host") {
      // Create the room only if the role is "host"
      console.log(`Room "${roomName}" does not exist. Creating a new one for the host.`);
      await twilioClient.video.rooms.create({
        uniqueName: roomName,
        type: "go",
      });
    } else if (error.code === 20404 && role === "guest") {
      // Guests cannot create rooms
      console.log(`Room "${roomName}" does not exist. Guests cannot create rooms.`);
      throw new Error("Room does not exist. Please check the room link or ask the host to create it.");
    } else {
      console.error(`Error fetching room "${roomName}":`, error);
      throw error;
    }
  }
};

// Function to generate an access token
const getAccessToken = (roomName, role) => {
  if (!["guest", "host"].includes(role)) {
    throw new Error("Invalid role provided.");
  }

  const identity = uuidv4(); // Generate a unique identity for each participant
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY_SID,
    process.env.TWILIO_API_KEY_SECRET,
    { identity: identity, ttl: 3600 } // 1-hour token validity
  );

  const videoGrant = new VideoGrant({
    room: roomName,
    region: "gll", // Default region
  });

  token.addGrant(videoGrant);

  return token.toJwt(); // Return the JWT token as a string
};

// Route handler for joining a room
const joinRoom = async (req, res) => {
  const { roomName, role } = req.body;

  if (!roomName) {
    console.log("Room name is missing from the request.");
    return res.status(400).send("Room name is required");
  }

  try {
    // Find or create the room if the user is a host
    await findOrCreateRoom(roomName, role);

    // Generate a token for the user to join the room
    const token = getAccessToken(roomName, role);
    res.status(200).send({ token });
  } catch (error) {
    console.error("Error creating/joining room:", error.message);
    if (error.message === "Room does not exist. Please check the room link or ask the host to create it.") {
      res.status(404).send(error.message);
    } else {
      res.status(500).send("Error creating/joining room");
    }
  }
};

// Route handler for ending a room
const endRoom = async (req, res) => {
  const { roomName } = req.body;

  if (!roomName) {
    console.log("Room name is missing from the request.");
    return res.status(400).send("Room name is required");
  }

  try {
    await twilioClient.video.rooms(roomName).update({ status: "completed" });
    console.log(`Room "${roomName}" has been ended successfully.`);
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
