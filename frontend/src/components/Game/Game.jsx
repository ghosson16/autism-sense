import React, { useEffect, useState } from "react";
import "./Game.css";

export default function Game({ onClose, gameImage, fetchNewImage }) {
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [emojiOptions, setEmojiOptions] = useState([]);
  const [countdown, setCountdown] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);

  const emojiMap = {
    happy: "😊",
    sad: "😢",
    angry: "😠",
    neutral: "😐",
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
  };

  const generateRandomEmojis = () => {
    if (!gameImage || !gameImage.result || !emojiMap[gameImage.result]) {
      console.error("Invalid gameImage or result:", gameImage);
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
      setEmojiOptions(generateRandomEmojis());
    }
  }, [gameImage]);

  const startCountdown = () => {
    let count = 3;
    setCountdown(count);
    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count === 0) {
        clearInterval(interval);
        fetchNewImage();
        setCountdown(0);
      }
    }, 1000);
  };

  const handleEmojiClick = (emoji) => {
    setSelectedEmoji(emoji);
    const isCorrect = emoji === emojiMap[gameImage.result];
    setFeedback(isCorrect ? "Correct!" : "Wrong!");
    setShowResult(true);
    setTotalCount((prev) => prev + 1);

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      setTimeout(() => {
        setShowResult(false);
        startCountdown();
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

  const handleEndGame = () => {
    setGameEnded(true);
  };

  if (gameEnded) {
    return (
      <div className="game-modal">
        <div className="game-modal-content">
          <h3>Game Over</h3>
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
            {showResult && <p className="feedback">{feedback}</p>}
            <p>
              Score: {correctCount} / {totalCount}
            </p>
          </>
        )}
        <button onClick={handleEndGame} className="end-game-button">
          End Game
        </button>
      </div>
    </div>
  );
}
