const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const contractRoutes = require('./routes/contract.routes');
const riskRoutes = require('./routes/risk.routes');
const bankingRoutes = require('./routes/banking.routes');
const privacyRoutes = require('./routes/privacy.routes');
const blockchainRoutes = require('./routes/blockchain.routes');

// Initialize express app
const app = express();

// Set up middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(morgan('dev')); // HTTP request logger

// HACKATHON DEMO: Global authentication bypass
// This middleware injects a mock user into every request
// WARNING: This should NEVER be used in production!
app.use((req, res, next) => {
  // Inject mock user data into every request
  req.user = {
    id: 'demo_user_123',
    email: 'demo@example.com',
    name: 'Demo User'
  };
  
  // Log the first time this middleware runs
  if (!global.authBypassLogged) {
    console.log('🔑 HACKATHON DEMO MODE: Authentication bypass enabled');
    global.authBypassLogged = true;
  }
  
  next();
});

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/banking', bankingRoutes);
app.use('/api/privacy', privacyRoutes);
app.use('/api/blockchain', blockchainRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Aries DeFi Risk Engine API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Special handling for MongoDB connection errors
  if (err.name === 'MongoError' || err.name === 'MongoNetworkError') {
    console.log('⚠️ MongoDB operation failed, but continuing in memory-only mode');
    return res.status(200).json({
      message: 'Operation succeeded (memory-only mode)',
      warning: 'Database unavailable, changes will not persist'
    });
  }
  
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Set port and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Connect to MongoDB (optional for hackathon demo)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aries');
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.log('⚠️ Running in memory-only mode (no persistent storage)');
    return false;
  }
};

// Try to connect but continue even if it fails
connectDB().catch(() => {});

module.exports = app;
