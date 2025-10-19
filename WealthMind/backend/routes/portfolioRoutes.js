const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const portfolioController = require('../controllers/portfolioController');

// @route   GET /api/portfolio
// @desc    Get user portfolio
// @access  Private
router.get('/', protect, portfolioController.getPortfolio);

// @route   GET /api/portfolio/stats
// @desc    Get portfolio statistics
// @access  Private
router.get('/stats', protect, portfolioController.getPortfolioStats);

module.exports = router;
