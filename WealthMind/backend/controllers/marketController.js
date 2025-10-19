const Stock = require('../models/Stock');

// @desc    Get all stocks with optional filters
// @route   GET /api/market
// @access  Public
exports.getAllStocks = async (req, res) => {
  try {
    const { sector, riskLevel, marketCap, sortBy, order } = req.query;

    // Build filter object
    const filter = {};
    if (sector) filter.sector = sector;
    if (riskLevel) filter.riskLevel = riskLevel;
    if (marketCap) filter.marketCap = marketCap;

    // Build sort object
    let sort = {};
    if (sortBy) {
      const sortOrder = order === 'desc' ? -1 : 1;
      sort[sortBy] = sortOrder;
    } else {
      sort = { symbol: 1 }; // Default sort by symbol
    }

    const stocks = await Stock.find(filter).sort(sort);

    res.status(200).json({
      success: true,
      count: stocks.length,
      stocks
    });
  } catch (error) {
    console.error('Get all stocks error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stocks',
      error: error.message
    });
  }
};

// @desc    Get single stock by symbol
// @route   GET /api/market/:symbol
// @access  Public
exports.getStockBySymbol = async (req, res) => {
  try {
    const { symbol } = req.params;

    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });

    if (!stock) {
      return res.status(404).json({
        success: false,
        message: 'Stock not found'
      });
    }

    res.status(200).json({
      success: true,
      stock
    });
  } catch (error) {
    console.error('Get stock by symbol error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stock',
      error: error.message
    });
  }
};

// @desc    Search stocks by name or symbol
// @route   GET /api/market/search/:query
// @access  Public
exports.searchStocks = async (req, res) => {
  try {
    const { query } = req.params;

    const stocks = await Stock.find({
      $or: [
        { symbol: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } }
      ]
    }).limit(20);

    res.status(200).json({
      success: true,
      count: stocks.length,
      stocks
    });
  } catch (error) {
    console.error('Search stocks error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching stocks',
      error: error.message
    });
  }
};
