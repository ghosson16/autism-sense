// Backend/index.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db.cjs');
const cors = require('cors');
const sessionMiddleware = require('./middleware/sessionMiddleware.cjs');

const authRoutes = require('./routes/authRoutes.cjs');
const childRoutes = require('./routes/childRoutes.cjs');
const deepgramRoutes = require('./routes/deepgramRoutes.cjs'); // Add deepgram routes

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: ['http://localhost:4173', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(sessionMiddleware);

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/child', childRoutes);
app.use('/api/deepgram', deepgramRoutes); // Register Deepgram routes

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});