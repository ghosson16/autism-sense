// Backend/controllers/transcriptionController.js
const axios = require('axios');

const apiKey = process.env.ASSEMBLYAI_API_KEY;

// Upload audio file to AssemblyAI
const uploadAudio = async (audioBuffer) => {
  try {
    const response = await axios.post('https://api.assemblyai.com/v2/upload', audioBuffer, {
      headers: {
        authorization: apiKey,
        'Transfer-Encoding': 'chunked',
      },
    });
    return response.data.upload_url;
  } catch (error) {
    console.error('Error uploading audio:', error.message);
    throw error;
  }
};

// Transcribe the uploaded audio
const transcribeAudio = async (audioUrl) => {
  try {
    const response = await axios.post(
      'https://api.assemblyai.com/v2/transcript',
      { audio_url: audioUrl },
      {
        headers: {
          authorization: apiKey,
          'content-type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error transcribing audio:', error.message);
    throw error;
  }
};

// Controller function to handle the transcription process
const handleTranscription = async (req, res) => {
  try {
    const { audioBuffer } = req.body;
    const audioUrl = await uploadAudio(audioBuffer);
    const transcriptionResult = await transcribeAudio(audioUrl);
    res.json({ transcription: transcriptionResult });
  } catch (error) {
    res.status(500).json({ message: 'Transcription failed', error: error.message });
  }
};

module.exports = { handleTranscription };
