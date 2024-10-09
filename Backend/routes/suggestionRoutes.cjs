// routes/suggestionRoutes.cjs
const express = require('express');
const router = express.Router();
const suggestionController = require('../controllers/suggestionController.cjs');

router.post('/generate', suggestionController.generateSuggestion);

module.exports = router;
