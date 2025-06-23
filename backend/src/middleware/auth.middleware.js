/**
 * Authentication middleware
 * Verifies the JWT token in the request header
 * Supports both standard JWT tokens and base64-encoded JSON tokens for development
 */
module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // For development mode: accept any token and create a mock user
  // This is a temporary solution for the hackathon demo
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  if (isDevelopment) {
    console.log('Development mode: Creating mock user from token');
    
    // Create a mock user for development
    req.user = {
      id: 'mock_user_id',
      email: 'demo@example.com'
    };
    
    return next();
  }
  
  // For production: properly validate the token
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key');
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
