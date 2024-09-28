import { useEffect, useState } from 'react';

const ZoomLinkInput = () => {
  const [zoomLink, setZoomLink] = useState('');

  // Use window.onload to ensure the Zoom SDK has fully loaded
  useEffect(() => {
    window.onload = () => {
      if (window.ZoomMtg) {
        console.log('Zoom SDK loaded');
        ZoomMtg.setZoomJSLib('https://source.zoom.us/2.18.3/lib', '/av'); // Set SDK version
        ZoomMtg.preLoadWasm();
        ZoomMtg.prepareJssdk();
      } else {
        console.error('Zoom SDK not loaded');
      }
    };
  }, []);

  const handleZoomLinkChange = (e) => {
    setZoomLink(e.target.value);
  };

  const extractMeetingDetails = (link) => {
    try {
      const url = new URL(link);
      const meetingId = url.pathname.split('/')[2];
      const password = url.searchParams.get('pwd');
      return { meetingId, password };
    } catch (error) {
      console.error('Invalid Zoom link format.');
      return null;
    }
  };

  const validateZoomLink = (link) => {
    const zoomLinkRegex = /^https:\/\/(us\d{1,2}web\.zoom\.us|zoom\.us)\/j\/\d{9,11}/;
    return zoomLinkRegex.test(link);
  };

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
      console.error('Error fetching signature:', error);
      return null;
    }
  };

  const startMeeting = async (meetingNumber, meetingPassword) => {
    const signature = await getSignature(meetingNumber, 0); // 0 is for participant role
    if (!signature) return;

    ZoomMtg.init({
      leaveUrl: 'https://ghosson16.github.io/autism-sense/#/home',
      isSupportAV: true,
      success: () => {
        ZoomMtg.join({
          meetingNumber: meetingNumber,
          userName: 'Guest User',
          signature: signature,
          apiKey: 'YOUR_ZOOM_API_KEY',
          passWord: meetingPassword,
          success: () => {
            console.log('Join meeting success');
          },
          error: (error) => {
            console.error('Error joining meeting:', error);
          },
        });
      },
      error: (error) => {
        console.error('Error initializing Zoom SDK:', error);
      },
    });
  };

  const joinZoomMeeting = () => {
    if (!zoomLink || !validateZoomLink(zoomLink)) {
      console.error('Please enter a valid Zoom meeting link.');
      return;
    }

    const meetingDetails = extractMeetingDetails(zoomLink);
    if (!meetingDetails) return;

    const { meetingId, password } = meetingDetails;

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
      <div id="zmmtg-root"></div>  {/* Render Zoom meeting here */}
    </div>
  );
};

export default ZoomLinkInput;
