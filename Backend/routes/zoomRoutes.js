const express = require('express');
const { getZoomSignature } = require('../controllers/ZoomController'); // Import the controller

const router = express.Router();

// Route for generating Zoom signature
router.post('/signature', getZoomSignature);

module.exports = router;
