/**
 * Mock Banking Service
 * Provides simulated banking data for the hackathon demo
 */

/**
 * Generate mock bank accounts
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Mock accounts data
 */
const getBankAccounts = async (userId) => {
  // Generate random account numbers
  const generateAccountNumber = () => {
    return 'XXXX-XXXX-' + Math.floor(1000 + Math.random() * 9000);
  };

  // Generate random balance
  const generateBalance = (min, max) => {
    return (Math.random() * (max - min) + min).toFixed(2);
  };

  // Mock accounts data
  const accounts = {
    customerId: 'mock-customer-' + userId,
    accounts: [
      {
        id: 'acc-' + Math.random().toString(36).substring(2, 10),
        accountNumber: generateAccountNumber(),
        name: 'Primary Checking',
        type: 'checking',
        status: 'active',
        balance: generateBalance(1500, 8000),
        availableBalance: generateBalance(1400, 7800),
        currency: 'USD',
        lastUpdated: new Date().toISOString(),
        institution: {
          id: 'inst-001',
          name: 'Demo Bank',
          logo: 'https://via.placeholder.com/150?text=Demo+Bank'
        }
      },
      {
        id: 'acc-' + Math.random().toString(36).substring(2, 10),
        accountNumber: generateAccountNumber(),
        name: 'Savings Account',
        type: 'savings',
        status: 'active',
        balance: generateBalance(5000, 25000),
        availableBalance: generateBalance(5000, 25000),
        currency: 'USD',
        lastUpdated: new Date().toISOString(),
        institution: {
          id: 'inst-001',
          name: 'Demo Bank',
          logo: 'https://via.placeholder.com/150?text=Demo+Bank'
        }
      },
      {
        id: 'acc-' + Math.random().toString(36).substring(2, 10),
        accountNumber: generateAccountNumber(),
        name: 'Credit Card',
        type: 'credit',
        status: 'active',
        balance: generateBalance(100, 3000),
        availableCredit: generateBalance(5000, 10000),
        creditLimit: 10000,
        currency: 'USD',
        lastUpdated: new Date().toISOString(),
        institution: {
          id: 'inst-002',
          name: 'Credit Union',
          logo: 'https://via.placeholder.com/150?text=Credit+Union'
        }
      }
    ]
  };

  return accounts;
};

/**
 * Connect to a banking provider
 * @param {string} userId - User ID
 * @param {Object} credentials - Banking credentials
 * @returns {Promise<Object>} Connection result
 */
const connectBankingProvider = async (userId, credentials) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock successful connection
  return {
    success: true,
    customerId: 'mock-customer-' + userId,
    message: 'Successfully connected to banking provider',
    institution: {
      id: credentials.provider === 'Fynapse' ? 'inst-001' : 'inst-002',
      name: credentials.provider || 'Demo Bank',
      logo: `https://via.placeholder.com/150?text=${credentials.provider || 'Demo+Bank'}`
    }
  };
};

/**
 * Get transactions for a specific account
 * @param {string} userId - User ID
 * @param {string} accountId - Account ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Transactions data
 */
const getAccountTransactions = async (userId, accountId, options = {}) => {
  // Default options
  const { limit = 20, dateFrom, dateTo, type } = options;

  // Generate random transaction data
  const transactions = [];
  const categories = ['Groceries', 'Dining', 'Shopping', 'Transportation', 'Entertainment', 'Utilities', 'Health', 'Travel'];
  const merchants = ['Whole Foods', 'Amazon', 'Uber', 'Netflix', 'Target', 'Starbucks', 'CVS Pharmacy', 'AT&T', 'Gas Station'];
  
  // Generate transactions
  for (let i = 0; i < limit; i++) {
    const isDebit = Math.random() > 0.3;
    const amount = isDebit ? 
      (Math.random() * 200 + 5).toFixed(2) : 
      (Math.random() * 2000 + 500).toFixed(2);
    
    const daysAgo = i * 2;
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    transactions.push({
      id: 'tx-' + Math.random().toString(36).substring(2, 10),
      accountId,
      amount: isDebit ? -amount : amount,
      date: date.toISOString(),
      description: isDebit ? 
        merchants[Math.floor(Math.random() * merchants.length)] : 
        'Deposit',
      category: isDebit ? 
        categories[Math.floor(Math.random() * categories.length)] : 
        'Income',
      status: 'posted',
      type: isDebit ? 'debit' : 'credit'
    });
  }
  
  return {
    accountId,
    transactions,
    totalCount: transactions.length,
    moreAvailable: false
  };
};

/**
 * Analyze spending patterns
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Spending analysis
 */
const analyzeSpending = async (userId) => {
  // Generate mock spending categories
  const categories = [
    { name: 'Groceries', amount: (Math.random() * 500 + 200).toFixed(2), percentage: 0 },
    { name: 'Dining', amount: (Math.random() * 300 + 100).toFixed(2), percentage: 0 },
    { name: 'Shopping', amount: (Math.random() * 400 + 150).toFixed(2), percentage: 0 },
    { name: 'Transportation', amount: (Math.random() * 200 + 100).toFixed(2), percentage: 0 },
    { name: 'Entertainment', amount: (Math.random() * 200 + 50).toFixed(2), percentage: 0 },
    { name: 'Utilities', amount: (Math.random() * 300 + 150).toFixed(2), percentage: 0 },
    { name: 'Health', amount: (Math.random() * 200 + 100).toFixed(2), percentage: 0 },
    { name: 'Other', amount: (Math.random() * 200 + 50).toFixed(2), percentage: 0 }
  ];
  
  // Calculate total and percentages
  const total = categories.reduce((sum, cat) => sum + parseFloat(cat.amount), 0);
  categories.forEach(cat => {
    cat.percentage = ((parseFloat(cat.amount) / total) * 100).toFixed(1);
  });
  
  // Generate monthly spending trend
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const trend = months.map(month => ({
    month,
    amount: (Math.random() * 2000 + 1000).toFixed(2)
  }));
  
  return {
    totalSpending: total.toFixed(2),
    categories,
    trend,
    insights: [
      'Your spending on Dining increased by 15% compared to last month',
      'You spent less on Entertainment this month',
      'Your biggest expense category is Groceries',
      'You have 3 recurring subscriptions totaling $45.97 per month'
    ]
  };
};

module.exports = {
  getBankAccounts,
  connectBankingProvider,
  getAccountTransactions,
  analyzeSpending
};
