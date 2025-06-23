/**
 * Finicity Banking Service
 * Integrates with Mastercard's Finicity API for real banking data
 */
const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

// Finicity API configuration
const FINICITY_API_URL = process.env.FINICITY_API_URL || 'https://api.finicity.com';
const FINICITY_APP_KEY = process.env.FINICITY_APP_KEY;
const FINICITY_PARTNER_ID = process.env.FINICITY_PARTNER_ID;
const FINICITY_PARTNER_SECRET = process.env.FINICITY_PARTNER_SECRET;

// Store tokens in memory (in production, use Redis or similar)
let accessToken = null;
let tokenExpiry = null;

/**
 * Generate Finicity API headers with authentication
 * @returns {Promise<Object>} Headers for API requests
 */
const getAuthHeaders = async () => {
  // Check if we need a new token
  if (!accessToken || Date.now() >= tokenExpiry) {
    await authenticate();
  }
  
  return {
    'Finicity-App-Key': FINICITY_APP_KEY,
    'Finicity-App-Token': accessToken,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
};

/**
 * Authenticate with Finicity API and get access token
 * @returns {Promise<void>}
 */
const authenticate = async () => {
  try {
    const response = await axios.post(`${FINICITY_API_URL}/aggregation/v2/partners/authentication`, {
      partnerId: FINICITY_PARTNER_ID,
      partnerSecret: FINICITY_PARTNER_SECRET
    }, {
      headers: {
        'Finicity-App-Key': FINICITY_APP_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    accessToken = response.data.token;
    // Token expires in 2 hours (7200 seconds), we'll set it to expire in 1 hour 55 minutes to be safe
    tokenExpiry = Date.now() + (7200 - 300) * 1000;
    
    console.log('Successfully authenticated with Finicity API');
  } catch (error) {
    console.error('Failed to authenticate with Finicity API:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with banking provider');
  }
};

/**
 * Create a new Finicity customer
 * @param {string} userId - User ID
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Customer data
 */
const createCustomer = async (userId, userData) => {
  try {
    const headers = await getAuthHeaders();
    
    const response = await axios.post(`${FINICITY_API_URL}/aggregation/v1/customers/active`, {
      username: `user_${userId}`,
      firstName: userData.firstName || 'John',
      lastName: userData.lastName || 'Doe',
      applicationId: 'Aries Finance'
    }, { headers });
    
    return {
      customerId: response.data.id,
      username: response.data.username,
      createdDate: response.data.createdDate
    };
  } catch (error) {
    console.error('Failed to create Finicity customer:', error.response?.data || error.message);
    throw new Error('Failed to create banking customer profile');
  }
};

/**
 * Generate a connect URL for bank account linking
 * @param {string} customerId - Finicity customer ID
 * @param {Object} options - Connect options
 * @returns {Promise<Object>} Connect URL data
 */
const generateConnectUrl = async (customerId, options = {}) => {
  try {
    const headers = await getAuthHeaders();
    
    const response = await axios.post(`${FINICITY_API_URL}/connect/v2/generate`, {
      partnerId: FINICITY_PARTNER_ID,
      customerId,
      language: options.language || 'en',
      consumerId: options.consumerId || crypto.randomUUID(),
      redirectUri: options.redirectUri || 'https://aries.finance/banking/callback',
      webhook: options.webhook || 'https://aries.finance/api/banking/webhook',
      webhookContentType: 'application/json',
      experience: 'default'
    }, { headers });
    
    return {
      link: response.data.link,
      id: response.data.id
    };
  } catch (error) {
    console.error('Failed to generate Connect URL:', error.response?.data || error.message);
    throw new Error('Failed to generate bank connection link');
  }
};

/**
 * Get all accounts for a customer
 * @param {string} customerId - Finicity customer ID
 * @returns {Promise<Array>} List of accounts
 */
const getAccounts = async (customerId) => {
  try {
    const headers = await getAuthHeaders();
    
    const response = await axios.get(`${FINICITY_API_URL}/aggregation/v1/customers/${customerId}/accounts`, { headers });
    
    // Transform the response to match our application's format
    const accounts = response.data.accounts.map(account => ({
      id: account.id,
      provider: account.institutionId,
      providerName: account.institutionName,
      type: account.type.toLowerCase(),
      name: account.name,
      balance: account.balance,
      currency: account.currency || 'USD',
      accountNumber: account.accountNumberDisplay || `****${account.number.slice(-4)}`,
      lastUpdated: new Date(account.lastUpdatedDate).toISOString()
    }));
    
    // Calculate summary
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    
    return {
      accounts,
      summary: {
        totalAccounts: accounts.length,
        totalBalance: parseFloat(totalBalance.toFixed(2)),
        currency: 'USD'
      }
    };
  } catch (error) {
    console.error('Failed to get accounts:', error.response?.data || error.message);
    throw new Error('Failed to retrieve banking accounts');
  }
};

/**
 * Get transactions for a specific account
 * @param {string} customerId - Finicity customer ID
 * @param {string} accountId - Account ID
 * @param {Object} options - Filter options
 * @returns {Promise<Object>} Account transactions
 */
const getAccountTransactions = async (customerId, accountId, options = {}) => {
  try {
    const headers = await getAuthHeaders();
    
    // Set default date range to last 90 days if not provided
    const fromDate = options.startDate ? new Date(options.startDate) : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const toDate = options.endDate ? new Date(options.endDate) : new Date();
    
    // Format dates as required by Finicity (Unix timestamp in seconds)
    const fromTimestamp = Math.floor(fromDate.getTime() / 1000);
    const toTimestamp = Math.floor(toDate.getTime() / 1000);
    
    const response = await axios.get(
      `${FINICITY_API_URL}/aggregation/v3/customers/${customerId}/accounts/${accountId}/transactions`,
      {
        headers,
        params: {
          fromDate: fromTimestamp,
          toDate: toTimestamp,
          limit: options.limit || 100,
          sort: 'desc'
        }
      }
    );
    
    // Transform the response to match our application's format
    const transactions = response.data.transactions.map(tx => ({
      id: tx.id,
      date: new Date(tx.transactionTime).toISOString(),
      description: tx.description,
      amount: tx.amount,
      type: tx.amount < 0 ? 'debit' : 'credit',
      category: tx.categorization?.category?.name || 'uncategorized',
      balance: tx.runningBalance || null
    }));
    
    // Apply category filter if provided
    if (options.category) {
      transactions = transactions.filter(tx => tx.category.toLowerCase() === options.category.toLowerCase());
    }
    
    // Apply type filter if provided
    if (options.type) {
      transactions = transactions.filter(tx => tx.type === options.type);
    }
    
    return {
      accountId,
      transactions
    };
  } catch (error) {
    console.error('Failed to get transactions:', error.response?.data || error.message);
    throw new Error('Failed to retrieve account transactions');
  }
};

/**
 * Analyze spending patterns
 * @param {string} customerId - Finicity customer ID
 * @param {string} accountId - Account ID (optional)
 * @returns {Promise<Object>} Spending analysis
 */
const analyzeSpending = async (customerId, accountId = null) => {
  try {
    const headers = await getAuthHeaders();
    
    // Get all transactions for the last 90 days
    const fromDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const toDate = new Date();
    
    // Format dates as required by Finicity (Unix timestamp in seconds)
    const fromTimestamp = Math.floor(fromDate.getTime() / 1000);
    const toTimestamp = Math.floor(toDate.getTime() / 1000);
    
    let transactions = [];
    
    if (accountId) {
      // Get transactions for specific account
      const response = await axios.get(
        `${FINICITY_API_URL}/aggregation/v3/customers/${customerId}/accounts/${accountId}/transactions`,
        {
          headers,
          params: {
            fromDate: fromTimestamp,
            toDate: toTimestamp,
            limit: 1000,
            sort: 'desc'
          }
        }
      );
      transactions = response.data.transactions;
    } else {
      // Get transactions for all accounts
      const response = await axios.get(
        `${FINICITY_API_URL}/aggregation/v3/customers/${customerId}/transactions`,
        {
          headers,
          params: {
            fromDate: fromTimestamp,
            toDate: toTimestamp,
            limit: 1000,
            sort: 'desc'
          }
        }
      );
      transactions = response.data.transactions;
    }
    
    // Filter to only include expenses (negative amounts)
    const expenses = transactions.filter(tx => tx.amount < 0);
    
    // Group by category
    const categoryMap = {};
    expenses.forEach(tx => {
      const category = tx.categorization?.category?.name || 'uncategorized';
      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }
      categoryMap[category] += Math.abs(tx.amount);
    });
    
    // Convert to array and sort by amount
    const totalSpent = expenses.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    const categories = Object.keys(categoryMap).map(category => ({
      category,
      amount: parseFloat(categoryMap[category].toFixed(2)),
      percentage: parseFloat(((categoryMap[category] / totalSpent) * 100).toFixed(2))
    }));
    
    categories.sort((a, b) => b.amount - a.amount);
    
    return {
      totalSpent: parseFloat(totalSpent.toFixed(2)),
      categories,
      timeframe: {
        startDate: fromDate.toISOString(),
        endDate: toDate.toISOString()
      }
    };
  } catch (error) {
    console.error('Failed to analyze spending:', error.response?.data || error.message);
    throw new Error('Failed to analyze spending patterns');
  }
};

/**
 * Connect to a banking provider and fetch accounts
 * @param {string} userId - User ID
 * @param {Object} connectionDetails - Connection details
 * @returns {Promise<Object>} Connection result
 */
const connectBankingProvider = async (userId, connectionDetails) => {
  try {
    // First, create or get a Finicity customer for this user
    let customerId;
    
    // In a real implementation, you would store and retrieve the customerId from your database
    // For this example, we'll create a new customer each time
    const customerData = await createCustomer(userId, connectionDetails);
    customerId = customerData.customerId;
    
    // Generate a connect URL for the customer to link their bank accounts
    const connectData = await generateConnectUrl(customerId, {
      redirectUri: connectionDetails.redirectUri || 'https://aries.finance/banking/callback'
    });
    
    return {
      success: true,
      connectionId: connectData.id,
      customerId,
      connectUrl: connectData.link,
      message: 'Use the connect URL to link bank accounts'
    };
  } catch (error) {
    console.error('Failed to connect banking provider:', error);
    throw new Error('Failed to connect to banking provider');
  }
};

/**
 * Get all bank accounts for a user
 * @param {string} userId - User ID
 * @param {string} customerId - Finicity customer ID
 * @returns {Promise<Object>} User's bank accounts
 */
const getBankAccounts = async (userId, customerId) => {
  try {
    // In a real implementation, you would retrieve the customerId from your database
    // For this example, we'll assume it's passed in
    
    if (!customerId) {
      throw new Error('Customer ID is required');
    }
    
    return await getAccounts(customerId);
  } catch (error) {
    console.error('Failed to get bank accounts:', error);
    throw new Error('Failed to retrieve banking accounts');
  }
};

module.exports = {
  connectBankingProvider,
  getBankAccounts,
  getAccountTransactions,
  analyzeSpending,
  createCustomer,
  generateConnectUrl
};
