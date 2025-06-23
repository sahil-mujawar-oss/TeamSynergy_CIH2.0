/**
 * Banking Controller
 * Handles API requests for banking integration features including account fetching,
 * transaction analysis, and spending pattern insights.
 */
// Use the mock banking service for the hackathon demo
const bankingService = require('../services/mock-banking.service');

// Store customer IDs (in a real app, this would be in a database)
const customerIdMap = {};

/**
 * Fetch accounts from banking provider
 * @route GET /api/banking/accounts
 */
exports.getAccounts = async (req, res) => {
  try {
    // Use the authenticated user's ID
    const userId = req.user.id;
    
    // Get the customer ID for this user
    const customerId = customerIdMap[userId];
    
    // For demo mode: Create a connection if one doesn't exist
    if (!customerId) {
      // Auto-create a connection for demo purposes
      const connection = await bankingService.connectBankingProvider(userId, {
        provider: 'Fynapse',
        username: 'demo_user',
        password: '********'
      });
      
      // Store the customer ID
      if (connection.customerId) {
        customerIdMap[userId] = connection.customerId;
      }
      
      console.log(`Demo mode: Auto-created banking connection for user ${userId}`);
    }
    
    // Get accounts using the mock service
    const accounts = await bankingService.getBankAccounts(userId);
    res.json(accounts);
  } catch (err) {
    console.error('Error fetching accounts:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * Fetch transactions for a specific account
 * @route GET /api/banking/accounts/:accountId/transactions
 */
exports.getAccountTransactions = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { dateFrom, dateTo, limit, type } = req.query;
    
    // Use the authenticated user's ID
    const userId = req.user.id;
    
    // For demo mode: Create a connection if one doesn't exist
    if (!customerIdMap[userId]) {
      // Auto-create a connection for demo purposes
      const connection = await bankingService.connectBankingProvider(userId, {
        provider: 'Fynapse',
        username: 'demo_user',
        password: '********'
      });
      
      // Store the customer ID
      if (connection.customerId) {
        customerIdMap[userId] = connection.customerId;
      }
    }
    
    if (!accountId) {
      return res.status(400).json({ message: 'Account ID is required' });
    }
    
    const options = {};
    if (dateFrom) options.dateFrom = dateFrom;
    if (dateTo) options.dateTo = dateTo;
    if (limit) options.limit = parseInt(limit);
    if (type) options.type = type;
    
    // Get transactions using the mock service
    const transactions = await bankingService.getAccountTransactions(userId, accountId, options);
    res.json(transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * Analyze spending patterns
 * @route GET /api/banking/spending-analysis
 */
exports.analyzeSpending = async (req, res) => {
  try {
    const { dateFrom, dateTo, accountId } = req.query;
    
    // Use the authenticated user's ID
    const userId = req.user.id;
    
    // For demo mode: Create a connection if one doesn't exist
    if (!customerIdMap[userId]) {
      // Auto-create a connection for demo purposes
      const connection = await bankingService.connectBankingProvider(userId, {
        provider: 'Fynapse',
        username: 'demo_user',
        password: '********'
      });
      
      // Store the customer ID
      if (connection.customerId) {
        customerIdMap[userId] = connection.customerId;
      }
    }
    
    // Prepare options object
    const options = {};
    if (dateFrom) options.dateFrom = dateFrom;
    if (dateTo) options.dateTo = dateTo;
    if (accountId) options.accountId = accountId;
    
    // Get spending analysis using the mock service
    const analysis = await bankingService.analyzeSpending(userId);
    res.json(analysis);
  } catch (err) {
    console.error('Error analyzing spending patterns:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * Connect to banking provider
 * @route POST /api/banking/connect
 */
exports.connectBankingProvider = async (req, res) => {
  try {
    // Get credentials from request body
    const { provider, username, password } = req.body;
    
    // Use the authenticated user's ID
    const userId = req.user.id;
    
    // Validate required fields
    if (!provider) {
      return res.status(400).json({ message: 'Provider is required' });
    }
    
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }
    
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
    
    // Connect to banking provider using mock service
    const connection = await bankingService.connectBankingProvider(userId, {
      provider,
      username,
      password
    });
    
    // Store the customer ID for future use
    if (connection.customerId) {
      customerIdMap[userId] = connection.customerId;
    }
    
    res.json(connection);
  } catch (err) {
    console.error('Error connecting to banking provider:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * Get all banking accounts (combined from all providers)
 * @route GET /api/banking/accounts
 */
exports.getAllAccounts = async (req, res) => {
  try {
    // Use the authenticated user's ID
    const userId = req.user.id;
    
    // Fetch accounts from both providers
    const fynapseResult = await bankingService.fetchFynapseAccounts(userId);
    const saltEdgeResult = await bankingService.fetchSaltEdgeAccounts(userId);
    
    // Combine the results
    const allAccounts = [
      ...(fynapseResult.success ? fynapseResult.accounts : []),
      ...(saltEdgeResult.success ? saltEdgeResult.accounts : [])
    ];
    
    // Calculate total balance across all accounts
    const totalBalance = allAccounts.reduce((sum, account) => sum + account.balance, 0);
    
    res.json({
      success: true,
      accounts: allAccounts,
      summary: {
        totalAccounts: allAccounts.length,
        totalBalance,
        currency: 'USD' // Assuming all accounts are in USD for simplicity
      }
    });
  } catch (err) {
    console.error('Error fetching all banking accounts:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
