const express = require('express');
const crypto = require('crypto');  // Import crypto for signature generation
const router = express.Router();

const ZOOM_API_KEY = process.env.ZOOM_API_KEY;
const ZOOM_API_SECRET = process.env.ZOOM_API_SECRET;

// Generate Zoom signature
router.post('/generateSignature', (req, res) => {
  const { meetingNumber, role } = req.body;

  // Validate the request body
  if (!meetingNumber || role == null) {
    return res.status(400).json({ error: "Missing meetingNumber or role" });
  }

  try {
    // Generate the signature based on Zoom's SDK requirements
    const timestamp = new Date().getTime() - 30000; // Subtracting 30 seconds from current time
    const msg = Buffer.from(`${ZOOM_API_KEY}${meetingNumber}${timestamp}${role}`).toString('base64');

    const hash = crypto.createHmac('sha256', ZOOM_API_SECRET).update(msg).digest('base64');

    const signature = Buffer.from(`${ZOOM_API_KEY}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64');

    // Send the generated signature in response
    res.json({ signature });
  } catch (error) {
    console.error('Error generating signature:', error);
    res.status(500).json({ error: 'Unable to generate signature' });
  }
});

// Create a Zoom meeting (example)
router.post('/create-meeting', async (req, res) => {
  const { topic, startTime, duration, password } = req.body;
  // Add your Zoom API integration to create a meeting here
  // For now, we return a dummy response
  try {
    const meetingResponse = await createZoomMeeting({ topic, startTime, duration, password });
    res.json(meetingResponse);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create meeting.' });
  }
});

// Get Zoom meetings (example)
router.get('/meetings', async (req, res) => {
  try {
    const meetings = await getZoomMeetings(); // Function to fetch meetings from Zoom
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meetings.' });
  }
});

module.exports = router;
