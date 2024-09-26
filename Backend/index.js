require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db.cjs');
const sessionMiddleware = require('./middleware/sessionMiddleware.cjs');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes.cjs');
const childRoutes = require('./routes/childRoutes.cjs');
const emotionDetectionRoutes = require('./routes/emotionDetectionRoutes.cjs');
const zoomRoutes = require('./routes/zoomRoutes');



const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: ['https://ghosson16.github.io', 'http://localhost:4173'],
  credentials: true ,
}));

app.use(express.json());
app.use(sessionMiddleware);

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/child', childRoutes);
app.use('/api', emotionDetectionRoutes);
app.use('/api/zoom', zoomRoutes);

// Add the `/user` route to check the user session
app.get('/user', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// Example in your backend (Node.js)
app.post('/api/zoom/create-meeting', async (req, res) => {
  const { topic, startTime, duration, password } = req.body;
  // Logic to create a Zoom meeting using the Zoom API
  // Don't forget to handle time conversion and validation
  try {
    const meetingResponse = await createZoomMeeting({ topic, startTime, duration, password });
    res.json(meetingResponse);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create meeting.' });
  }
});


// Example in your backend (Node.js)
app.get('/api/zoom/meetings', async (req, res) => {
  try {
    const meetings = await getZoomMeetings(); // Function to fetch meetings from Zoom
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meetings.' });
  }
});


const ZOOM_API_KEY="xzItAoLSXm8tOVvDOsTg"
const ZOOM_API_SECRET="Xycgl2ogPyy4MSmPgVXppMJ5pQ3Lo0Z7"

app.use(express.json());

app.post('/api/generateSignature', (req, res) => {
  const { meetingNumber, role } = req.body;
  const timestamp = new Date().getTime() - 30000;
  const msg = Buffer.from(`${ZOOM_API_KEY}${meetingNumber}${timestamp}${role}`).toString('base64');
  const hash = crypto.createHmac('sha256', ZOOM_API_SECRET).update(msg).digest('base64');
  const signature = Buffer.from(`${msg}.${hash}`).toString('base64');

  res.json({ signature });
});