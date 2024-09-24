import React, { useState } from 'react';
import axios from 'axios';

const EmotionDetection = () => {
    const [file, setFile] = useState(null);
    const [emotion, setEmotion] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError('');  // Clear previous errors when a new file is selected
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmotion('');
        setError('');
        setLoading(true);
    
        if (!file) {
            setError('Please select a file to upload.');
            setLoading(false);
            return;
        }
    
        const formData = new FormData();
        formData.append('image', file);
    
        try {
            // Make API request
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/detect-emotion`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log('Full response from server:', response);  // Log the full response
            console.log('Emotion detected:', response.data.emotion);  // Log the emotion
    
            if (response.data && response.data.emotion) {
                setEmotion(response.data.emotion);
            } else {
                setError('Unexpected response format.');
            }
        } catch (err) {
            console.error('Error during API request:', err);  // Log the error
            setError('Error detecting emotion. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div>
            <h1>Emotion Detection</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit" disabled={loading}>
                    {loading ? 'Detecting...' : 'Detect Emotion'}
                </button>
            </form>
            {emotion && <p>Detected Emotion: {emotion}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default EmotionDetection;
