#!/usr/bin/env python3
"""
Stock Price Fetcher and Predictor
This module fetches Indian stock prices and provides basic predictions.
No API key required when using yfinance library.
"""

import yfinance as yf
from datetime import datetime, timedelta
import pandas as pd


class StockPredictor:
    """Fetches stock data and makes simple predictions"""
    
    # Indian stock tickers
    STOCKS = {
        "Reliance Industries": "RELIANCE.NS",
        "HDFC Bank": "HDFCBANK.NS",
        "Tata Consultancy": "TCS.NS",
        "Infosys": "INFY.NS"
    }
    
    def get_stock_data(self, ticker, period="1mo"):
        """
        Fetch stock data for a given ticker
        
        Args:
            ticker: Stock ticker symbol (e.g., 'RELIANCE.NS')
            period: Time period for historical data (default: '1mo')
            
        Returns:
            dict: Stock information including current price and prediction
        """
        try:
            stock = yf.Ticker(ticker)
            
            # Get historical data
            hist = stock.history(period=period)
            
            if hist.empty:
                return {
                    "ticker": ticker,
                    "current_price": "N/A",
                    "predicted_gain_loss": "N/A",
                    "error": "No data available"
                }
            
            # Get current price (latest close price)
            current_price = hist['Close'].iloc[-1]
            
            # Simple prediction based on moving average
            # Calculate 10-day moving average
            if len(hist) >= 10:
                ma_10 = hist['Close'].tail(10).mean()
                predicted_change = ((ma_10 - current_price) / current_price) * 100
                predicted_value = current_price * (1 + predicted_change / 100)
            else:
                # Not enough data for prediction
                predicted_change = 0
                predicted_value = current_price
            
            return {
                "ticker": ticker,
                "current_price": f"₹{current_price:.2f}",
                "predicted_gain_loss": f"₹{predicted_value - current_price:.2f} ({predicted_change:.2f}%)",
                "prediction_value": f"₹{predicted_value:.2f}",
                "error": None
            }
            
        except Exception as e:
            return {
                "ticker": ticker,
                "current_price": "N/A",
                "predicted_gain_loss": "N/A",
                "error": str(e)
            }
    
    def get_all_stocks(self):
        """
        Fetch data for all configured stocks
        
        Returns:
            list: List of dictionaries containing stock information
        """
        results = []
        for name, ticker in self.STOCKS.items():
            data = self.get_stock_data(ticker)
            data["name"] = name
            results.append(data)
        return results
    
    def display_stocks(self):
        """Display stock information in a readable format"""
        stocks = self.get_all_stocks()
        
        for stock in stocks:
            print(f"\n{stock['name']} ({stock['ticker']})")
            print(f"Current Price: {stock['current_price']}")
            print(f"Predicted Gain/Loss: {stock['predicted_gain_loss']}")
            if stock['error']:
                print(f"Error: {stock['error']}")


def main():
    """Main function to demonstrate usage"""
    print("Fetching Indian Stock Prices...")
    print("=" * 60)
    
    predictor = StockPredictor()
    predictor.display_stocks()
    
    print("\n" + "=" * 60)
    print("\nNote: This uses yfinance library which is free and doesn't require an API key.")
    print("If you see 'N/A' values, it might be due to:")
    print("1. Network connectivity issues")
    print("2. Yahoo Finance service being temporarily unavailable")
    print("3. Invalid stock ticker symbol")
    print("\nTo fix 'invalid key' errors:")
    print("- yfinance doesn't require API keys for basic usage")
    print("- Make sure you have internet connectivity")
    print("- Install yfinance: pip install yfinance")


if __name__ == "__main__":
    main()
