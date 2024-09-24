const express = require('express');
const { fetchChildById, updateChild } = require('../controllers/childController.cjs');

const router = express.Router();

router.get('/child-profile/:childId', fetchChildById);
router.put('/update-child/:childId', updateChild);

module.exports = router;
