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
    res.status(200).json({ data: child }); // Including data key for consistency
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

  const updates = req.body;

  // Validate fields if necessary, for example:
  if (updates.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    const updatedChild = await childModel.findByIdAndUpdate(childId, updates, { new: true });
    if (!updatedChild) {
      return res.status(404).json({ message: 'Child not found' });
    }
    res.status(200).json({ message: 'Child data updated successfully', data: updatedChild });
  } catch (err) {
    res.status(500).json({ message: 'Error updating child data', error: err.message });
  }
};

// Delete child account
const deleteChildAccount = async (req, res) => {
  const { childId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(childId)) {
    return res.status(400).json({ message: 'Invalid child ID format' });
  }

  try {
    const deletedChild = await childModel.findByIdAndDelete(childId);
    if (!deletedChild) {
      return res.status(404).json({ message: 'Child not found' });
    }
    res.status(200).json({ message: 'Child account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting child account', error: error.message });
  }
};

module.exports = { fetchChildById, updateChild, deleteChildAccount };
