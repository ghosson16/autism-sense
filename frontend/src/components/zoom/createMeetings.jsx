/* eslint-disable no-unused-vars */
// src/components/CreateMeeting.jsx
import React, { useState } from 'react';
import axios from 'axios';

const CreateMeeting = () => {
  const [topic, setTopic] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(30); // Default duration in minutes
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/zoom/create-meeting`, {
        topic,
        startTime,
        duration,
        password,
      });
      alert(`Meeting created: ${response.data.join_url}`);
    } catch (error) {
      console.error('Error creating meeting:', error);
      alert('Failed to create meeting. Please try again.');
    }
  };

  return (
    <div>
      <h2>Create Zoom Meeting</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Meeting Topic:</label>
          <input 
            type="text" 
            value={topic} 
            onChange={(e) => setTopic(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Start Time:</label>
          <input 
            type="datetime-local" 
            value={startTime} 
            onChange={(e) => setStartTime(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Duration (minutes):</label>
          <input 
            type="number" 
            value={duration} 
            onChange={(e) => setDuration(e.target.value)} 
            required 
            min="1" 
          />
        </div>
        <div>
          <label>Meeting Password:</label>
          <input 
            type="text" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        <button type="submit">Create Meeting</button>
      </form>
    </div>
  );
};

export default CreateMeeting;
