const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const userController = require('../controllers/userController');

// @route   GET /api/user/preferences
// @desc    Get user preferences
// @access  Private
router.get('/preferences', protect, userController.getPreferences);

// @route   POST /api/user/preferences
// @desc    Update user preferences
// @access  Private
router.post('/preferences', protect, userController.updatePreferences);

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, userController.getProfile);

module.exports = router;
