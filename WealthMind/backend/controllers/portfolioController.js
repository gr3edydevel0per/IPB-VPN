const Portfolio = require('../models/Portfolio');
const Stock = require('../models/Stock');

// @desc    Get user portfolio
// @route   GET /api/portfolio
// @access  Private
exports.getPortfolio = async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({ userId: req.user.id })
      .populate('holdings.stockId');

    if (!portfolio) {
      // Create empty portfolio if doesn't exist
      portfolio = await Portfolio.create({
        userId: req.user.id,
        holdings: [],
        totalInvested: 0,
        currentValue: 0,
        totalProfitLoss: 0
      });
    }

    // Update current values for each holding
    for (let holding of portfolio.holdings) {
      if (holding.stockId) {
        const currentPrice = holding.stockId.price;
        holding.currentValue = holding.quantity * currentPrice;
        holding.profitLoss = holding.currentValue - holding.totalInvested;
        holding.profitLossPercent = holding.totalInvested > 0
          ? ((holding.profitLoss / holding.totalInvested) * 100).toFixed(2)
          : 0;
      }
    }

    // Calculate total portfolio values
    portfolio.currentValue = portfolio.holdings.reduce(
      (sum, holding) => sum + (holding.currentValue || 0),
      0
    );
    portfolio.totalProfitLoss = portfolio.currentValue - portfolio.totalInvested;
    portfolio.totalProfitLossPercent = portfolio.totalInvested > 0
      ? ((portfolio.totalProfitLoss / portfolio.totalInvested) * 100).toFixed(2)
      : 0;

    await portfolio.save();

    res.status(200).json({
      success: true,
      portfolio
    });
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching portfolio',
      error: error.message
    });
  }
};

// @desc    Get portfolio statistics
// @route   GET /api/portfolio/stats
// @access  Private
exports.getPortfolioStats = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user.id })
      .populate('holdings.stockId');

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    // Calculate sector allocation
    const sectorAllocation = {};
    portfolio.holdings.forEach(holding => {
      if (holding.stockId) {
        const sector = holding.stockId.sector;
        const value = holding.currentValue || 0;
        sectorAllocation[sector] = (sectorAllocation[sector] || 0) + value;
      }
    });

    // Calculate risk allocation
    const riskAllocation = {};
    portfolio.holdings.forEach(holding => {
      if (holding.stockId) {
        const risk = holding.stockId.riskLevel;
        const value = holding.currentValue || 0;
        riskAllocation[risk] = (riskAllocation[risk] || 0) + value;
      }
    });

    // Top gainers and losers
    const sortedHoldings = [...portfolio.holdings].sort(
      (a, b) => (b.profitLossPercent || 0) - (a.profitLossPercent || 0)
    );

    res.status(200).json({
      success: true,
      stats: {
        totalInvested: portfolio.totalInvested,
        currentValue: portfolio.currentValue,
        totalProfitLoss: portfolio.totalProfitLoss,
        totalProfitLossPercent: portfolio.totalProfitLossPercent,
        holdingsCount: portfolio.holdings.length,
        sectorAllocation,
        riskAllocation,
        topGainers: sortedHoldings.slice(0, 5),
        topLosers: sortedHoldings.slice(-5).reverse()
      }
    });
  } catch (error) {
    console.error('Get portfolio stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching portfolio stats',
      error: error.message
    });
  }
};
