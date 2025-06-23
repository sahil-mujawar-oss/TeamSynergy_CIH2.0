const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

/**
 * Register a new user
 */
exports.register = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      provider: 'email'
    });

    // Save user to database
    await user.save();

    // Create and return JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'default_secret_key',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            provider: user.provider,
            walletAddress: user.walletAddress,
            avatar: user.avatar
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

/**
 * Login user
 */
exports.login = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and return JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'default_secret_key',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            provider: user.provider,
            walletAddress: user.walletAddress,
            avatar: user.avatar
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

/**
 * Login with provider (Google, GitHub, wallet)
 */
exports.loginWithProvider = async (req, res) => {
  const { provider, token, userData } = req.body;

  if (!provider || !token || !userData) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // For this implementation, we'll trust the provided userData
    // In a production environment, you would verify the token with the provider
    
    let user = null;
    
    // Check if user exists by email
    if (userData.email) {
      user = await User.findOne({ email: userData.email });
    }
    
    // For wallet provider, check by wallet address
    if (provider === 'wallet' && userData.walletAddress) {
      if (!user) {
        user = await User.findOne({ walletAddress: userData.walletAddress });
      }
    }
    
    // If user doesn't exist, create a new one
    if (!user) {
      user = new User({
        name: userData.name || 'User',
        email: userData.email,
        provider,
        walletAddress: userData.walletAddress,
        avatar: userData.avatar
      });
      
      await user.save();
    } else {
      // Update existing user with provider data
      if (provider === 'wallet' && userData.walletAddress && !user.walletAddress) {
        user.walletAddress = userData.walletAddress;
      }
      
      if (userData.avatar && !user.avatar) {
        user.avatar = userData.avatar;
      }
      
      await user.save();
    }
    
    // Create and return JWT token
    const payload = {
      user: {
        id: user.id
      }
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'default_secret_key',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            provider: user.provider,
            walletAddress: user.walletAddress,
            avatar: user.avatar
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
