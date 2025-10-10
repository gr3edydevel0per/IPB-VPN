# Investment Platform - Usage Guide

## Quick Start

### 1. Running the Application

```bash
cd "StrixNet - SAA"
python run.py
```

The application will start on `http://127.0.0.1:5000`

### 2. Login
- Navigate to `http://127.0.0.1:5000`
- Enter your email and password
- Click "Sign In"

### 3. Using the Investment Dashboard

#### Step 1: Select Your Investment Preference
Choose one of three investment types:
- **Stocks**: For individual company shares
- **Mutual Funds**: For diversified portfolios
- **Bonds**: For fixed income securities

Click the "Select" button on your preferred investment type.

#### Step 2: Choose Your Investment Plan
Select a risk profile that matches your investment goals:

**Conservative** - Best for:
- Risk-averse investors
- Short-term goals
- Stable income needs
- Expected Return: 3-7%

**Moderate** - Best for:
- Balanced approach
- Medium-term goals
- Moderate risk tolerance
- Expected Return: 7-12%

**Aggressive** - Best for:
- High risk tolerance
- Long-term goals
- Maximum growth potential
- Expected Return: 12-20%

Click "Choose Plan" on your preferred risk profile.

#### Step 3: Review Recommendations
Once you've selected both a preference and a plan, personalized recommendations will automatically appear. Each recommendation includes:

- **Company/Fund Name**: The investment name
- **Type**: STOCKS, MUTUAL-FUNDS, or BONDS
- **Current Price**: Latest trading price
- **Price Change**: Percentage change (positive or negative)
- **Risk Level**: Low, Medium, or High
- **Expected Return**: Projected annual return percentage
- **Rating**: Star rating (1-5 stars)
- **Description**: Investment overview and sector information

#### Step 4: Take Action
- Review the detailed information for each recommendation
- Compare different options
- Click "Invest Now" to proceed with an investment (future feature)

## API Usage

### Get Recommendations

**Endpoint**: `POST /api/recommendations`

**Headers**:
```json
{
  "Content-Type": "application/json"
}
```

**Request Body**:
```json
{
  "preference": "stocks",
  "plan": "aggressive"
}
```

**Valid Values**:
- `preference`: "stocks", "mutual-funds", "bonds"
- `plan`: "conservative", "moderate", "aggressive"

**Response**:
```json
{
  "status": "success",
  "recommendations": [
    {
      "name": "Apple Inc.",
      "type": "stocks",
      "price": 178.50,
      "change": 5.2,
      "risk": "High",
      "expectedReturn": 15.3,
      "rating": 4,
      "description": "A high-risk investment opportunity with strong potential returns. This Technology sector stock has shown consistent growth."
    },
    ...
  ]
}
```

## Tips for Best Results

1. **Match Your Goals**: Choose a plan that aligns with your investment timeline and risk tolerance
2. **Diversify**: Consider selecting different preferences to build a balanced portfolio
3. **Review Regularly**: Investment recommendations are based on current market conditions
4. **Start Conservative**: If you're new to investing, start with the Conservative plan
5. **Research Further**: Use recommendations as a starting point for your own research

## Investment Plan Comparison

| Feature | Conservative | Moderate | Aggressive |
|---------|-------------|----------|------------|
| Risk Level | Low | Medium | High |
| Expected Return | 3-7% | 7-12% | 12-20% |
| Volatility | Minimal | Moderate | High |
| Best For | Income & Stability | Balanced Growth | Maximum Returns |
| Time Horizon | Short-term | Medium-term | Long-term |
| Stock Allocation | 10% | 40% | 70% |
| Bond Allocation | 60% | 20% | 5% |
| Fund Allocation | 30% | 40% | 25% |

## Troubleshooting

### Recommendations Not Showing
- Ensure you've selected both a preference AND a plan
- Check browser console for errors
- Verify you're logged in (check session)

### Login Issues
- Verify your credentials
- Check that the backend API is running
- Clear browser cache and cookies

### API Errors
- Check that the session token is valid
- Verify the request format matches the API specification
- Check server logs for detailed error messages

## Security Notes

- Always logout when finished using the platform
- Keep your login credentials secure
- Use HTTPS in production environments
- Investment recommendations are for informational purposes only
- Conduct your own research before making investment decisions

## Support

For issues or questions:
1. Check the [INVESTMENT_FEATURES.md](INVESTMENT_FEATURES.md) documentation
2. Review the code in `StrixNet - SAA/core/server.py`
3. Open an issue on GitHub

---

**Disclaimer**: This platform provides investment recommendations for educational and informational purposes only. It does not constitute financial advice. Always consult with a qualified financial advisor before making investment decisions.
