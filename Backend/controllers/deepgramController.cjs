// Backend/controllers/deepgramController.cjs
const axios = require('axios');
const multer = require('multer');
require('dotenv').config();
const fs = require('fs');

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

// Multer setup for file handling
const upload = multer({ storage: multer.memoryStorage() });

// Controller function to handle transcription with file upload
const handleFileTranscription = async (req, res) => {
  try {
    const audioFile = req.file;

    if (!audioFile) {
      return res.status(400).json({ message: 'No audio file uploaded' });
    }

    // Send the file buffer to Deepgram
    const response = await axios.post(
      'https://api.deepgram.com/v1/listen',
      audioFile.buffer, // Send the buffer directly
      {
        headers: {
          Authorization: `Token ${DEEPGRAM_API_KEY}`,
          'Content-Type': 'audio/mpeg', // Assuming MP3, change as per file type
        },
        params: {
          punctuate: true,
          language: 'en',
        },
      }
    );

    // Send the transcription result back to the client
    res.status(200).json({ transcription: response.data.results.channels[0].alternatives[0].transcript });
  } catch (error) {
    console.error('Error during transcription:', error.message);
    res.status(500).json({ message: 'Transcription failed', error: error.message });
  }
};

module.exports = { upload, handleFileTranscription };