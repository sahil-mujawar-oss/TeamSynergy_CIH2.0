const express = require('express');
const router = express.Router();
const blockchainController = require('../controllers/blockchain.controller');
const auth = require('../middleware/auth');

/**
 * @route POST /api/blockchain/validate-address
 * @desc Validate a wallet address
 * @access Public
 */
router.post('/validate-address', blockchainController.validateAddress);

/**
 * @route GET /api/blockchain/wallet/:address
 * @desc Get wallet information
 * @access Public
 */
router.get('/wallet/:address', blockchainController.getWalletInfo);

/**
 * @route POST /api/blockchain/mint-credit-score-nft
 * @desc Mint a credit score NFT
 * @access Private
 */
router.post('/mint-credit-score-nft', auth, blockchainController.mintCreditScoreNFT);

/**
 * @route GET /api/blockchain/price/:symbol
 * @desc Get real-time price data for a cryptocurrency
 * @access Public
 */
router.get('/price/:symbol', blockchainController.getCryptoPriceData);

/**
 * @route GET /api/blockchain/historical-price/:symbol
 * @desc Get historical price data for a cryptocurrency
 * @access Public
 */
router.get('/historical-price/:symbol', blockchainController.getHistoricalPriceData);

/**
 * @route GET /api/blockchain/contract-activity/:address
 * @desc Get smart contract activity
 * @access Public
 */
router.get('/contract-activity/:address', blockchainController.getSmartContractActivity);

module.exports = router;
