const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post(
  '/register',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
    body('name', 'Name is required').not().isEmpty()
  ],
  authController.register
);

/**
 * @route POST /api/auth/login
 * @desc Authenticate user & get token
 * @access Public
 */
router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists()
  ],
  authController.login
);

/**
 * @route POST /api/auth/login/provider
 * @desc Authenticate user with provider (Google, GitHub, wallet)
 * @access Public
 */
router.post(
  '/login/provider',
  [
    body('provider', 'Provider is required').not().isEmpty(),
    body('token', 'Token is required').not().isEmpty()
  ],
  authController.loginWithProvider
);

module.exports = router;
