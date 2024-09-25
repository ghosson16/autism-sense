/* eslint-disable no-unused-vars */
// src/components/Meetings.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/zoom/meetings`);
        setMeetings(response.data);
      } catch (error) {
        console.error('Error fetching meetings:', error);
      }
    };

    fetchMeetings();
  }, []);

  return (
    <div>
      <h2>Your Zoom Meetings</h2>
      {meetings.length === 0 ? (
        <p>No meetings scheduled.</p>
      ) : (
        <ul>
          {meetings.map((meeting) => (
            <li key={meeting.id}>
              <strong>{meeting.topic}</strong>
              <br />
              Start Time: {new Date(meeting.start_time).toLocaleString()}
              <br />
              Duration: {meeting.duration} minutes
              <br />
              <a href={meeting.join_url} target="_blank" rel="noopener noreferrer">
                Join Meeting
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Meetings;
