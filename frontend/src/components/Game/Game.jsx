import React, { useState, useEffect } from 'react';
import './Game.css';  // Import the CSS file

export default function Game({ onClose, gameImage }) {
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(gameImage);  // Accept the image and result from props

  // UseEffect to reset feedback when gameImage changes (every 30 seconds)
  useEffect(() => {
    setFeedback('');
    setSelectedEmoji(null);
    setShowResult(false);
    setCurrentQuestion(gameImage); // Set the new image and result from props
  }, [gameImage]);  // Dependency on gameImage so it resets whenever the image changes

  const handleEmojiClick = (emoji) => {
    setSelectedEmoji(emoji);
    
    // Check if the selected emoji is correct
    const isCorrect = emoji === currentQuestion.result;
    setFeedback(isCorrect ? 'Correct!' : 'Wrong!');
    setShowResult(true);  // Show feedback immediately

    // Optionally, you can store the answer for tracking, or you can remove this part if not needed
  };

  setTimeout(() => {
    console.log(gameImage)
  }, 1000)

  // Render a message if the image is not available yet
  if (!gameImage) {
    return (
      <div className="game-modal">
        <div className="game-modal-content">
          <button onClick={onClose} className="close-btn">
            &#10005;
          </button>
          <p>Please wait until the image appears...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-modal">
      <div className="game-modal-content">
        {/* Close button */}
        <button onClick={onClose} className="close-btn">
          &#10005;
        </button>

        {/* Image and Emoji selection */}
        <div className="game-image">
          <img src={currentQuestion.blob} alt="Question" />
        </div>

        {/* Emoji buttons */}
        <div className="emoji-buttons">
          {['happy', 'sad', 'angry'].map((emoji) => {
            const isCorrect = emoji === currentQuestion.result;
            const isSelected = selectedEmoji === emoji;

            // Apply different styles based on whether the button is selected and if the answer is correct/incorrect
            const buttonClass = isSelected
              ? isCorrect
                ? 'selected-correct'  // Correct answer
                : 'selected-wrong'  // Incorrect answer
              : ''; // Default style when not selected

            return (
              <button
                key={emoji}
                onClick={() => handleEmojiClick(emoji)}
                className={`emoji-btn ${buttonClass}`}
              >
                {emoji === 'happy' && '😊'}
                {emoji === 'sad' && '😢'}
                {emoji === 'angry' && '😠'}
              </button>
            );
          })}
        </div>

        {/* Display feedback for the current answer */}
        {showResult && feedback && (
          <p className={`feedback ${feedback === 'Correct!' ? 'correct' : 'wrong'}`}>
            {feedback}
          </p>
        )}
      </div>
    </div>
  );
}
