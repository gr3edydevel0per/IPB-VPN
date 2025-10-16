#!/usr/bin/env python3
"""
Stock Price Fetcher Demo (with mock data)
This demonstrates how the stock predictor works with sample data
when internet is not available.
"""


class StockPredictorDemo:
    """Demo version with mock data"""
    
    # Mock stock data (example values)
    MOCK_DATA = {
        "RELIANCE.NS": {
            "name": "Reliance Industries",
            "current_price": 2456.30,
            "predicted_change": 0.51
        },
        "HDFCBANK.NS": {
            "name": "HDFC Bank",
            "current_price": 1678.90,
            "predicted_change": -0.49
        },
        "TCS.NS": {
            "name": "Tata Consultancy",
            "current_price": 3567.80,
            "predicted_change": 0.72
        },
        "INFY.NS": {
            "name": "Infosys",
            "current_price": 1432.50,
            "predicted_change": 1.07
        }
    }
    
    def get_stock_data(self, ticker):
        """
        Get mock stock data for demonstration
        
        Args:
            ticker: Stock ticker symbol (e.g., 'RELIANCE.NS')
            
        Returns:
            dict: Stock information including current price and prediction
        """
        if ticker not in self.MOCK_DATA:
            return {
                "ticker": ticker,
                "current_price": "N/A",
                "predicted_gain_loss": "N/A",
                "error": "Ticker not found in mock data"
            }
        
        data = self.MOCK_DATA[ticker]
        current_price = data["current_price"]
        predicted_change = data["predicted_change"]
        predicted_value = current_price * (1 + predicted_change / 100)
        gain_loss = predicted_value - current_price
        
        return {
            "ticker": ticker,
            "name": data["name"],
            "current_price": f"₹{current_price:.2f}",
            "predicted_gain_loss": f"₹{gain_loss:.2f} ({predicted_change:.2f}%)",
            "prediction_value": f"₹{predicted_value:.2f}",
            "error": None
        }
    
    def get_all_stocks(self):
        """
        Fetch data for all configured stocks
        
        Returns:
            list: List of dictionaries containing stock information
        """
        results = []
        for ticker in self.MOCK_DATA.keys():
            data = self.get_stock_data(ticker)
            results.append(data)
        return results
    
    def display_stocks(self):
        """Display stock information in a readable format"""
        stocks = self.get_all_stocks()
        
        for stock in stocks:
            print(f"\n{stock['name']} ({stock['ticker']})")
            print(f"Current Price: {stock['current_price']}")
            print(f"Predicted Gain/Loss: {stock['predicted_gain_loss']}")
            if stock.get('prediction_value'):
                print(f"Predicted Price: {stock['prediction_value']}")
            if stock['error']:
                print(f"Error: {stock['error']}")


def main():
    """Main function to demonstrate usage"""
    print("Stock Predictor Demo (with mock data)")
    print("=" * 60)
    print("\nThis demo shows how the stock predictor works.")
    print("In production, it fetches real data from Yahoo Finance.")
    print("=" * 60)
    
    predictor = StockPredictorDemo()
    predictor.display_stocks()
    
    print("\n" + "=" * 60)
    print("\nKey Points:")
    print("✅ No API key required when using yfinance")
    print("✅ Real-time stock prices from Yahoo Finance")
    print("✅ Works with Indian stocks (NSE)")
    print("✅ Simple prediction based on moving averages")
    print("\nPrevious Error 'invalid key option' was likely caused by:")
    print("❌ Using an API that requires authentication")
    print("❌ Missing or incorrect API key configuration")
    print("❌ Using wrong library or endpoint")
    print("\n✅ FIXED: Now using yfinance (no API key needed)")


if __name__ == "__main__":
    main()
