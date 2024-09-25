// src/components/ZoomMeeting.js
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { ZoomMtg } from '@zoomus/websdk';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_BACKEND_URL; // Your backend API URL
const apiUrlFrontend = import.meta.env.VITE_FRONTEND_URL; // Your frontend URL

const ZoomMeeting = () => {
  const [signature, setSignature] = useState('');

  useEffect(() => {
    ZoomMtg.setZoomJSLib('https://source.zoom.us/2.13.0/lib', '/av');
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareJssdk();
  }, []);

  const generateSignature = async (meetingNumber, role) => {
    try {
      const response = await axios.post(`${apiUrl}/api/zoom/generate-signature`, {
        meetingNumber,
        role,
      });
      setSignature(response.data.signature);
      startMeeting(response.data); // Start meeting after getting signature
    } catch (error) {
      console.error('Error generating signature:', error);
    }
  };

  const startMeeting = ({ apiKey, signature, meetingNumber, role }) => {
    ZoomMtg.init({
      leaveUrl: apiUrlFrontend,
      success: () => {
        ZoomMtg.join({
          signature,
          meetingNumber,
          userName: 'Guest',
          apiKey,
          userEmail: '', // Optional: user email
          passWord: '', // Optional: meeting password
          success: () => {
            console.log('Join meeting success');
          },
          error: (err) => {
            console.error('Join meeting error', err);
          },
        });
      },
      error: (err) => {
        console.error('Zoom init error:', err);
      },
    });
  };

  return (
    <div>
      <button onClick={() => generateSignature(123456789, 0)}>Start Zoom Meeting</button>
      <div id="zmmtg-root"></div> {/* This is where the Zoom meeting UI will be rendered */}
    </div>
  );
};

export default ZoomMeeting;

