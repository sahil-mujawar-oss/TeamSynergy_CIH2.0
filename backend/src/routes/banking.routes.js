const express = require('express');
const router = express.Router();
const bankingController = require('../controllers/banking.controller');
const auth = require('../middleware/auth');

/**
 * @route GET /api/banking/accounts
 * @desc Get all banking accounts from Finicity
 * @access Private
 */
router.get('/accounts', auth, bankingController.getAccounts);

/**
 * @route POST /api/banking/connect
 * @desc Connect to Finicity banking provider
 * @access Private
 */
router.post('/connect', auth, bankingController.connectBankingProvider);

/**
 * @route GET /api/banking/accounts/:accountId/transactions
 * @desc Fetch transactions for a specific account
 * @access Private
 */
router.get('/accounts/:accountId/transactions', auth, bankingController.getAccountTransactions);

/**
 * @route GET /api/banking/spending-analysis
 * @desc Analyze spending patterns
 * @access Private
 */
router.get('/spending-analysis', auth, bankingController.analyzeSpending);

module.exports = router;
