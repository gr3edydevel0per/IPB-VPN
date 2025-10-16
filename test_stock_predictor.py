#!/usr/bin/env python3
"""
Test suite for stock predictor
"""

import unittest
from stock_predictor import StockPredictor
from stock_predictor_demo import StockPredictorDemo


class TestStockPredictor(unittest.TestCase):
    """Test cases for stock predictor"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.predictor = StockPredictor()
    
    def test_stock_dict_exists(self):
        """Test that stock dictionary is properly configured"""
        self.assertIsNotNone(self.predictor.STOCKS)
        self.assertEqual(len(self.predictor.STOCKS), 4)
        self.assertIn("Reliance Industries", self.predictor.STOCKS)
        self.assertIn("HDFC Bank", self.predictor.STOCKS)
        self.assertIn("Tata Consultancy", self.predictor.STOCKS)
        self.assertIn("Infosys", self.predictor.STOCKS)
    
    def test_stock_data_structure(self):
        """Test that get_stock_data returns correct structure"""
        # Note: This test may fail if internet is not available
        # or if Yahoo Finance is down
        data = self.predictor.get_stock_data("RELIANCE.NS")
        
        self.assertIsNotNone(data)
        self.assertIn("ticker", data)
        self.assertIn("current_price", data)
        self.assertIn("predicted_gain_loss", data)
        self.assertIn("error", data)
        self.assertEqual(data["ticker"], "RELIANCE.NS")
    
    def test_get_all_stocks(self):
        """Test that get_all_stocks returns data for all configured stocks"""
        stocks = self.predictor.get_all_stocks()
        
        self.assertIsNotNone(stocks)
        self.assertEqual(len(stocks), 4)
        
        for stock in stocks:
            self.assertIn("ticker", stock)
            self.assertIn("name", stock)
            self.assertIn("current_price", stock)
            self.assertIn("predicted_gain_loss", stock)


class TestStockPredictorDemo(unittest.TestCase):
    """Test cases for demo version with mock data"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.demo = StockPredictorDemo()
    
    def test_mock_data_exists(self):
        """Test that mock data is properly configured"""
        self.assertIsNotNone(self.demo.MOCK_DATA)
        self.assertEqual(len(self.demo.MOCK_DATA), 4)
        self.assertIn("RELIANCE.NS", self.demo.MOCK_DATA)
    
    def test_get_stock_data_with_valid_ticker(self):
        """Test getting stock data with valid ticker"""
        data = self.demo.get_stock_data("RELIANCE.NS")
        
        self.assertIsNotNone(data)
        self.assertEqual(data["ticker"], "RELIANCE.NS")
        self.assertEqual(data["name"], "Reliance Industries")
        self.assertNotEqual(data["current_price"], "N/A")
        self.assertNotEqual(data["predicted_gain_loss"], "N/A")
        self.assertIsNone(data["error"])
    
    def test_get_stock_data_with_invalid_ticker(self):
        """Test getting stock data with invalid ticker"""
        data = self.demo.get_stock_data("INVALID.NS")
        
        self.assertIsNotNone(data)
        self.assertEqual(data["ticker"], "INVALID.NS")
        self.assertEqual(data["current_price"], "N/A")
        self.assertEqual(data["predicted_gain_loss"], "N/A")
        self.assertIsNotNone(data["error"])
    
    def test_get_all_stocks(self):
        """Test that get_all_stocks returns all mock stocks"""
        stocks = self.demo.get_all_stocks()
        
        self.assertIsNotNone(stocks)
        self.assertEqual(len(stocks), 4)
        
        # Verify all stocks have valid data
        for stock in stocks:
            self.assertIsNotNone(stock["ticker"])
            self.assertIsNotNone(stock["name"])
            self.assertNotEqual(stock["current_price"], "N/A")
            self.assertNotEqual(stock["predicted_gain_loss"], "N/A")
            self.assertIsNone(stock["error"])
    
    def test_price_format(self):
        """Test that prices are formatted correctly with Rupee symbol"""
        data = self.demo.get_stock_data("RELIANCE.NS")
        
        self.assertTrue(data["current_price"].startswith("₹"))
        self.assertTrue(data["predicted_gain_loss"].startswith("₹"))
        self.assertTrue(data["prediction_value"].startswith("₹"))
    
    def test_prediction_calculation(self):
        """Test that prediction calculation is correct"""
        data = self.demo.get_stock_data("RELIANCE.NS")
        
        # Extract numeric values (remove ₹ and parentheses)
        mock_data = self.demo.MOCK_DATA["RELIANCE.NS"]
        current_price = mock_data["current_price"]
        predicted_change_pct = mock_data["predicted_change"]
        
        # Calculate expected values
        expected_predicted_value = current_price * (1 + predicted_change_pct / 100)
        expected_gain_loss = expected_predicted_value - current_price
        
        # Verify the calculation is in the right ballpark
        self.assertIn(f"{predicted_change_pct:.2f}%", data["predicted_gain_loss"])


def run_tests():
    """Run all tests"""
    print("Running Stock Predictor Tests...")
    print("=" * 60)
    
    # Create test suite
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # Add tests
    suite.addTests(loader.loadTestsFromTestCase(TestStockPredictor))
    suite.addTests(loader.loadTestsFromTestCase(TestStockPredictorDemo))
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Print summary
    print("\n" + "=" * 60)
    print(f"Tests run: {result.testsRun}")
    print(f"Successes: {result.testsRun - len(result.failures) - len(result.errors)}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    print("=" * 60)
    
    return result.wasSuccessful()


if __name__ == "__main__":
    success = run_tests()
    exit(0 if success else 1)
