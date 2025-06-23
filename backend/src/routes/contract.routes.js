const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contract.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @route GET /api/contracts/fetch
 * @desc Fetch smart contracts based on wallet address
 * @access Private
 */
router.get('/fetch', authMiddleware, contractController.fetchContracts);

/**
 * @route POST /api/contracts/scan
 * @desc Scan a smart contract for vulnerabilities
 * @access Private
 */
router.post('/scan', authMiddleware, contractController.scanContract);

/**
 * @route POST /api/contracts/compliance
 * @desc Check smart contract compliance
 * @access Private
 */
router.post('/compliance', authMiddleware, contractController.checkCompliance);

/**
 * @route POST /api/contracts/nft/mint
 * @desc Mint an NFT credit score
 * @access Private
 */
router.post('/nft/mint', authMiddleware, contractController.mintCreditScoreNFT);

module.exports = router;
