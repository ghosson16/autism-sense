const crypto = require('crypto');

// Helper function to generate Zoom signature
const generateZoomSignature = (apiKey, apiSecret, meetingNumber, role) => {
  const timestamp = new Date().getTime() - 30000;
  const msg = Buffer.from(apiKey + meetingNumber + timestamp + role).toString('base64');
  const hash = crypto.createHmac('sha256', apiSecret).update(msg).digest('base64');
  const signature = Buffer.from(`${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64');
  return signature;
};

// Controller for generating the Zoom signature
const getZoomSignature = (req, res) => {
  const { meetingNumber, role } = req.body;
  const apiKey = process.env.ZOOM_API_KEY;
  const apiSecret = process.env.ZOOM_API_SECRET;

  if (!meetingNumber || !role) {
    return res.status(400).json({ message: 'Meeting number and role are required.' });
  }

  try {
    const signature = generateZoomSignature(apiKey, apiSecret, meetingNumber, role);
    res.json({ signature });
  } catch (error) {
    console.error('Error generating Zoom signature:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getZoomSignature
};
