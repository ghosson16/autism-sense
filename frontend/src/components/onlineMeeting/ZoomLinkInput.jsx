import { useEffect, useState } from 'react';

const ZoomLinkInput = () => {
  const [zoomLink, setZoomLink] = useState('');
  const [sdkLoaded, setSdkLoaded] = useState(false); // New state to track if SDK is loaded
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Polling mechanism to ensure Zoom SDK has fully loaded
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.ZoomMtg) {
        console.log('Zoom SDK loaded');
        setSdkLoaded(true); // SDK is loaded
        window.ZoomMtg.setZoomJSLib('https://source.zoom.us/2.18.3/lib', '/av');
        window.ZoomMtg.preLoadWasm();
        window.ZoomMtg.prepareJssdk();
        clearInterval(interval); // Stop polling once SDK is loaded
      }
    }, 500); // Poll every 500ms

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
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
      setErrorMessage('Invalid Zoom link format.');
      return null;
    }
  };

  const validateZoomLink = (link) => {
    const zoomLinkRegex = /^https:\/\/(us\d{1,2}web\.zoom\.us|zoom\.us)\/j\/\d{9,11}/;
    return zoomLinkRegex.test(link);
  };

  const getSignature = async (meetingNumber, role) => {
    try {
      const response = await fetch('https://autism-sense-backend.onrender.com/api/zoom/generateSignature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingNumber, role }),
      });
      const data = await response.json();
      if (response.ok) {
        return data.signature;
      } else {
        console.error('Error fetching signature:', data.error);
        setErrorMessage('Failed to get signature.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching signature:', error);
      setErrorMessage('Failed to get signature.');
      return null;
    }
  };

  const startMeeting = async (meetingNumber, meetingPassword) => {
    const signature = await getSignature(meetingNumber, 0); // 0 is for participant role
    if (!signature) return;

    setLoading(true); // Set loading state while initializing the meeting
    window.ZoomMtg.init({
      leaveUrl: 'https://ghosson16.github.io/autism-sense/#/home',
      isSupportAV: true,
      success: () => {
        window.ZoomMtg.join({
          meetingNumber: meetingNumber,
          userName: 'Guest User',
          signature: signature,
          apiKey: 'YOUR_ZOOM_API_KEY', // Replace with your API key
          passWord: meetingPassword,
          success: () => {
            console.log('Join meeting success');
            setLoading(false); // Stop loading once the meeting starts
          },
          error: (error) => {
            console.error('Error joining meeting:', error);
            setErrorMessage('Failed to join meeting.');
            setLoading(false);
          },
        });
      },
      error: (error) => {
        console.error('Error initializing Zoom SDK:', error);
        setErrorMessage('Error initializing Zoom SDK.');
        setLoading(false);
      },
    });
  };

  const joinZoomMeeting = () => {
    if (!zoomLink || !validateZoomLink(zoomLink)) {
      setErrorMessage('Please enter a valid Zoom meeting link.');
      return;
    }

    if (!sdkLoaded) {
      setErrorMessage('Zoom SDK is not yet loaded. Please wait...');
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
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: '#fff',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px'
        }}
        disabled={loading || !sdkLoaded} // Disable button if SDK is not loaded
      >
        {loading ? 'Joining...' : 'Join Meeting'}
      </button>
      {errorMessage && <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>}
      <div id="zmmtg-root"></div>  {/* Render Zoom meeting here */}
    </div>
  );
};

export default ZoomLinkInput;
