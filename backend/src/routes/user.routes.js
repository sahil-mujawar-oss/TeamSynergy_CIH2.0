const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @route GET /api/user/profile
 * @desc Get current user's profile
 * @access Private
 */
router.get('/profile', authMiddleware, userController.getProfile);

/**
 * @route PUT /api/user/profile
 * @desc Update user profile
 * @access Private
 */
router.put('/profile', authMiddleware, userController.updateProfile);

/**
 * @route POST /api/user/wallet
 * @desc Connect a wallet address to user account
 * @access Private
 */
router.post('/wallet', authMiddleware, userController.connectWallet);

module.exports = router;
