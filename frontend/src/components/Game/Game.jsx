import React, { useState } from 'react';
import './Game.css';  // Import the CSS file

export default function Game({ onClose }) {
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Array for the 3 questions (image URLs, correct answer, and corresponding value)
  const questions = [
    { id: 1, image: 'https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg', correctAnswer: 'happy', value: 'question1' },
    { id: 2, image: 'https://png.pngtree.com/background/20230426/original/pngtree-sad-face-portrait-of-asian-woman-picture-image_2481203.jpg', correctAnswer: 'sad', value: 'question2' },
    { id: 3, image: 'https://cdn.mos.cms.futurecdn.net/DMUbjq2UjJcG3umGv3Qjjd-1200-80.jpeg', correctAnswer: 'angry', value: 'question3' }
  ];

  const handleEmojiClick = (emoji) => {
    setSelectedEmoji(emoji);
    // Check if the selected emoji is correct
    const isCorrect = emoji === questions[currentQuestionIndex].correctAnswer;
    setFeedback(isCorrect ? 'Correct!' : 'Wrong!');

    // Store the answer immediately before transitioning to the next question
    setAnswers((prevAnswers) => [
      ...prevAnswers,
      { question: questions[currentQuestionIndex].value, answer: emoji, correct: isCorrect }
    ]);

    // Move to the next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setSelectedEmoji(null); // Reset emoji for the next question
        setFeedback('');
      } else {
        // After the last question, show the score page
        setShowResult(true);
      }
    }, 1000); // Delay before moving to the next question
  };

  const renderScorePage = () => {
    const correctAnswers = answers.filter((answer) => answer.correct).length;
    
    return (
      <div className="score-page">
        <h2>Your Score</h2>
        <div className="stars-container">
          {/* Render stars based on correct answers */}
          {answers.map((answer, index) => (
            <span
              key={index}
              className={`star ${answer.correct ? 'correct' : 'incorrect'}`}
            >
              &#9733;
            </span>
          ))}
        </div>
        <p>
          You answered {correctAnswers} out of {questions.length} questions correctly.
        </p>
        <button onClick={onClose} className="close-btn">
          Close
        </button>
      </div>
    );
  };

  return (
    <div className="game-modal">
      <div className="game-modal-content">
        {/* Close button */}
        <button onClick={onClose} className="close-btn">
          &#10005;
        </button>

        {/* Display Result page when game is over */}
        {showResult ? (
          renderScorePage()
        ) : (
          <>
            {/* Image and Emoji selection */}
            <div className="game-image">
              <img src={questions[currentQuestionIndex].image} alt="Question" />
            </div>

            {/* Emoji buttons */}
            <div className="emoji-buttons">
              {['happy', 'sad', 'angry'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiClick(emoji)}
                  className={`emoji-btn ${selectedEmoji === emoji ? `selected-${emoji}` : ''}`}
                >
                  {emoji === 'happy' && '😊'}
                  {emoji === 'sad' && '😢'}
                  {emoji === 'angry' && '😠'}
                </button>
              ))}
            </div>

            {/* Display feedback for the current answer */}
            {feedback && (
              <p className={`feedback ${feedback === 'Correct!' ? 'correct' : 'wrong'}`}>
                {feedback}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
