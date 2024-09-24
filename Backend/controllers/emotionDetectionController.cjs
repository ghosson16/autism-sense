const express = require('express');
const { PythonShell } = require('python-shell');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    }
    cb(new Error('File type not supported'), false);
  }
});

router.post('/detect-emotion', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const imagePath = path.resolve(__dirname, 'uploads', req.file.filename);

  const options = {
    args: [imagePath]
  };

  PythonShell.run('emotionDetection.py', options, (err, results) => {
    if (err) {
      console.error('Error running Python script:', err);
      return res.status(500).json({ message: 'Error detecting emotion' });
    }

    if (results && results.length > 0) {
      const emotion = results[0].trim();
      return res.json({ emotion });
    } else {
      return res.status(500).json({ message: 'No emotion detected' });
    }
  });
});

module.exports = router;
