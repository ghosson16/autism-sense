/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { ZoomMtg } from '@zoomus/websdk';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_BACKEND_URL;
const apiUrlFrontend = import.meta.env.VITE_FRONTEND_URL;

const ZoomMeeting = () => {
  // eslint-disable-next-line no-unused-vars
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

      // Initialize Zoom meeting once signature is fetched
      startMeeting(response.data);
    } catch (error) {
      console.error('Error generating signature:', error);
    }
  };

  const startMeeting = ({ apiKey, signature, meetingNumber, role }) => {
    ZoomMtg.init({
      leaveUrl: `${apiUrlFrontend}`,
      success: () => {
        ZoomMtg.join({
          signature,
          meetingNumber,
          userName: 'Guest',
          apiKey,
          userEmail: '',
          passWord: '', // Set if there's a password
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
      <div id="zmmtg-root"></div> {/* Zoom meeting will be rendered here */}
    </div>
  );
};

export default ZoomMeeting;
