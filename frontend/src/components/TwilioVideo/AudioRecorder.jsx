// components/AudioRecorder.js
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import "../../styles/ModalPop-up.css";
import { transcribeAudio, generateSuggestion } from "../../services/videoService"; // Import services

const AudioRecorder = () => {
  const mediaRecorder = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [stream, setStream] = useState(null);
  const [audio, setAudio] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [paused, setPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const startRecording = () => {
    setRecordingStatus("recording");
    const media = new MediaRecorder(stream, { mimeType: "audio/webm" });
    mediaRecorder.current = media;

    const localAudioChunks = [];
    mediaRecorder.current.start();

    mediaRecorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) localAudioChunks.push(event.data);
    };

    mediaRecorder.current.onstop = async () => {
      const audioBlob = new Blob(localAudioChunks, { type: "audio/webm" });
      setAudio(URL.createObjectURL(audioBlob));
      await processAudio(audioBlob);
    };
  };

  const processAudio = async (audioBlob) => {
    try {
      setLoading(true);
      const conversationContext = await transcribeAudio(audioBlob);
      const suggestionText = await generateSuggestion(conversationContext);
      setSuggestion(suggestionText);
      setLoading(false);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error during transcription:", error);
      setSuggestion("Oops, I cannot help you now.");
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => startRecording()} disabled={loading}>
        {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Help"}
      </button>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>{suggestion}</p>
            <button onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
