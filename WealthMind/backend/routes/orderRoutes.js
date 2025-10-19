const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

// @route   POST /api/orders/buy
// @desc    Buy stock
// @access  Private
router.post('/buy', protect, orderController.buyStock);

// @route   POST /api/orders/sell
// @desc    Sell stock
// @access  Private
router.post('/sell', protect, orderController.sellStock);

// @route   GET /api/orders/history
// @desc    Get user order history
// @access  Private
router.get('/history', protect, orderController.getOrderHistory);

module.exports = router;
