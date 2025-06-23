/**
 * Banking Service
 * Provides functionality for connecting to banking services like Fynapse and SaltEdge,
 * fetching account information, and analyzing transaction data.
 */

// Mock bank account data for demonstration purposes
const mockBankAccounts = {
  // User ID to accounts mapping
  'user123': [
    {
      id: 'acc_1001',
      provider: 'fynapse',
      type: 'checking',
      name: 'Primary Checking',
      balance: 5280.42,
      currency: 'USD',
      accountNumber: 'xxxx4567',
      transactions: [
        { id: 'tx1001', date: '2025-05-01', description: 'Salary Deposit', amount: 3500.00, type: 'credit' },
        { id: 'tx1002', date: '2025-05-02', description: 'Grocery Store', amount: -125.30, type: 'debit' },
        { id: 'tx1003', date: '2025-05-05', description: 'Electric Bill', amount: -85.20, type: 'debit' },
        { id: 'tx1004', date: '2025-05-10', description: 'Restaurant', amount: -62.45, type: 'debit' },
        { id: 'tx1005', date: '2025-05-15', description: 'Gas Station', amount: -45.00, type: 'debit' }
      ]
    },
    {
      id: 'acc_1002',
      provider: 'fynapse',
      type: 'savings',
      name: 'Emergency Fund',
      balance: 12750.88,
      currency: 'USD',
      accountNumber: 'xxxx7890',
      transactions: [
        { id: 'tx2001', date: '2025-05-01', description: 'Transfer from Checking', amount: 500.00, type: 'credit' },
        { id: 'tx2002', date: '2025-05-15', description: 'Interest Payment', amount: 12.50, type: 'credit' }
      ]
    },
    {
      id: 'acc_1003',
      provider: 'saltedge',
      type: 'credit',
      name: 'Rewards Credit Card',
      balance: -1250.30,
      currency: 'USD',
      accountNumber: 'xxxx1234',
      transactions: [
        { id: 'tx3001', date: '2025-05-03', description: 'Online Shopping', amount: -89.99, type: 'debit' },
        { id: 'tx3002', date: '2025-05-07', description: 'Streaming Service', amount: -14.99, type: 'debit' },
        { id: 'tx3003', date: '2025-05-12', description: 'Restaurant', amount: -78.50, type: 'debit' },
        { id: 'tx3004', date: '2025-05-20', description: 'Payment', amount: 500.00, type: 'credit' }
      ]
    }
  ],
  'user456': [
    {
      id: 'acc_2001',
      provider: 'fynapse',
      type: 'checking',
      name: 'Joint Checking',
      balance: 8750.65,
      currency: 'USD',
      accountNumber: 'xxxx5678',
      transactions: [
        { id: 'tx4001', date: '2025-05-01', description: 'Salary Deposit', amount: 4200.00, type: 'credit' },
        { id: 'tx4002', date: '2025-05-03', description: 'Mortgage Payment', amount: -1500.00, type: 'debit' },
        { id: 'tx4003', date: '2025-05-05', description: 'Utility Bill', amount: -120.75, type: 'debit' },
        { id: 'tx4004', date: '2025-05-10', description: 'Grocery Store', amount: -210.45, type: 'debit' }
      ]
    }
  ]
};

/**
 * Fetch bank accounts from Fynapse API
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of bank accounts
 */
const fetchFynapseAccounts = async (userId) => {
  // In a real implementation, we would:
  // 1. Make API calls to Fynapse using their SDK or REST API
  // 2. Handle authentication and token management
  // 3. Parse and normalize the response data
  
  // For this demo, we'll use mock data
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Get mock accounts for this user, filtering for Fynapse accounts only
      const userAccounts = mockBankAccounts[userId] || [];
      const fynapseAccounts = userAccounts.filter(account => account.provider === 'fynapse');
      
      resolve({
        success: true,
        accounts: fynapseAccounts.map(account => ({
          id: account.id,
          provider: 'Fynapse',
          type: account.type,
          name: account.name,
          balance: account.balance,
          currency: account.currency,
          accountNumber: account.accountNumber,
          lastUpdated: new Date().toISOString()
        }))
      });
    }, 500);
  });
};

/**
 * Fetch bank accounts from SaltEdge API
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of bank accounts
 */
const fetchSaltEdgeAccounts = async (userId) => {
  // In a real implementation, we would:
  // 1. Make API calls to SaltEdge using their SDK or REST API
  // 2. Handle authentication and token management
  // 3. Parse and normalize the response data
  
  // For this demo, we'll use mock data
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Get mock accounts for this user, filtering for SaltEdge accounts only
      const userAccounts = mockBankAccounts[userId] || [];
      const saltEdgeAccounts = userAccounts.filter(account => account.provider === 'saltedge');
      
      resolve({
        success: true,
        accounts: saltEdgeAccounts.map(account => ({
          id: account.id,
          provider: 'SaltEdge',
          type: account.type,
          name: account.name,
          balance: account.balance,
          currency: account.currency,
          accountNumber: account.accountNumber,
          lastUpdated: new Date().toISOString()
        }))
      });
    }, 500);
  });
};

/**
 * Fetch transactions for a specific account
 * @param {string} userId - User ID
 * @param {string} accountId - Account ID
 * @param {Object} options - Query options (dateFrom, dateTo, limit, etc.)
 * @returns {Promise<Array>} List of transactions
 */
const fetchAccountTransactions = async (userId, accountId, options = {}) => {
  // In a real implementation, we would:
  // 1. Make API calls to the appropriate provider based on the account
  // 2. Handle pagination, filtering, etc.
  // 3. Parse and normalize the response data
  
  // For this demo, we'll use mock data
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Find the account in our mock data
      const userAccounts = mockBankAccounts[userId] || [];
      const account = userAccounts.find(acc => acc.id === accountId);
      
      if (!account) {
        resolve({
          success: false,
          error: 'Account not found'
        });
        return;
      }
      
      // Apply filtering if options are provided
      let transactions = [...account.transactions];
      
      if (options.dateFrom) {
        const fromDate = new Date(options.dateFrom);
        transactions = transactions.filter(tx => new Date(tx.date) >= fromDate);
      }
      
      if (options.dateTo) {
        const toDate = new Date(options.dateTo);
        transactions = transactions.filter(tx => new Date(tx.date) <= toDate);
      }
      
      if (options.type) {
        transactions = transactions.filter(tx => tx.type === options.type);
      }
      
      // Apply limit if provided
      if (options.limit && options.limit > 0) {
        transactions = transactions.slice(0, options.limit);
      }
      
      resolve({
        success: true,
        accountId,
        provider: account.provider,
        transactions: transactions.map(tx => ({
          id: tx.id,
          date: tx.date,
          description: tx.description,
          amount: tx.amount,
          type: tx.type,
          category: categorizeTransaction(tx.description),
          balance: null // We don't have running balance in our mock data
        }))
      });
    }, 500);
  });
};

/**
 * Categorize a transaction based on its description
 * @param {string} description - Transaction description
 * @returns {string} Category
 */
const categorizeTransaction = (description) => {
  description = description.toLowerCase();
  
  if (description.includes('salary') || description.includes('deposit')) {
    return 'income';
  } else if (description.includes('grocery') || description.includes('supermarket')) {
    return 'groceries';
  } else if (description.includes('restaurant') || description.includes('cafe')) {
    return 'dining';
  } else if (description.includes('gas') || description.includes('fuel')) {
    return 'transportation';
  } else if (description.includes('bill') || description.includes('utility')) {
    return 'utilities';
  } else if (description.includes('transfer')) {
    return 'transfer';
  } else if (description.includes('interest')) {
    return 'interest';
  } else if (description.includes('payment')) {
    return 'payment';
  } else if (description.includes('shopping') || description.includes('store')) {
    return 'shopping';
  } else if (description.includes('subscription') || description.includes('streaming')) {
    return 'subscription';
  } else {
    return 'other';
  }
};

/**
 * Analyze spending patterns for a user
 * @param {string} userId - User ID
 * @param {Object} options - Analysis options (dateFrom, dateTo, etc.)
 * @returns {Promise<Object>} Spending analysis
 */
const analyzeSpendingPatterns = async (userId, options = {}) => {
  // In a real implementation, we would:
  // 1. Fetch transactions from all accounts
  // 2. Categorize and analyze spending patterns
  // 3. Generate insights and recommendations
  
  // For this demo, we'll use mock data and simple analysis
  return new Promise(async (resolve) => {
    // Get all accounts for the user
    const userAccounts = mockBankAccounts[userId] || [];
    
    if (userAccounts.length === 0) {
      resolve({
        success: false,
        error: 'No accounts found for this user'
      });
      return;
    }
    
    // Collect all transactions
    let allTransactions = [];
    for (const account of userAccounts) {
      const result = await fetchAccountTransactions(userId, account.id, options);
      if (result.success) {
        allTransactions = [...allTransactions, ...result.transactions];
      }
    }
    
    // Calculate total income and expenses
    const income = allTransactions
      .filter(tx => tx.type === 'credit')
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    const expenses = allTransactions
      .filter(tx => tx.type === 'debit')
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    
    // Group expenses by category
    const expensesByCategory = {};
    allTransactions
      .filter(tx => tx.type === 'debit')
      .forEach(tx => {
        const category = categorizeTransaction(tx.description);
        if (!expensesByCategory[category]) {
          expensesByCategory[category] = 0;
        }
        expensesByCategory[category] += Math.abs(tx.amount);
      });
    
    // Convert to array and sort by amount
    const categorizedExpenses = Object.entries(expensesByCategory)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / expenses) * 100
      }))
      .sort((a, b) => b.amount - a.amount);
    
    // Generate insights
    const insights = [];
    
    if (income > 0 && expenses > 0) {
      const savingsRate = (income - expenses) / income * 100;
      
      if (savingsRate < 10) {
        insights.push('Your savings rate is below 10%. Consider reducing expenses to increase savings.');
      } else if (savingsRate > 30) {
        insights.push('Great job! Your savings rate is above 30%.');
      }
    }
    
    // Check for high spending in specific categories
    const highSpendingCategories = categorizedExpenses
      .filter(cat => cat.percentage > 25)
      .map(cat => cat.category);
    
    if (highSpendingCategories.length > 0) {
      insights.push(`You're spending a large portion of your budget on ${highSpendingCategories.join(', ')}. Consider ways to reduce these expenses.`);
    }
    
    // Calculate recurring expenses
    const potentialRecurring = allTransactions
      .filter(tx => tx.type === 'debit')
      .filter(tx => 
        tx.description.toLowerCase().includes('subscription') || 
        tx.description.toLowerCase().includes('bill') ||
        tx.description.toLowerCase().includes('service')
      );
    
    if (potentialRecurring.length > 0) {
      const recurringTotal = potentialRecurring.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
      insights.push(`You have approximately $${recurringTotal.toFixed(2)} in recurring expenses.`);
    }
    
    resolve({
      success: true,
      summary: {
        income,
        expenses,
        netCashFlow: income - expenses,
        savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0
      },
      categorizedExpenses,
      insights,
      timeframe: {
        from: options.dateFrom || 'All time',
        to: options.dateTo || 'Present'
      }
    });
  });
};

/**
 * Initialize a bank connection for a user
 * @param {string} userId - User ID
 * @param {string} provider - Provider name ('fynapse' or 'saltedge')
 * @param {Object} credentials - Provider-specific credentials
 * @returns {Promise<Object>} Connection result
 */
const initializeBankConnection = async (userId, provider, credentials) => {
  // In a real implementation, we would:
  // 1. Make API calls to the provider to initialize a connection
  // 2. Handle OAuth flows or credential validation
  // 3. Store connection tokens securely
  
  // For this demo, we'll simulate a successful connection
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Validate provider
      if (provider !== 'fynapse' && provider !== 'saltedge') {
        resolve({
          success: false,
          error: 'Invalid provider. Supported providers are: fynapse, saltedge'
        });
        return;
      }
      
      // Validate credentials (simplified)
      if (!credentials || !credentials.username || !credentials.password) {
        resolve({
          success: false,
          error: 'Invalid credentials. Required fields: username, password'
        });
        return;
      }
      
      // Generate a mock connection ID
      const connectionId = `conn_${Math.floor(Math.random() * 10000)}`;
      
      resolve({
        success: true,
        connectionId,
        provider,
        status: 'connected',
        message: `Successfully connected to ${provider}`,
        nextSteps: [
          'Fetch accounts using the fetchFynapseAccounts or fetchSaltEdgeAccounts methods',
          'Fetch transactions for each account using the fetchAccountTransactions method'
        ]
      });
    }, 1000);
  });
};

module.exports = {
  fetchFynapseAccounts,
  fetchSaltEdgeAccounts,
  fetchAccountTransactions,
  analyzeSpendingPatterns,
  initializeBankConnection
};
