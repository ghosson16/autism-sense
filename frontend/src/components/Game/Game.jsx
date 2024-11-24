import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Game.css";

// eslint-disable-next-line react/prop-types
export default function Game({ onClose, gameImage, fetchNewImage, childId }) {
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [emojiOptions, setEmojiOptions] = useState([]);
  const [countdown, setCountdown] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [error, setError] = useState(null);

  const emojiMap = {
    happy: "😊",
    sad: "😢",
    angry: "😠",
    neutral: "😐",
    surprised: "😲",
  };

  const resetGameState = () => {
    setSelectedEmoji(null);
    setFeedback("");
    setShowResult(false);
    setWrongAttempts(0);
    setEmojiOptions([]);
    setCountdown(0);
    setCorrectCount(0);
    setTotalCount(0);
    setGameEnded(false);
    setError(null);
  };

  const generateRandomEmojis = () => {
    if (!gameImage || !gameImage.result || !emojiMap[gameImage.result]) {
      return [];
    }

    const incorrectEmojis = Object.keys(emojiMap).filter(
      (emoji) => emoji !== gameImage.result
    );
    const shuffledIncorrect = incorrectEmojis.sort(() => 0.5 - Math.random());
    return [
      emojiMap[gameImage.result],
      emojiMap[shuffledIncorrect[0]],
      emojiMap[shuffledIncorrect[1]],
    ].sort(() => 0.5 - Math.random());
  };

  useEffect(() => {
    if (gameImage) {
      setFeedback("");
      setSelectedEmoji(null);
      setShowResult(false);
      setWrongAttempts(0);

      if (gameImage.result && emojiMap[gameImage.result]) {
        setEmojiOptions(generateRandomEmojis());
      } else {
        handleNoEmotionDetected();
      }
    }
  }, [gameImage]);

  const startCountdown = (onComplete) => {
    let count = 3;
    setCountdown(count);
    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count === 0) {
        clearInterval(interval);
        setCountdown(0);
        if (onComplete) onComplete();
      }
    }, 1000);
  };

  const handleNoEmotionDetected = () => {
    setFeedback("No emotion detected. Skipping to the next question...");
    setShowResult(true);

    setTimeout(() => {
      setShowResult(false);
      fetchNewImage();
    }, 2000);
  };

  const handleEmojiClick = (emoji) => {
    if (!gameImage.result) {
      handleNoEmotionDetected();
      return;
    }

    setSelectedEmoji(emoji);
    const isCorrect = emoji === emojiMap[gameImage.result];
    setFeedback(isCorrect ? "Correct!" : "Wrong!");
    setShowResult(true);
    setTotalCount((prev) => prev + 1);

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      setTimeout(() => {
        setShowResult(false);
        startCountdown(fetchNewImage);
      }, 2000);
    } else {
      setWrongAttempts((prev) => prev + 1);
      if (wrongAttempts + 1 >= 2) {
        setTimeout(() => {
          setShowResult(false);
          fetchNewImage();
        }, 2000);
      }
    }
  };

  const saveScoreToBackend = async () => {
    try {
      await axios.post("http://localhost:5000/api/gamescores", {
        childId,
        correctCount,
        totalCount,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error saving score:", err);
      setError("Failed to save your game score. Please try again later.");
    }
  };

  const handleEndGame = async () => {
    setGameEnded(true);
    await saveScoreToBackend();
  };

  if (gameEnded) {
    return (
      <div className="game-modal">
        <div className="game-modal-content">
          <h3>Good job!</h3>
          <p>
            You answered {correctCount} out of {totalCount} correctly!
          </p>
          <button onClick={onClose} className="end-game-button">
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!gameImage || !gameImage.blob) {
    return (
      <div className="game-modal">
        <div className="game-modal-content">
          <p>Please wait until the image appears...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-modal">
      <div className="game-modal-content">
        {countdown > 0 ? (
          <div className="countdown-circle">
            <span>{countdown}</span>
          </div>
        ) : (
          <>
            <div className="game-image">
              <img src={gameImage.blob} alt="Question" />
            </div>
            {emojiOptions.length > 0 ? (
              <div className="emoji-buttons">
                {emojiOptions.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => handleEmojiClick(emoji)}
                    className={`emoji-btn ${
                      selectedEmoji === emoji
                        ? feedback === "Correct!"
                          ? "selected-correct"
                          : "selected-wrong"
                        : ""
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            ) : (
              <p>No valid emotion detected. Skipping...</p>
            )}
            {showResult && <p className="feedback">{feedback}</p>}
            <p>
              Score: {correctCount} / {totalCount}
            </p>
          </>
        )}
        <button onClick={handleEndGame} className="end-game-button">
          End Game
        </button>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}