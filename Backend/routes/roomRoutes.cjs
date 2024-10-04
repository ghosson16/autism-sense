const express = require("express");
const { joinRoom, endRoom } = require("../controllers/roomController.cjs");

const router = express.Router();

router.post("/join-room", joinRoom);
router.post("/end-room", endRoom);

module.exports = router;
