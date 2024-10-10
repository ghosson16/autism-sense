const mongoose = require('mongoose');
const childModel = require('../models/ChildSchema.cjs');

// Fetch child by ID
const fetchChildById = async (req, res) => {
  const { childId } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(childId)) {
    return res.status(400).json({ message: 'Invalid child ID format' });
  }
  
  try {
    const child = await childModel.findById(childId);
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }
    res.json(child);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching child data', error: err.message });
  }
};

// Update child data
const updateChild = async (req, res) => {
  const { childId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(childId)) {
    return res.status(400).json({ message: 'Invalid child ID format' });
  }
  
  try {
    const updatedChild = await childModel.findByIdAndUpdate(childId, req.body, { new: true });
    
    if (!updatedChild) {
      return res.status(404).json({ message: 'Child not found' });
    }
    
    res.status(200).json({ message: 'Child data updated successfully', updatedChild });
  } catch (err) {
    res.status(500).json({ message: 'Error updating child data', error: err.message });
  }
};

module.exports = { fetchChildById, updateChild };
