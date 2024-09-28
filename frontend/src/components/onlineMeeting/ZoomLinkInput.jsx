import React, { useEffect, useState } from 'react';
import { ZoomMtg } from '@zoomus/websdk';
import '@zoomus/websdk/dist/css/bootstrap.css';
import '@zoomus/websdk/dist/css/react-select.css';

const ZoomLinkInput = () => {
  const [zoomLink, setZoomLink] = useState('');
  const [error, setError] = useState('');
  const [meetingNumber, setMeetingNumber] = useState('');
  const [meetingPassword, setMeetingPassword] = useState('');

  // Zoom Web SDK initialization on component mount
  useEffect(() => {
    ZoomMtg.setZoomJSLib('https://source.zoom.us/2.9.5/lib', '/av'); // Set SDK version
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareJssdk();
  }, []);

  // Handle input change for the Zoom link
  const handleZoomLinkChange = (e) => {
    setZoomLink(e.target.value);
  };

  // Extract meeting ID and password from the Zoom link
  const extractMeetingDetails = (link) => {
    try {
      const url = new URL(link);
      const meetingId = url.pathname.split('/')[2];
      const password = url.searchParams.get('pwd');
      return { meetingId, password };
    } catch (error) {
      setError('Invalid Zoom link format.');
      return null;
    }
  };

  // Validate if the provided Zoom link matches the expected format
  const validateZoomLink = (link) => {
    const zoomLinkRegex = /^https:\/\/(us\d{1,2}web\.zoom\.us|zoom\.us)\/j\/\d{9,11}/;
    return zoomLinkRegex.test(link);
  };

  // Fetch the Zoom meeting signature from the backend
  const getSignature = async (meetingNumber, role) => {
    try {
      const response = await fetch('https://autism-sense-backend.onrender.com/api/generateSignature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingNumber, role }),
      });
      const data = await response.json();
      return data.signature;
    } catch (error) {
      setError('Failed to generate meeting signature.');
      console.error('Error fetching signature:', error);
      return null;
    }
  };

  // Start the Zoom meeting using Zoom Web SDK
  const startMeeting = async (meetingNumber, meetingPassword) => {
    const signature = await getSignature(meetingNumber, 0); // 0 is for participant role
    if (!signature) return;

    ZoomMtg.init({
      leaveUrl: 'https://ghosson16.github.io/autism-sense/#/home', // URL to redirect after leaving the meeting
      isSupportAV: true,
      success: () => {
        ZoomMtg.join({
          meetingNumber: meetingNumber,
          userName: 'Guest User',
          signature: signature,
          apiKey: 'xzItAoLSXm8tOVvDOsTg',
          passWord: meetingPassword,
          success: () => {
            console.log('Join meeting success');
          },
          error: (error) => {
            console.error('Error joining meeting:', error);
            setError('Error joining the meeting. Please try again.');
          },
        });
      },
      error: (error) => {
        console.error('Error initializing Zoom SDK:', error);
        setError('Failed to initialize Zoom SDK.');
      },
    });
  };

  // Handle the Join Meeting button click
  const joinZoomMeeting = () => {
    if (!zoomLink || !validateZoomLink(zoomLink)) {
      setError('Please enter a valid Zoom meeting link.');
      return;
    }

    const meetingDetails = extractMeetingDetails(zoomLink);
    if (!meetingDetails) return;

    const { meetingId, password } = meetingDetails;
    setMeetingNumber(meetingId);
    setMeetingPassword(password);
    setError('');

    // Start Zoom meeting
    startMeeting(meetingId, password);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h3>Enter Zoom Meeting Link</h3>
      <input
        type="text"
        value={zoomLink}
        onChange={handleZoomLinkChange}
        placeholder="Enter Zoom Meeting Link"
        style={{
          padding: '10px',
          width: '60%',
          borderRadius: '5px',
          border: '1px solid #ccc',
          marginBottom: '10px'
        }}
      />
      <br />
      <button
        onClick={joinZoomMeeting}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: '#fff',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Join Meeting
      </button>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      <div id="zmmtg-root"></div>
    </div>
  );
};

export default ZoomLinkInput;
