// Backend/routes/transcriptionRoutes.js
const express = require('express');
const { handleTranscription } = require('../controllers/transcriptionController');

const router = express.Router();

router.post('/transcribe', handleTranscription);

module.exports = router;
