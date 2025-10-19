const Order = require('../models/Order');
const Portfolio = require('../models/Portfolio');
const Stock = require('../models/Stock');

// @desc    Buy stock
// @route   POST /api/orders/buy
// @access  Private
exports.buyStock = async (req, res) => {
  try {
    const { symbol, quantity } = req.body;

    // Validate input
    if (!symbol || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid symbol or quantity'
      });
    }

    // Get stock details
    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
    if (!stock) {
      return res.status(404).json({
        success: false,
        message: 'Stock not found'
      });
    }

    const totalAmount = stock.price * quantity;

    // Create order
    const order = await Order.create({
      userId: req.user.id,
      stockId: stock._id,
      symbol: stock.symbol,
      orderType: 'BUY',
      quantity,
      price: stock.price,
      totalAmount,
      status: 'COMPLETED'
    });

    // Update portfolio
    let portfolio = await Portfolio.findOne({ userId: req.user.id });
    
    if (!portfolio) {
      portfolio = await Portfolio.create({
        userId: req.user.id,
        holdings: [],
        totalInvested: 0,
        currentValue: 0
      });
    }

    // Check if stock already exists in portfolio
    const existingHoldingIndex = portfolio.holdings.findIndex(
      h => h.symbol === stock.symbol
    );

    if (existingHoldingIndex > -1) {
      // Update existing holding
      const holding = portfolio.holdings[existingHoldingIndex];
      const newTotalInvested = holding.totalInvested + totalAmount;
      const newQuantity = holding.quantity + quantity;
      const newAvgPrice = newTotalInvested / newQuantity;

      portfolio.holdings[existingHoldingIndex] = {
        stockId: stock._id,
        symbol: stock.symbol,
        quantity: newQuantity,
        avgBuyPrice: newAvgPrice,
        totalInvested: newTotalInvested,
        currentValue: newQuantity * stock.price,
        profitLoss: (newQuantity * stock.price) - newTotalInvested,
        profitLossPercent: (((newQuantity * stock.price) - newTotalInvested) / newTotalInvested) * 100
      };
    } else {
      // Add new holding
      portfolio.holdings.push({
        stockId: stock._id,
        symbol: stock.symbol,
        quantity,
        avgBuyPrice: stock.price,
        totalInvested: totalAmount,
        currentValue: totalAmount,
        profitLoss: 0,
        profitLossPercent: 0
      });
    }

    // Update portfolio totals
    portfolio.totalInvested += totalAmount;
    portfolio.currentValue = portfolio.holdings.reduce(
      (sum, h) => sum + (h.currentValue || 0),
      0
    );
    portfolio.totalProfitLoss = portfolio.currentValue - portfolio.totalInvested;

    await portfolio.save();

    res.status(201).json({
      success: true,
      message: 'Stock purchased successfully',
      order,
      portfolio
    });
  } catch (error) {
    console.error('Buy stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Error purchasing stock',
      error: error.message
    });
  }
};

// @desc    Sell stock
// @route   POST /api/orders/sell
// @access  Private
exports.sellStock = async (req, res) => {
  try {
    const { symbol, quantity } = req.body;

    // Validate input
    if (!symbol || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid symbol or quantity'
      });
    }

    // Get stock details
    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
    if (!stock) {
      return res.status(404).json({
        success: false,
        message: 'Stock not found'
      });
    }

    // Get portfolio
    const portfolio = await Portfolio.findOne({ userId: req.user.id });
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    // Check if user has this stock
    const holdingIndex = portfolio.holdings.findIndex(
      h => h.symbol === stock.symbol
    );

    if (holdingIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'You do not own this stock'
      });
    }

    const holding = portfolio.holdings[holdingIndex];

    if (holding.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient quantity. You only have ${holding.quantity} shares`
      });
    }

    const totalAmount = stock.price * quantity;

    // Create sell order
    const order = await Order.create({
      userId: req.user.id,
      stockId: stock._id,
      symbol: stock.symbol,
      orderType: 'SELL',
      quantity,
      price: stock.price,
      totalAmount,
      status: 'COMPLETED'
    });

    // Update portfolio
    const soldInvestedAmount = (quantity / holding.quantity) * holding.totalInvested;

    if (holding.quantity === quantity) {
      // Remove holding entirely
      portfolio.holdings.splice(holdingIndex, 1);
    } else {
      // Update holding
      portfolio.holdings[holdingIndex].quantity -= quantity;
      portfolio.holdings[holdingIndex].totalInvested -= soldInvestedAmount;
      portfolio.holdings[holdingIndex].currentValue = 
        portfolio.holdings[holdingIndex].quantity * stock.price;
      portfolio.holdings[holdingIndex].profitLoss =
        portfolio.holdings[holdingIndex].currentValue - 
        portfolio.holdings[holdingIndex].totalInvested;
      portfolio.holdings[holdingIndex].profitLossPercent =
        (portfolio.holdings[holdingIndex].profitLoss / 
         portfolio.holdings[holdingIndex].totalInvested) * 100;
    }

    // Update portfolio totals
    portfolio.totalInvested -= soldInvestedAmount;
    portfolio.currentValue = portfolio.holdings.reduce(
      (sum, h) => sum + (h.currentValue || 0),
      0
    );
    portfolio.totalProfitLoss = portfolio.currentValue - portfolio.totalInvested;

    await portfolio.save();

    res.status(200).json({
      success: true,
      message: 'Stock sold successfully',
      order,
      portfolio
    });
  } catch (error) {
    console.error('Sell stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Error selling stock',
      error: error.message
    });
  }
};

// @desc    Get order history
// @route   GET /api/orders/history
// @access  Private
exports.getOrderHistory = async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;

    const orders = await Order.find({ userId: req.user.id })
      .populate('stockId', 'name sector')
      .sort({ executedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Order.countDocuments({ userId: req.user.id });

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      orders
    });
  } catch (error) {
    console.error('Get order history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order history',
      error: error.message
    });
  }
};
