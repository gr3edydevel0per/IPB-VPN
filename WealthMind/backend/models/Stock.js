const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  sector: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  changePercent: {
    type: Number,
    default: 0
  },
  volatility: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  avgReturn: {
    type: Number,
    required: true
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
  },
  dividendYield: {
    type: Number,
    default: 0,
    min: 0
  },
  marketCap: {
    type: String,
    enum: ['Large Cap', 'Mid Cap', 'Small Cap'],
    required: true
  },
  pe_ratio: {
    type: Number,
    min: 0
  },
  description: {
    type: String,
    default: ''
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster searches
StockSchema.index({ symbol: 1 });
StockSchema.index({ sector: 1 });
StockSchema.index({ riskLevel: 1 });

module.exports = mongoose.model('Stock', StockSchema);
