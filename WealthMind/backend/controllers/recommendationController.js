const Stock = require('../models/Stock');
const User = require('../models/User');

// @desc    Get personalized stock recommendations
// @route   GET /api/recommendations/:userId
// @access  Private
exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Verify user making request matches userId or is admin
    if (req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access recommendations for this user'
      });
    }

    // Get user preferences
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { riskLevel, goal, investmentHorizon } = user.preferences;

    // Build recommendation query based on user preferences
    const query = {};

    // Match risk level
    if (riskLevel) {
      query.riskLevel = riskLevel;
    }

    // Match goal
    if (goal === 'Income') {
      // Prefer stocks with higher dividend yield
      query.dividendYield = { $gte: 2 };
    } else if (goal === 'Growth') {
      // Prefer stocks with higher returns
      query.avgReturn = { $gte: 12 };
    }

    // Investment horizon affects market cap preference
    if (investmentHorizon === 'Short') {
      query.marketCap = { $in: ['Large Cap', 'Mid Cap'] };
    } else if (investmentHorizon === 'Long') {
      // Long term investors can consider all market caps
      query.marketCap = { $in: ['Large Cap', 'Mid Cap', 'Small Cap'] };
    }

    // Get recommended stocks
    let recommendations = await Stock.find(query).limit(10);

    // If not enough stocks found, broaden the search
    if (recommendations.length < 5) {
      recommendations = await Stock.find({ riskLevel })
        .sort({ avgReturn: -1 })
        .limit(10);
    }

    // Calculate recommendation score for each stock
    recommendations = recommendations.map(stock => {
      let score = 50; // Base score

      // Score based on risk match
      if (stock.riskLevel === riskLevel) score += 20;

      // Score based on goal
      if (goal === 'Income' && stock.dividendYield >= 2) score += 15;
      if (goal === 'Growth' && stock.avgReturn >= 12) score += 15;
      if (goal === 'Balanced' && stock.avgReturn >= 8 && stock.avgReturn <= 15) score += 15;

      // Score based on volatility
      if (stock.volatility < 15) score += 10;
      else if (stock.volatility < 25) score += 5;

      // Score based on returns
      if (stock.avgReturn > 15) score += 10;
      else if (stock.avgReturn > 10) score += 5;

      return {
        ...stock.toObject(),
        recommendationScore: score,
        reason: generateRecommendationReason(stock, user.preferences)
      };
    });

    // Sort by recommendation score
    recommendations.sort((a, b) => b.recommendationScore - a.recommendationScore);

    // Return top 5-10 recommendations
    const topRecommendations = recommendations.slice(0, 8);

    res.status(200).json({
      success: true,
      count: topRecommendations.length,
      userPreferences: user.preferences,
      recommendations: topRecommendations
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recommendations',
      error: error.message
    });
  }
};

// Helper function to generate recommendation reason
function generateRecommendationReason(stock, preferences) {
  const reasons = [];

  if (stock.riskLevel === preferences.riskLevel) {
    reasons.push(`Matches your ${preferences.riskLevel.toLowerCase()} risk tolerance`);
  }

  if (preferences.goal === 'Income' && stock.dividendYield >= 2) {
    reasons.push(`Strong dividend yield of ${stock.dividendYield.toFixed(2)}%`);
  }

  if (preferences.goal === 'Growth' && stock.avgReturn >= 12) {
    reasons.push(`High average return of ${stock.avgReturn.toFixed(2)}%`);
  }

  if (stock.volatility < 15) {
    reasons.push('Low volatility for stable returns');
  }

  if (stock.sector === 'IT' || stock.sector === 'Technology') {
    reasons.push('Growth sector with strong fundamentals');
  }

  if (stock.marketCap === 'Large Cap') {
    reasons.push('Established large-cap company');
  }

  return reasons.join('. ') || 'Good investment opportunity based on market trends';
}
