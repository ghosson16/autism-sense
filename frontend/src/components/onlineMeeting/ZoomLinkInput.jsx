import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ZoomLinkInput = () => {
  const [zoomLink, setZoomLink] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (zoomLink.startsWith('https://zoom.us/j/')) {
      // Redirect to the meeting page with the link
      navigate('/meeting', { state: { zoomLink } });
    } else {
      alert('Please enter a valid Zoom meeting link');
    }
  };

  return (
    <div className="zoom-link-input-page">
      <input
        type="text"
        placeholder="Enter Zoom Meeting Link"
        value={zoomLink}
        onChange={(e) => setZoomLink(e.target.value)}
      />
      <button onClick={handleSubmit}>Join Meeting</button>
    </div>
  );
};

export default ZoomLinkInput;
