// routes/childRoutes.js
const express = require('express');
const { 
  fetchChildById, 
  updateChild, 
  deleteChildAccount  // Import the delete function
} = require('../controllers/childController.cjs');

const router = express.Router();

// Fetch child profile
router.get('/child-profile/:childId', fetchChildById);

// Update child data
router.put('/update-child/:childId', updateChild);

// Delete child account
router.delete('/delete-child/:childId', deleteChildAccount); 

module.exports = router;
