const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const recommendationController = require('../controllers/recommendationController');

// @route   GET /api/recommendations/:userId
// @desc    Get personalized stock recommendations
// @access  Private
router.get('/:userId', protect, recommendationController.getRecommendations);

module.exports = router;
