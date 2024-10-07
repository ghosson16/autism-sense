const express = require('express');
const multer = require('multer');
const detectEmotion = require('../controllers/emotionDetectionController.cjs'); // Correct import

const router = express.Router();

// Configure multer to store files in memory (as buffers)
const storage = multer.memoryStorage();  // Use memory storage
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    }
    cb(new Error('File type not supported'), false);
  },
  limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
});

// POST route for detecting emotion from an uploaded image
router.post('/detect-emotion', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Convert image buffer to base64 string
    const base64Image = req.file.buffer.toString('base64');

    // Call the detectEmotion controller, passing the base64-encoded image
    await detectEmotion(base64Image, res);
  } catch (error) {
    console.error('Error in POST /detect-emotion:', error);

    if (error instanceof multer.MulterError || error.message === 'File type not supported') {
      return res.status(400).json({ message: error.message });
    }
    next(error); // Pass other errors to error handler
  }
});

module.exports = router;
