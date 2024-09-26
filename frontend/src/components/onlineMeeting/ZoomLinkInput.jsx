import React, { useEffect, useState } from 'react';
import { ZoomMtg } from '@zoomus/websdk';
import '../../node_modules/@zoomus/websdk/dist/css/bootstrap.css';
import '../../node_modules/@zoomus/websdk/dist/css/react-select.css';

const ZoomLinkInput = () => {
  const [zoomLink, setZoomLink] = useState('');
  const [error, setError] = useState('');
  const [meetingNumber, setMeetingNumber] = useState('');
  const [meetingPassword, setMeetingPassword] = useState('');

  useEffect(() => {
    ZoomMtg.setZoomJSLib('https://source.zoom.us/2.9.5/lib', '/av'); // Set SDK version
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareJssdk();
  }, []);

  const handleZoomLinkChange = (e) => {
    setZoomLink(e.target.value);
  };

  const extractMeetingDetails = (link) => {
    const url = new URL(link);
    const meetingId = url.pathname.split('/')[2];
    const password = url.searchParams.get('pwd');
    return { meetingId, password };
  };

  const validateZoomLink = (link) => {
    const zoomLinkRegex = /^https:\/\/(us\d{1,2}web\.zoom\.us|zoom\.us)\/j\/\d{9,11}/;
    return zoomLinkRegex.test(link);
  };

  const getSignature = async (meetingNumber, role) => {
    // This should be replaced with a request to your backend
    const response = await fetch('https://autism-sense-backend.onrender.com/api/generateSignature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ meetingNumber, role }),
    });

    const data = await response.json();
    return data.signature;
  };

  const startMeeting = async (meetingNumber, meetingPassword) => {
    const signature = await getSignature(meetingNumber, 0); // 0 is for a participant role

    ZoomMtg.init({
      leaveUrl: 'https://ghosson16.github.io/autism-sense', // Replace with your own URL
      isSupportAV: true,
      success: () => {
        ZoomMtg.join({
          meetingNumber: meetingNumber,
          userName: 'Guest User', // You can get the actual username from your app
          signature: signature,
          apiKey: 'xzItAoLSXm8tOVvDOsTg',
          passWord: meetingPassword,
          success: () => {
            console.log('Join meeting success');
          },
          error: (error) => {
            console.error(error);
          },
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
  };

  const joinZoomMeeting = () => {
    if (!zoomLink || !validateZoomLink(zoomLink)) {
      setError('Please enter a valid Zoom meeting link.');
      return;
    }

    const { meetingId, password } = extractMeetingDetails(zoomLink);
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
