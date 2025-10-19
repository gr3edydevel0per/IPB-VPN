const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const marketController = require('../controllers/marketController');

// @route   GET /api/market
// @desc    Get all stocks with filters
// @access  Public
router.get('/', marketController.getAllStocks);

// @route   GET /api/market/:symbol
// @desc    Get single stock by symbol
// @access  Public
router.get('/:symbol', marketController.getStockBySymbol);

// @route   GET /api/market/search/:query
// @desc    Search stocks by name or symbol
// @access  Public
router.get('/search/:query', marketController.searchStocks);

module.exports = router;
