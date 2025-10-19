const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Import models
const Stock = require('./models/Stock');
const User = require('./models/User');
const Portfolio = require('./models/Portfolio');
const Order = require('./models/Order');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/wealthmind',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

// Read stock data from JSON file
const getStocksData = () => {
  const stocksFile = path.join(__dirname, 'mockStocks.json');
  const stocksData = fs.readFileSync(stocksFile, 'utf-8');
  return JSON.parse(stocksData);
};

// Seed stocks
const seedStocks = async () => {
  try {
    // Clear existing stocks
    await Stock.deleteMany({});
    console.log('🗑️  Cleared existing stocks');

    // Load and insert stocks
    const stocks = getStocksData();
    await Stock.insertMany(stocks);
    console.log(`✅ Seeded ${stocks.length} stocks`);
  } catch (error) {
    console.error('❌ Error seeding stocks:', error);
    throw error;
  }
};

// Create demo users
const seedUsers = async () => {
  try {
    // Clear existing users (except those with orders/portfolios)
    await User.deleteMany({});
    await Portfolio.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️  Cleared existing users and portfolios');

    // Create demo users
    const demoUsers = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '+91-9876543210',
        preferences: {
          riskLevel: 'Medium',
          goal: 'Growth',
          investmentHorizon: 'Long'
        }
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        phone: '+91-9876543211',
        preferences: {
          riskLevel: 'Low',
          goal: 'Income',
          investmentHorizon: 'Medium'
        }
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: 'password123',
        phone: '+91-9876543212',
        preferences: {
          riskLevel: 'High',
          goal: 'Growth',
          investmentHorizon: 'Short'
        }
      }
    ];

    for (const userData of demoUsers) {
      const user = await User.create(userData);
      
      // Create empty portfolio for each user
      await Portfolio.create({
        userId: user._id,
        holdings: [],
        totalInvested: 0,
        currentValue: 0,
        totalProfitLoss: 0
      });
      
      console.log(`✅ Created user: ${user.email}`);
    }

    console.log(`✅ Seeded ${demoUsers.length} demo users`);
    console.log('\n📝 Demo User Credentials:');
    demoUsers.forEach(user => {
      console.log(`   Email: ${user.email} | Password: password123`);
    });
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
};

// Main seed function
const seedAll = async () => {
  try {
    await connectDB();
    
    console.log('\n🌱 Starting database seeding...\n');
    
    await seedStocks();
    await seedUsers();
    
    console.log('\n✅ Database seeding completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding
seedAll();
