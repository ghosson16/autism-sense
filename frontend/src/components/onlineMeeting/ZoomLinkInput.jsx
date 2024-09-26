import React, { useState } from 'react';

const ZoomLinkInput = () => {
  const [zoomLink, setZoomLink] = useState('');
  const [error, setError] = useState('');

  const handleZoomLinkChange = (e) => {
    setZoomLink(e.target.value);
  };

  const validateZoomLink = (link) => {
    const zoomLinkRegex = /^https:\/\/(us\d{1,2}web\.zoom\.us|zoom\.us)\/j\/\d{9,11}/;
    return zoomLinkRegex.test(link);
  };

  const joinZoomMeeting = () => {
    if (!zoomLink || !validateZoomLink(zoomLink)) {
      setError('Please enter a valid Zoom meeting link.');
      return;
    }
    setError('');
    // Redirect to the Zoom link
    window.location.href = zoomLink;
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
    </div>
  );
};

export default ZoomLinkInput;
