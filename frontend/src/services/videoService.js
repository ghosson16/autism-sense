// services/videoService.js
import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export const startMeeting = async (roomName, role) => {
  try {
    const response = await axios.post(`${apiUrl}/api/room/join-room`, {
      roomName,
      role,
    });
    return response.data.token;
  } catch (error) {
    console.error("Error in video service:", error);
    throw error;
  }
};

export const detectEmotion = async (imageData) => {
  try {
    const requestUrl = `${apiUrl}/api/detection/detect-emotion`;
    const response = await axios.post(requestUrl, imageData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.emotion;
  } catch (error) {
    console.error("Error detecting emotion:", error);
    throw error;
  }
};

export const transcribeAudio = async (audioBlob) => {
  try {
    const formData = new FormData();
    formData.append("audio", audioBlob, "audio.webm");

    const requestUrl = `${apiUrl}/api/deepgram/transcribe`;
    const response = await axios.post(requestUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Token ${import.meta.env.DEEPGRAM_API_KEY}`,
      },
    });
    return response.data.conversationContext;
  } catch (error) {
    console.error("Error during transcription:", error);
    throw error;
  }
};

export const generateSuggestion = async (conversationContext) => {
  try {
    const requestUrl = `${apiUrl}/api/suggestions/generate`;
    const response = await axios.post(requestUrl, { conversationContext });
    return response.data.suggestion;
  } catch (error) {
    console.error("Error generating suggestion:", error);
    throw error;
  }
};


