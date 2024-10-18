// Backend/routes/deepgramRoutes.cjs
const express = require('express');
const { upload, handleFileTranscription } = require('../controllers/deepgramController.cjs');
const router = express.Router();

// Route to handle file transcription requests
router.post('/transcribe', upload.single('audio'), handleFileTranscription);

module.exports = router;