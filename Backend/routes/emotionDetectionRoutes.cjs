const express = require('express');
const multer = require('multer');
const detectEmotion = require('../controllers/emotionDetectionController.cjs');

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

router.post('/detect-emotion', upload.single('image'), detectEmotion);

module.exports = router;
