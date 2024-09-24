require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db.cjs');
const sessionMiddleware = require('./middleware/sessionMiddleware.cjs');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes.cjs');
const childRoutes = require('./routes/childRoutes.cjs');
const emotionDetectionRoutes = require('./routes/emotionDetectionRoutes.cjs');


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
