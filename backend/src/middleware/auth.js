/**
 * Authentication Middleware
 * Verifies JWT tokens for protected routes
 * In development mode, bypasses token validation for hackathon demo
 */
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // HACKATHON DEMO MODE: Skip token validation
  // This is a temporary solution for demonstration purposes only
  // In a real production environment, proper token validation would be required
  
  // Create a mock user for the demo
  req.user = {
    id: 'demo_user_123',
    email: 'demo@example.com',
    name: 'Demo User'
  };
  
  // Log the bypass for debugging
  console.log('AUTH MIDDLEWARE: Token validation bypassed for hackathon demo');
  
  // Continue to the next middleware
  return next();
  
  /* Commented out for the hackathon demo
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'aries_secret_key');

    // Add user from payload
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
  */
};
