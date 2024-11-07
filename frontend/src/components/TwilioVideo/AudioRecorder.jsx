import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import "../../styles/ModalPop-up.css";
import { transcribeAudio, generateSuggestion } from "../../services/videoService";

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
      handleTranscription(audioBlob);
    };
  };

  const stopRecording = () => {
    setRecordingStatus("inactive");
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
    }
  };

  const handleHelpClick = () => {
    setLoading(true);
    stopRecording();
    setPaused(true);
  };

  const handleOkClick = () => {
    setIsModalOpen(false);
  };

  const handleTranscription = async (audioBlob) => {
    try {
      const transcribe = await transcribeAudio(audioBlob);
      const suggestionText = await generateSuggestion(transcribe);
      setSuggestion(suggestionText);
      setLoading(false);
      setIsModalOpen(true);
      setPaused(false);
    } catch (error) {
      console.error("Error during transcription or suggestion generation:", error);
      setSuggestion("Oops, I cannot help you now.");
      setLoading(false);
      setIsModalOpen(true);
      setPaused(false);
    }
  };

  return (
    <div>
      <button onClick={handleHelpClick} disabled={loading}>
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
            <button onClick={handleOkClick}><b>Close</b></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
