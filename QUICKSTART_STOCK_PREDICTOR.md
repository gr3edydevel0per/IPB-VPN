# Quick Start Guide: Stock Predictor

## The Problem You Had

Your output was showing:
```
Reliance Industries (RELIANCE.NS)
Current Price: ₹N/A
Predicted Gain/Loss: ₹

HDFC Bank (HDFCBANK.NS)
Current Price: ₹N/A
Predicted Gain/Loss: ₹
```

With an **"invalid key option"** error.

## Why This Happened

The error occurred because:
1. You were likely using an API that requires an API key
2. The API key was either missing, incorrect, or improperly configured
3. The API endpoint wasn't properly set up

## The Solution

We've created a stock predictor that uses **yfinance** library which:
- ✅ **Doesn't require any API key**
- ✅ **Free to use**
- ✅ **Works with Indian stocks**

## Quick Setup (3 steps)

### Step 1: Install Dependencies
```bash
pip install -r requirements-stock.txt
```

### Step 2: Run the Demo (to see expected output)
```bash
python stock_predictor_demo.py
```

### Step 3: Run the Real Predictor (requires internet)
```bash
python stock_predictor.py
```

## Expected Output

```
Stock Predictor Demo (with mock data)
============================================================

Reliance Industries (RELIANCE.NS)
Current Price: ₹2456.30
Predicted Gain/Loss: ₹12.53 (0.51%)
Predicted Price: ₹2468.83

HDFC Bank (HDFCBANK.NS)
Current Price: ₹1678.90
Predicted Gain/Loss: ₹-8.23 (-0.49%)
Predicted Price: ₹1670.67
```

## Using in Your Code

```python
from stock_predictor import StockPredictor

# Initialize predictor
predictor = StockPredictor()

# Get all stocks
stocks = predictor.get_all_stocks()
for stock in stocks:
    print(f"{stock['name']}: {stock['current_price']}")

# Or get a specific stock
reliance = predictor.get_stock_data("RELIANCE.NS")
print(f"Current Price: {reliance['current_price']}")
print(f"Prediction: {reliance['predicted_gain_loss']}")
```

## Troubleshooting

### Still seeing N/A?
- Check your internet connection
- Make sure yfinance is installed: `pip list | grep yfinance`
- Try running the demo first: `python stock_predictor_demo.py`

### Want to use a different API?
- See `.env.example` for configuration options
- Read `STOCK_PREDICTOR_README.md` for alternatives

## Files Created

1. **stock_predictor.py** - Main implementation (uses yfinance)
2. **stock_predictor_demo.py** - Demo with mock data
3. **requirements-stock.txt** - Python dependencies
4. **STOCK_PREDICTOR_README.md** - Detailed documentation
5. **.env.example** - Example configuration for alternative APIs

## Next Steps

- Run the demo to verify everything works
- Integrate into your application
- Customize the stock list in `stock_predictor.py`
- Add more sophisticated prediction algorithms if needed

## Support

For more details, see `STOCK_PREDICTOR_README.md`
