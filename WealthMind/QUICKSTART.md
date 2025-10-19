# WealthMind Application - Quick Start Guide

## Overview
WealthMind is a complete full-stack investment platform built with MERN stack (MongoDB, Express, React, Node.js). This application replicates key features of the Groww investment platform.

## Project Structure
```
WealthMind/
├── backend/          # Node.js + Express API
├── frontend/         # React + Tailwind CSS UI
├── database/         # Seed data (50 stocks)
└── docker-compose.yml
```

## Quick Start with Docker

### 1. Start all services
```bash
cd WealthMind
docker compose up --build
```

This will start:
- MongoDB on port 27017
- Backend API on port 5000
- Frontend on port 3000

### 2. Seed the database (in a new terminal)
```bash
docker exec -it wealthmind-backend npm run seed
```

### 3. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

### 4. Login with demo credentials
- Email: john@example.com
- Password: password123

## Manual Setup (Without Docker)

### Prerequisites
- Node.js v18+
- MongoDB v7+

### 1. Install MongoDB
```bash
# On Ubuntu/Debian
sudo apt-get install mongodb-org

# On macOS
brew install mongodb-community

# Start MongoDB
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

### 2. Setup Backend
```bash
cd WealthMind/backend
npm install
npm run seed  # Seed the database
npm start     # Start backend on port 5000
```

### 3. Setup Frontend (in new terminal)
```bash
cd WealthMind/frontend
npm install
npm run dev   # Start frontend on port 3000
```

## Testing the Application

### 1. Register a new user
- Go to http://localhost:3000/register
- Fill in the registration form
- You'll be logged in automatically

### 2. Explore Features
- **Dashboard**: View portfolio summary and recommendations
- **Market**: Browse and search 50 stocks
- **Stock Detail**: View detailed stock information
- **Buy/Sell**: Execute trades
- **Portfolio**: Track your holdings and P&L
- **Profile**: Set investment preferences

### 3. API Testing
```bash
# Health check
curl http://localhost:5000/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get stocks
curl http://localhost:5000/api/market
```

## Key Features Implemented

✅ **Authentication**
- User registration with JWT
- Secure login with bcrypt
- Protected routes

✅ **Portfolio Management**
- Real-time portfolio tracking
- Holdings with P&L calculation
- Transaction history

✅ **Stock Market**
- 50 stocks across multiple sectors
- Advanced search and filtering
- Real-time prices

✅ **Trading**
- Buy/sell functionality
- Portfolio auto-updates
- Order history

✅ **Recommendations**
- Smart algorithm based on user preferences
- Risk-based filtering
- Goal-aligned suggestions

✅ **Visualizations**
- Portfolio allocation charts
- Sector distribution
- Performance graphs

## Architecture

### Backend (Port 5000)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Auth**: JWT + bcrypt
- **API**: RESTful endpoints

### Frontend (Port 3000)
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State**: Context API
- **Charts**: Recharts

### Database
- **MongoDB**: Document-based storage
- **Collections**: Users, Stocks, Portfolios, Orders
- **Seeding**: 50 stocks + 3 demo users

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user

### User
- GET /api/user/profile - Get user profile
- GET /api/user/preferences - Get preferences
- POST /api/user/preferences - Update preferences

### Market
- GET /api/market - Get all stocks (with filters)
- GET /api/market/:symbol - Get stock by symbol
- GET /api/market/search/:query - Search stocks

### Portfolio
- GET /api/portfolio - Get user portfolio
- GET /api/portfolio/stats - Get portfolio stats

### Orders
- POST /api/orders/buy - Buy stock
- POST /api/orders/sell - Sell stock
- GET /api/orders/history - Get order history

### Recommendations
- GET /api/recommendations/:userId - Get personalized recommendations

## Demo Users

After seeding, these accounts are available:

| Email | Password | Risk | Goal | Horizon |
|-------|----------|------|------|---------|
| john@example.com | password123 | Medium | Growth | Long |
| jane@example.com | password123 | Low | Income | Medium |
| mike@example.com | password123 | High | Growth | Short |

## Troubleshooting

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### MongoDB connection error
```bash
# Check if MongoDB is running
sudo systemctl status mongod  # Linux
brew services list            # macOS

# Check connection
mongosh mongodb://localhost:27017
```

### Docker issues
```bash
# Stop all containers
docker compose down

# Remove volumes and restart
docker compose down -v
docker compose up --build
```

## Development Tips

### Hot Reload
- Backend: Uses nodemon (auto-restart on code changes)
- Frontend: Vite provides instant HMR

### Debugging
- Backend logs: Check terminal running backend
- Frontend: Use browser DevTools console
- MongoDB: Use MongoDB Compass or mongosh

### Code Quality
```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

## Production Deployment

### Environment Variables
Update these before deploying:
- `JWT_SECRET` - Use a strong random string
- `MONGODB_URI` - Production MongoDB URL
- `CORS_ORIGIN` - Your frontend domain

### Build Frontend
```bash
cd frontend
npm run build
# Output in dist/ directory
```

### Docker Production
```bash
docker compose -f docker-compose.yml up -d
```

## Project Highlights

🎯 **Complete MERN Stack Implementation**
- Modern React with hooks
- Express REST API
- MongoDB with Mongoose ODM
- JWT authentication

🎨 **Beautiful UI/UX**
- Responsive design with Tailwind CSS
- Smooth animations and transitions
- Mobile-friendly interface
- Intuitive navigation

🧠 **Smart Features**
- Personalized recommendations
- Real-time portfolio tracking
- Advanced filtering and search
- Interactive charts

🐳 **DevOps Ready**
- Docker containerization
- Docker Compose orchestration
- Easy deployment
- Scalable architecture

## Next Steps

1. ✅ Complete basic setup
2. ✅ Test all features
3. 🔄 Add more stocks
4. 🔄 Implement SIP functionality
5. 🔄 Add price alerts
6. 🔄 Create admin panel
7. 🔄 Add more chart types
8. 🔄 Implement real-time updates

## Support

For issues or questions:
- Check the main README.md
- Review API documentation
- Test with demo accounts
- Check Docker logs

---

**Remember**: This is a demo application for educational purposes. All stock data is fictional.
