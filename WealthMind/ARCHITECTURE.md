# WealthMind - Project Architecture & Design

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         React 18 Frontend (Vite + Tailwind)          │   │
│  │  ┌──────────┬──────────┬──────────┬──────────────┐  │   │
│  │  │ Login/   │Dashboard │  Market  │  Portfolio   │  │   │
│  │  │ Register │          │          │              │  │   │
│  │  └──────────┴──────────┴──────────┴──────────────┘  │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │     Context API (Auth, State Management)     │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ REST API (HTTP/HTTPS)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          Node.js + Express REST API                  │   │
│  │  ┌────────────┬────────────┬────────────┬────────┐  │   │
│  │  │   Auth     │   Market   │ Portfolio  │ Orders │  │   │
│  │  │ Controller │ Controller │ Controller │ Ctrl   │  │   │
│  │  └────────────┴────────────┴────────────┴────────┘  │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │        Recommendation Engine                 │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │      JWT Auth Middleware                     │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Mongoose ODM
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        DATA LAYER                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    MongoDB                           │   │
│  │  ┌─────────┬──────────┬────────────┬──────────────┐ │   │
│  │  │  Users  │  Stocks  │ Portfolios │    Orders    │ │   │
│  │  └─────────┴──────────┴────────────┴──────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend Stack
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.0
- **Styling**: Tailwind CSS 3.3.5
- **Routing**: React Router DOM 6.18.0
- **HTTP Client**: Axios 1.6.0
- **Charts**: Recharts 2.10.1
- **Icons**: React Icons 4.11.0
- **State Management**: Context API

### Backend Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18.2
- **Database ODM**: Mongoose 7.6.3
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Password Hashing**: bcryptjs 2.4.3
- **CORS**: cors 2.8.5
- **Environment**: dotenv 16.3.1
- **Validation**: express-validator 7.0.1

### Database
- **Database**: MongoDB 7.0
- **Collections**: 4 (Users, Stocks, Portfolios, Orders)
- **Indexes**: Symbol, UserId, Sector, Risk Level

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Services**: 3 (Frontend, Backend, MongoDB)

## Data Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (hashed with bcrypt),
  phone: String,
  preferences: {
    riskLevel: "Low" | "Medium" | "High",
    goal: "Income" | "Growth" | "Balanced",
    investmentHorizon: "Short" | "Medium" | "Long"
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: email (unique)

### Stock Model
```javascript
{
  _id: ObjectId,
  symbol: String (unique, uppercase, indexed),
  name: String,
  sector: String (indexed),
  price: Number,
  changePercent: Number,
  volatility: Number,
  avgReturn: Number,
  riskLevel: "Low" | "Medium" | "High" (indexed),
  dividendYield: Number,
  marketCap: "Large Cap" | "Mid Cap" | "Small Cap",
  pe_ratio: Number,
  description: String,
  lastUpdated: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: symbol (unique), sector, riskLevel

### Portfolio Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, indexed),
  holdings: [{
    stockId: ObjectId (ref: Stock),
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
  totalProfitLossPercent: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: userId

### Order Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, indexed),
  stockId: ObjectId (ref: Stock),
  symbol: String (indexed),
  orderType: "BUY" | "SELL",
  quantity: Number,
  price: Number,
  totalAmount: Number,
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED",
  executedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: userId + executedAt (compound), symbol

## API Architecture

### RESTful API Design

Base URL: `http://localhost:5000/api`

#### Endpoint Structure
```
/api
├── /auth
│   ├── POST /register
│   └── POST /login
├── /user
│   ├── GET /profile
│   ├── GET /preferences
│   └── POST /preferences
├── /market
│   ├── GET /
│   ├── GET /:symbol
│   └── GET /search/:query
├── /portfolio
│   ├── GET /
│   └── GET /stats
├── /orders
│   ├── POST /buy
│   ├── POST /sell
│   └── GET /history
└── /recommendations
    └── GET /:userId
```

### Authentication Flow

```
User → Login/Register → Backend validates
                            ↓
                    Generate JWT Token
                            ↓
                    Return token to client
                            ↓
                Client stores in localStorage
                            ↓
        Include in Authorization header for protected routes
                            ↓
            Backend validates token via middleware
                            ↓
                    Grant access to resource
```

## Recommendation Engine

### Algorithm Design

The recommendation engine uses a rule-based scoring system:

```javascript
Base Score: 50 points

Risk Match:
  + 20 points if stock.riskLevel === user.riskLevel

Goal Match:
  + 15 points if:
    - goal === "Income" && dividendYield >= 2%
    - goal === "Growth" && avgReturn >= 12%
    - goal === "Balanced" && avgReturn between 8-15%

Volatility Score:
  + 10 points if volatility < 15%
  + 5 points if volatility < 25%

Return Score:
  + 10 points if avgReturn > 15%
  + 5 points if avgReturn > 10%

Final Score = Sum of all applicable points
Sort by score descending, return top 8
```

### Recommendation Rules

| User Risk | Goal | Horizon | Recommended Stocks |
|-----------|------|---------|-------------------|
| Low | Income | Medium | Large Cap, FMCG, Banking with high dividend |
| Medium | Growth | Long | IT, Pharma, Large/Mid Cap with good returns |
| High | Growth | Short | Small Cap, Tech with high volatility |
| Low | Balanced | Long | Mix of Large Cap, low volatility stocks |

## Security Architecture

### Authentication Security
- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Signed with secret key
- **Token Expiry**: 7 days default
- **Protected Routes**: Middleware validates tokens

### Data Validation
- **Input Validation**: express-validator
- **Email Validation**: RFC 5322 compliant regex
- **Password Requirements**: Minimum 6 characters
- **Quantity Validation**: Positive integers only

### CORS Configuration
- **Allowed Origins**: Configurable via environment
- **Credentials**: Enabled for cookie support
- **Methods**: GET, POST, PUT, DELETE

## Performance Optimizations

### Database
- **Indexes**: On frequently queried fields
- **Lean Queries**: For read-only operations
- **Connection Pooling**: Default Mongoose pooling

### Frontend
- **Code Splitting**: Vite automatic chunking
- **Lazy Loading**: React.lazy for routes
- **Memoization**: useMemo and useCallback
- **Image Optimization**: Optimized assets

### Caching Strategy
- **API Responses**: No caching (real-time data)
- **Static Assets**: Browser caching
- **Token Storage**: localStorage

## Scalability Considerations

### Horizontal Scaling
- **Stateless Backend**: No session state in memory
- **Load Balancer Ready**: JWT-based auth
- **Database Replication**: MongoDB replica sets

### Vertical Scaling
- **Resource Limits**: Configurable in Docker
- **Connection Limits**: MongoDB connection pooling
- **Memory Management**: Node.js heap size

## Monitoring & Logging

### Application Logs
- **Console Logging**: Development environment
- **Structured Logging**: JSON format recommended
- **Error Tracking**: Try-catch blocks with logging

### Health Checks
- **Backend Health**: /health endpoint
- **Database Connection**: Mongoose connection events
- **API Status**: Response time monitoring

## Deployment Architecture

### Docker Compose Setup
```yaml
Services:
  - MongoDB (Port 27017)
  - Backend (Port 5000)
  - Frontend (Port 3000)

Networks:
  - wealthmind-network (bridge)

Volumes:
  - mongodb_data (persistent storage)
```

### Environment Variables
```
Backend:
  - PORT
  - NODE_ENV
  - MONGODB_URI
  - JWT_SECRET
  - JWT_EXPIRE
  - CORS_ORIGIN

Frontend:
  - VITE_API_URL
```

## Testing Strategy

### Backend Testing
- **Unit Tests**: Controllers and models
- **Integration Tests**: API endpoints
- **Database Tests**: Mongoose operations
- **Framework**: Jest + Supertest

### Frontend Testing
- **Component Tests**: React Testing Library
- **E2E Tests**: (Recommended: Cypress/Playwright)
- **Visual Tests**: Snapshot testing

## Development Workflow

```
1. Clone Repository
2. Install Dependencies (npm install)
3. Setup Environment (.env files)
4. Start MongoDB (docker compose up mongodb)
5. Seed Database (npm run seed)
6. Start Backend (npm start)
7. Start Frontend (npm run dev)
8. Make Changes
9. Test Locally
10. Commit & Push
```

## Error Handling

### Backend Errors
```javascript
{
  success: false,
  message: "Error description",
  error: "Detailed error (development only)"
}
```

### Frontend Errors
- **Network Errors**: Axios interceptors
- **Validation Errors**: Form-level validation
- **Auth Errors**: Redirect to login

## Future Enhancements

### Planned Features
1. Real-time stock price updates (WebSocket)
2. SIP (Systematic Investment Plan)
3. Price alerts and notifications
4. Advanced charts (candlestick, line)
5. Watchlist functionality
6. News feed integration
7. Admin dashboard
8. Mobile app (React Native)
9. Two-factor authentication
10. Social trading features

### Technical Improvements
1. Redis caching layer
2. Elasticsearch for search
3. GraphQL API
4. Microservices architecture
5. Kubernetes deployment
6. CI/CD pipeline
7. Automated testing
8. Performance monitoring
9. Error tracking (Sentry)
10. Analytics (Google Analytics)

## Conclusion

WealthMind demonstrates a complete full-stack application with:
- ✅ Clean architecture
- ✅ Separation of concerns
- ✅ RESTful API design
- ✅ Secure authentication
- ✅ Responsive UI/UX
- ✅ Docker deployment
- ✅ Comprehensive documentation

This architecture provides a solid foundation for a production-ready investment platform while maintaining code quality and scalability.
