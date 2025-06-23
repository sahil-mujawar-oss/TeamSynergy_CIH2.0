const express = require('express');
const router = express.Router();
const riskController = require('../controllers/risk.controller');
const auth = require('../middleware/auth');

/**
 * @route GET /api/risk/wallet/:address
 * @desc Analyze wallet risk profile
 * @access Private
 */
router.get('/wallet/:address', auth, riskController.analyzeWalletRisk);

/**
 * @route GET /api/risk/volatility/:token
 * @desc Get token volatility analysis
 * @access Private
 */
router.get('/volatility/:token', auth, riskController.getTokenVolatility);

/**
 * @route POST /api/risk/var
 * @desc Calculate Value at Risk (VaR) for a portfolio
 * @access Private
 */
router.post('/var', auth, riskController.calculateVaR);

/**
 * @route POST /api/risk/sharpe
 * @desc Calculate Sharpe Ratio for a portfolio or token
 * @access Private
 */
router.post('/sharpe', auth, riskController.calculateSharpe);

/**
 * @route POST /api/risk/hybrid
 * @desc Get hybrid risk analysis (combining crypto and traditional finance)
 * @access Private
 */
router.post('/hybrid', auth, riskController.getHybridRiskAnalysis);

module.exports = router;
