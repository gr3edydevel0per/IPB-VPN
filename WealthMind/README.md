# WealthMind - Investment Platform (Groww Clone)

A full-stack MERN (MongoDB, Express, React, Node.js) investment platform that replicates key features of the Groww app. Users can manage portfolios, trade stocks, and receive personalized investment recommendations.

## 🎯 Features

### Authentication & User Management
- ✅ User registration and login with JWT authentication
- ✅ Secure password hashing with bcrypt
- ✅ User profile management
- ✅ Investment preference settings (risk level, goals, investment horizon)

### Portfolio Management
- ✅ Real-time portfolio tracking
- ✅ View total invested amount, current value, and P&L
- ✅ Detailed holdings breakdown with performance metrics
- ✅ Sector and risk allocation visualization
- ✅ Order history tracking

### Stock Market
- ✅ Browse 50+ mock stocks across various sectors
- ✅ Advanced search and filtering (sector, risk level, market cap)
- ✅ Real-time stock prices and performance metrics
- ✅ Detailed stock information pages

### Trading
- ✅ Buy and sell stock functionality
- ✅ Real-time order execution
- ✅ Portfolio auto-updates after trades
- ✅ Transaction history

### Personalized Recommendations
- ✅ Smart recommendation engine based on user preferences
- ✅ Risk-based stock filtering
- ✅ Goal-aligned investment suggestions
- ✅ Volatility and return considerations

### Analytics & Visualization
- ✅ Interactive portfolio charts (using Recharts)
- ✅ Sector allocation pie charts
- ✅ Performance tracking graphs
- ✅ Top gainers and losers

## 🏗️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **React Icons** - Icon library

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📁 Project Structure

```
WealthMind/
├── backend/
│   ├── controllers/          # Request handlers
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── middleware/          # Auth & validation
│   ├── config/              # Configuration files
│   ├── server.js            # Entry point
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context
│   │   ├── utils/           # Helper functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── Dockerfile
├── database/
│   └── seed/
│       ├── mockStocks.json  # 50 stock seed data
│       └── seedData.js      # Database seeder script
├── docker-compose.yml
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v7.0 or higher)
- Docker & Docker Compose (optional)

### Installation

#### Option 1: Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WealthMind
   ```

2. **Build and start all services**
   ```bash
   docker-compose up --build
   ```

3. **Seed the database** (in a new terminal)
   ```bash
   docker exec -it wealthmind-backend npm run seed
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: mongodb://localhost:27017

#### Option 2: Manual Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WealthMind
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm start
   ```

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Seed the Database** (in a new terminal)
   ```bash
   cd backend
   npm run seed
   ```

## 🔐 Demo Credentials

After seeding, you can login with these demo accounts:

| Email | Password | Risk Profile |
|-------|----------|-------------|
| john@example.com | password123 | Medium Risk, Growth |
| jane@example.com | password123 | Low Risk, Income |
| mike@example.com | password123 | High Risk, Growth |

## 📡 API Documentation

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+91-9876543210"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### User Management

#### Get User Profile
```http
GET /api/user/profile
Authorization: Bearer <token>
```

#### Get User Preferences
```http
GET /api/user/preferences
Authorization: Bearer <token>
```

#### Update User Preferences
```http
POST /api/user/preferences
Authorization: Bearer <token>
Content-Type: application/json

{
  "riskLevel": "Medium",
  "goal": "Growth",
  "investmentHorizon": "Long"
}
```

### Market Data

#### Get All Stocks
```http
GET /api/market?sector=IT&riskLevel=Medium&marketCap=Large Cap
```

#### Get Stock by Symbol
```http
GET /api/market/TCS
```

#### Search Stocks
```http
GET /api/market/search/tata
```

### Portfolio

#### Get User Portfolio
```http
GET /api/portfolio
Authorization: Bearer <token>
```

#### Get Portfolio Statistics
```http
GET /api/portfolio/stats
Authorization: Bearer <token>
```

### Trading

#### Buy Stock
```http
POST /api/orders/buy
Authorization: Bearer <token>
Content-Type: application/json

{
  "symbol": "TCS",
  "quantity": 10
}
```

#### Sell Stock
```http
POST /api/orders/sell
Authorization: Bearer <token>
Content-Type: application/json

{
  "symbol": "TCS",
  "quantity": 5
}
```

#### Get Order History
```http
GET /api/orders/history?limit=20&page=1
Authorization: Bearer <token>
```

### Recommendations

#### Get Personalized Recommendations
```http
GET /api/recommendations/:userId
Authorization: Bearer <token>
```

## 🎨 Features Breakdown

### 1. Smart Recommendation Engine

The recommendation system uses a rule-based algorithm that considers:
- User's risk tolerance (Low/Medium/High)
- Investment goals (Income/Growth/Balanced)
- Investment horizon (Short/Medium/Long)
- Stock characteristics (volatility, returns, dividend yield)

**Logic:**
- Low Risk → Large cap, FMCG, Banking stocks
- High Risk → Small cap, Tech, Pharma stocks
- Income Goal → Stocks with dividend yield > 2%
- Growth Goal → Stocks with avg return > 12%

### 2. Real-time Portfolio Tracking

- Auto-calculates current value based on live prices
- Tracks profit/loss for each holding
- Updates total portfolio metrics
- Shows performance percentage

### 3. Advanced Filtering

Market page supports multiple filters:
- Sector (IT, Banking, FMCG, etc.)
- Risk Level (Low, Medium, High)
- Market Cap (Large Cap, Mid Cap, Small Cap)
- Search by name or symbol

### 4. Responsive Design

- Mobile-first approach with Tailwind CSS
- Adaptive layouts for all screen sizes
- Touch-friendly interfaces
- Bottom navigation for mobile

## 🧪 Testing

Run backend tests:
```bash
cd backend
npm test
```

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/wealthmind
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🗄️ Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  preferences: {
    riskLevel: "Low" | "Medium" | "High",
    goal: "Income" | "Growth" | "Balanced",
    investmentHorizon: "Short" | "Medium" | "Long"
  },
  createdAt: Date
}
```

### Stock
```javascript
{
  symbol: String (unique),
  name: String,
  sector: String,
  price: Number,
  changePercent: Number,
  volatility: Number,
  avgReturn: Number,
  riskLevel: "Low" | "Medium" | "High",
  dividendYield: Number,
  marketCap: "Large Cap" | "Mid Cap" | "Small Cap",
  pe_ratio: Number,
  description: String
}
```

### Portfolio
```javascript
{
  userId: ObjectId,
  holdings: [{
    stockId: ObjectId,
    symbol: String,
    quantity: Number,
    avgBuyPrice: Number,
    totalInvested: Number,
    currentValue: Number,
    profitLoss: Number,
    profitLossPercent: Number
  }],
  totalInvested: Number,
  currentValue: Number,
  totalProfitLoss: Number,
  totalProfitLossPercent: Number
}
```

### Order
```javascript
{
  userId: ObjectId,
  stockId: ObjectId,
  symbol: String,
  orderType: "BUY" | "SELL",
  quantity: Number,
  price: Number,
  totalAmount: Number,
  status: "PENDING" | "COMPLETED" | "FAILED",
  executedAt: Date
}
```

## 🐳 Docker Commands

```bash
# Build and start services
docker-compose up --build

# Start services in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Seed database
docker exec -it wealthmind-backend npm run seed

# Access MongoDB shell
docker exec -it wealthmind-mongodb mongosh
```

## 📝 Development Workflow

1. Make code changes
2. Backend auto-reloads with nodemon (in dev mode)
3. Frontend hot-reloads with Vite
4. Test changes in browser
5. Run linter: `npm run lint`
6. Commit changes

## 🚢 Deployment

### Production Build

1. **Build frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy with Docker**
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

3. **Environment Variables**
   - Update `.env` files with production values
   - Change JWT_SECRET to a secure random string
   - Update CORS_ORIGIN to your domain

## 📊 Mock Data

The application includes 50 carefully curated stocks across various sectors:
- IT (TCS, Infosys, Wipro, HCL Tech, Tech Mahindra)
- Banking (HDFC Bank, ICICI Bank, Axis Bank, SBI)
- FMCG (HUL, ITC, Nestle, Britannia)
- Automobile (Tata Motors, Maruti, M&M, Hero, Eicher)
- Pharma (Sun Pharma, Dr. Reddy's, Cipla, Divi's Lab)
- And many more...

Each stock includes:
- Symbol, Name, Sector
- Current Price & Change %
- Volatility & Avg Return
- Risk Level & Market Cap
- P/E Ratio & Dividend Yield

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Initial development as part of a full-stack MERN project

## 🙏 Acknowledgments

- Inspired by Groww investment platform
- Stock data is fictional and for demonstration purposes only
- Not financial advice - educational project only

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check existing documentation
- Review API documentation above

---

**Note:** This is a demo application for educational purposes. Do not use for actual investment decisions. All stock data is fictional.
