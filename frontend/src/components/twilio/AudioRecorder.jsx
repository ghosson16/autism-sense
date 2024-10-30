import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import "../../styles/ModalPop-up.css";

const AudioRecorder = () => {
  const mediaRecorder = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [stream, setStream] = useState(null);
  const [audio, setAudio] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [paused, setPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);


  const mimeType = "audio/webm";
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  // Initialize the stream and start recording when the component mounts
  useEffect(() => {
    const initStream = async () => {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setStream(streamData);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    };
    initStream();
  }, []);

  useEffect(() => {
    if (stream && !paused) {
      startRecording();
    }
  }, [stream, paused]);

  const startRecording = () => {
    setRecordingStatus("recording");
    const media = new MediaRecorder(stream, { mimeType });
    mediaRecorder.current = media;

    const localAudioChunks = [];
    mediaRecorder.current.start();

    mediaRecorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) localAudioChunks.push(event.data);
    };

    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(localAudioChunks, { type: mimeType });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudio(audioUrl);
      STT(audioBlob);
    };
  };

  const stopRecording = () => {
    setRecordingStatus("inactive");
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
    }
  };

  const handleHelpClick = () => {
    setLoading(true);   // Set loading to true when "Help" is clicked
    stopRecording();   // Stop recording when "Help" is clicked
    setPaused(true);    // Set paused state to true
  };

  const handleOkClick = () => {
    setIsModalOpen(false)
  };

  const STT = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.webm');

      const requestUrl = `${apiUrl}/api/deepgram/transcribe`;
      const response = await axios.post(requestUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Token ${import.meta.env.DEEPGRAM_API_KEY}`,
        },
      });

      const transcribe = response.data.conversationContext;
      console.log(transcribe );
      const suggestionText = await generateSuggestion(transcribe);
      setSuggestion(suggestionText);
      setLoading(false);
      setIsModalOpen(true);
      setPaused(false);
    } catch (error) {
      console.error("Error during transcription:", error);
    }
  };

  const generateSuggestion = async (transcribe) => {
    try {
      const requestUrl = `${apiUrl}/api/suggestions/generate`;
      const response = await axios.post(requestUrl, { conversationContext: transcribe });
      return response.data.suggestion;
    } catch (error) {
      console.error("Error generating suggestion:", error);
      return "Oops, I cannot help you now.";
    }
  };

  return (
    <div>
      <button onClick={handleHelpClick} disabled={loading} >
      {loading ? (
        <FontAwesomeIcon icon={faSpinner} spin />
      ) : (
        <>
        <b>Help</b>
          <FontAwesomeIcon icon={faQuestionCircle} style={{ marginLeft: '10px' }} />
        </>
      )}
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>{suggestion}</p>
            <button onClick={handleOkClick}> <b>Close</b></button>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default AudioRecorder;
