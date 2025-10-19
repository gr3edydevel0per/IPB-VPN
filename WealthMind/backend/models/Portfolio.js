const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  holdings: [{
    stockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stock',
      required: true
    },
    symbol: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    avgBuyPrice: {
      type: Number,
      required: true,
      min: 0
    },
    totalInvested: {
      type: Number,
      required: true,
      min: 0
    },
    currentValue: {
      type: Number,
      default: 0
    },
    profitLoss: {
      type: Number,
      default: 0
    },
    profitLossPercent: {
      type: Number,
      default: 0
    }
  }],
  totalInvested: {
    type: Number,
    default: 0,
    min: 0
  },
  currentValue: {
    type: Number,
    default: 0,
    min: 0
  },
  totalProfitLoss: {
    type: Number,
    default: 0
  },
  totalProfitLossPercent: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster user portfolio lookups
PortfolioSchema.index({ userId: 1 });

module.exports = mongoose.model('Portfolio', PortfolioSchema);
