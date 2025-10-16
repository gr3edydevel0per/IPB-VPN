# Stock Predictor - Fixing "Invalid Key" Error

## Problem
You were seeing output like:
```
Reliance Industries (RELIANCE.NS)
Current Price: ₹N/A
Predicted Gain/Loss: ₹

HDFC Bank (HDFCBANK.NS)
Current Price: ₹N/A
Predicted Gain/Loss: ₹
```

And getting "invalid key option" errors.

## Solution

The issue was likely caused by:
1. **Using an API that requires a key** - Many financial APIs require API keys
2. **Missing or incorrect API key configuration**
3. **Using the wrong library or method**

## Fix Implemented

This solution uses **yfinance** library which:
- ✅ **No API key required** - Free to use for basic stock data
- ✅ Works with Indian stocks (NSE)
- ✅ Provides real-time price data
- ✅ Simple to implement

## Installation

1. Install required dependencies:
```bash
pip install -r requirements-stock.txt
```

Or install manually:
```bash
pip install yfinance pandas numpy
```

## Usage

Run the stock predictor:
```bash
python stock_predictor.py
```

## Example Output

```
Fetching Indian Stock Prices...
============================================================

Reliance Industries (RELIANCE.NS)
Current Price: ₹2,456.30
Predicted Gain/Loss: ₹12.45 (0.51%)

HDFC Bank (HDFCBANK.NS)
Current Price: ₹1,678.90
Predicted Gain/Loss: ₹-8.23 (-0.49%)

Tata Consultancy (TCS.NS)
Current Price: ₹3,567.80
Predicted Gain/Loss: ₹25.67 (0.72%)

Infosys (INFY.NS)
Current Price: ₹1,432.50
Predicted Gain/Loss: ₹15.30 (1.07%)
============================================================
```

## Integration into Your Application

You can integrate this into your existing application:

```python
from stock_predictor import StockPredictor

# Create predictor instance
predictor = StockPredictor()

# Get all stocks
stocks = predictor.get_all_stocks()

# Or get individual stock
reliance = predictor.get_stock_data("RELIANCE.NS")
print(f"Reliance current price: {reliance['current_price']}")
```

## Troubleshooting

### Still seeing N/A values?

1. **Check internet connection**
   ```bash
   ping finance.yahoo.com
   ```

2. **Verify yfinance is installed**
   ```bash
   pip list | grep yfinance
   ```

3. **Test with a simple script**
   ```python
   import yfinance as yf
   stock = yf.Ticker("RELIANCE.NS")
   print(stock.history(period="1d"))
   ```

### Alternative: Using Alpha Vantage (Requires API Key)

If you need more advanced features, you can use Alpha Vantage:

1. Get free API key from: https://www.alphavantage.co/support/#api-key
2. Install library: `pip install alpha-vantage`
3. Use with API key:
   ```python
   from alpha_vantage.timeseries import TimeSeries
   ts = TimeSeries(key='YOUR_API_KEY', output_format='pandas')
   data, meta_data = ts.get_quote_endpoint(symbol='RELIANCE.NS')
   ```

## Notes

- **yfinance** is free and doesn't require an API key
- Data is fetched from Yahoo Finance
- Predictions are simple moving average based
- For production use, consider more sophisticated prediction models
- Always validate data before making financial decisions
