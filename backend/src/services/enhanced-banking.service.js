/**
 * Enhanced Banking Service
 * Provides realistic mock banking data for hackathon/demo purposes
 * without requiring external API keys
 */

// Mock user database with banking data
const mockUserBankData = {};

// Mock bank account types and institutions
const bankInstitutions = [
  { id: 'chase', name: 'Chase Bank', logo: 'chase.png' },
  { id: 'bofa', name: 'Bank of America', logo: 'bofa.png' },
  { id: 'wells', name: 'Wells Fargo', logo: 'wells.png' },
  { id: 'citi', name: 'Citibank', logo: 'citi.png' },
  { id: 'capital', name: 'Capital One', logo: 'capital.png' }
];

const accountTypes = ['checking', 'savings', 'credit', 'investment'];

// Transaction categories
const categories = [
  'groceries', 'dining', 'transportation', 'utilities', 
  'entertainment', 'shopping', 'travel', 'healthcare',
  'income', 'transfer', 'subscription', 'other'
];

// Generate realistic account number
const generateAccountNumber = () => {
  return `****${Math.floor(1000 + Math.random() * 9000)}`;
};

// Generate realistic transaction
const generateTransaction = (accountId, date, startingBalance) => {
  const isCredit = Math.random() > 0.7;
  const category = categories[Math.floor(Math.random() * categories.length)];
  const amount = parseFloat((Math.random() * (isCredit ? 2000 : 200) + 5).toFixed(2));
  
  let description = '';
  switch (category) {
    case 'groceries':
      description = ['Whole Foods', 'Trader Joe\'s', 'Safeway', 'Kroger', 'Publix'][Math.floor(Math.random() * 5)];
      break;
    case 'dining':
      description = ['Restaurant Payment', 'DoorDash', 'Uber Eats', 'Starbucks', 'Chipotle'][Math.floor(Math.random() * 5)];
      break;
    case 'transportation':
      description = ['Uber', 'Lyft', 'Gas Station', 'Parking Fee', 'Public Transit'][Math.floor(Math.random() * 5)];
      break;
    case 'utilities':
      description = ['Electric Bill', 'Water Bill', 'Internet Service', 'Phone Bill', 'Gas Bill'][Math.floor(Math.random() * 5)];
      break;
    case 'income':
      description = ['Direct Deposit', 'Payroll', 'Deposit', 'Transfer In', 'Payment Received'][Math.floor(Math.random() * 5)];
      break;
    default:
      description = ['Payment', 'Purchase', 'Transaction', 'Service Fee', 'Subscription'][Math.floor(Math.random() * 5)];
  }
  
  const balance = isCredit ? startingBalance + amount : startingBalance - amount;
  
  return {
    id: `tx_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    date: date.toISOString(),
    description,
    amount,
    type: isCredit ? 'credit' : 'debit',
    category,
    balance: parseFloat(balance.toFixed(2))
  };
};

// Generate transaction history
const generateTransactionHistory = (accountId, days = 30) => {
  const transactions = [];
  let currentBalance = parseFloat((Math.random() * 5000 + 1000).toFixed(2));
  
  const today = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Generate 0-3 transactions per day
    const numTransactions = Math.floor(Math.random() * 4);
    for (let j = 0; j < numTransactions; j++) {
      const transaction = generateTransaction(accountId, date, currentBalance);
      currentBalance = transaction.balance;
      transactions.push(transaction);
    }
  }
  
  return transactions;
};

// Generate a bank account
const generateBankAccount = (userId, institution) => {
  const type = accountTypes[Math.floor(Math.random() * accountTypes.length)];
  const balance = parseFloat((Math.random() * 10000 + 500).toFixed(2));
  const accountNumber = generateAccountNumber();
  
  let name = '';
  switch (type) {
    case 'checking':
      name = 'Primary Checking';
      break;
    case 'savings':
      name = 'Savings Account';
      break;
    case 'credit':
      name = 'Credit Card';
      break;
    case 'investment':
      name = 'Investment Account';
      break;
  }
  
  const accountId = `acc_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  
  return {
    id: accountId,
    userId,
    provider: institution.id,
    providerName: institution.name,
    type,
    name,
    balance,
    currency: 'USD',
    accountNumber,
    lastUpdated: new Date().toISOString(),
    transactions: generateTransactionHistory(accountId)
  };
};

/**
 * Connect to a banking provider and fetch accounts
 * @param {string} userId - User ID
 * @param {Object} connectionDetails - Connection details
 * @returns {Promise<Object>} Connection result
 */
const connectBankingProvider = async (userId, connectionDetails) => {
  // In a real implementation, this would connect to an actual banking API
  
  // For our mock implementation, we'll generate some accounts
  if (!mockUserBankData[userId]) {
    mockUserBankData[userId] = { accounts: [] };
  }
  
  // Select a random bank institution or use the one specified
  const institution = connectionDetails.provider 
    ? bankInstitutions.find(b => b.id === connectionDetails.provider) || bankInstitutions[0]
    : bankInstitutions[Math.floor(Math.random() * bankInstitutions.length)];
  
  // Generate 1-3 accounts for this institution
  const numAccounts = Math.floor(Math.random() * 3) + 1;
  const newAccounts = [];
  
  for (let i = 0; i < numAccounts; i++) {
    const account = generateBankAccount(userId, institution);
    mockUserBankData[userId].accounts.push(account);
    newAccounts.push(account);
  }
  
  return {
    success: true,
    connectionId: `conn_${Date.now()}`,
    institution: institution.name,
    accounts: newAccounts.map(acc => ({
      id: acc.id,
      name: acc.name,
      type: acc.type,
      balance: acc.balance,
      currency: acc.currency
    }))
  };
};

/**
 * Get all bank accounts for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User's bank accounts
 */
const getBankAccounts = async (userId) => {
  // In a real implementation, this would fetch from an actual banking API
  
  // For our mock implementation, return the stored accounts or generate some if none exist
  if (!mockUserBankData[userId] || mockUserBankData[userId].accounts.length === 0) {
    await connectBankingProvider(userId, {});
  }
  
  const accounts = mockUserBankData[userId].accounts.map(acc => ({
    id: acc.id,
    provider: acc.provider,
    providerName: acc.providerName,
    type: acc.type,
    name: acc.name,
    balance: acc.balance,
    currency: acc.currency,
    accountNumber: acc.accountNumber,
    lastUpdated: acc.lastUpdated
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
};

/**
 * Get transactions for a specific account
 * @param {string} userId - User ID
 * @param {string} accountId - Account ID
 * @param {Object} options - Filter options
 * @returns {Promise<Object>} Account transactions
 */
const getAccountTransactions = async (userId, accountId, options = {}) => {
  // In a real implementation, this would fetch from an actual banking API
  
  // For our mock implementation, return the stored transactions
  if (!mockUserBankData[userId]) {
    return { transactions: [] };
  }
  
  const account = mockUserBankData[userId].accounts.find(acc => acc.id === accountId);
  
  if (!account) {
    throw new Error('Account not found');
  }
  
  let transactions = [...account.transactions];
  
  // Apply date filters if provided
  if (options.startDate) {
    const startDate = new Date(options.startDate);
    transactions = transactions.filter(tx => new Date(tx.date) >= startDate);
  }
  
  if (options.endDate) {
    const endDate = new Date(options.endDate);
    transactions = transactions.filter(tx => new Date(tx.date) <= endDate);
  }
  
  // Apply category filter if provided
  if (options.category) {
    transactions = transactions.filter(tx => tx.category === options.category);
  }
  
  // Apply type filter if provided
  if (options.type) {
    transactions = transactions.filter(tx => tx.type === options.type);
  }
  
  // Sort by date (newest first)
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return {
    accountId,
    transactions
  };
};

/**
 * Analyze spending patterns
 * @param {string} userId - User ID
 * @param {string} accountId - Account ID (optional)
 * @returns {Promise<Object>} Spending analysis
 */
const analyzeSpending = async (userId, accountId = null) => {
  // In a real implementation, this would use actual transaction data
  
  if (!mockUserBankData[userId]) {
    return { categories: [] };
  }
  
  let transactions = [];
  
  if (accountId) {
    // Get transactions for specific account
    const account = mockUserBankData[userId].accounts.find(acc => acc.id === accountId);
    if (!account) {
      throw new Error('Account not found');
    }
    transactions = account.transactions;
  } else {
    // Get transactions for all accounts
    mockUserBankData[userId].accounts.forEach(account => {
      transactions = transactions.concat(account.transactions);
    });
  }
  
  // Filter to only include expenses (debit transactions)
  const expenses = transactions.filter(tx => tx.type === 'debit');
  
  // Group by category
  const categoryMap = {};
  expenses.forEach(tx => {
    if (!categoryMap[tx.category]) {
      categoryMap[tx.category] = 0;
    }
    categoryMap[tx.category] += tx.amount;
  });
  
  // Convert to array and sort by amount
  const categories = Object.keys(categoryMap).map(category => ({
    category,
    amount: parseFloat(categoryMap[category].toFixed(2)),
    percentage: parseFloat(((categoryMap[category] / expenses.reduce((sum, tx) => sum + tx.amount, 0)) * 100).toFixed(2))
  }));
  
  categories.sort((a, b) => b.amount - a.amount);
  
  return {
    totalSpent: parseFloat(expenses.reduce((sum, tx) => sum + tx.amount, 0).toFixed(2)),
    categories,
    timeframe: {
      startDate: transactions.length > 0 ? 
        new Date(Math.min(...transactions.map(tx => new Date(tx.date)))).toISOString() : 
        null,
      endDate: transactions.length > 0 ? 
        new Date(Math.max(...transactions.map(tx => new Date(tx.date)))).toISOString() : 
        null
    }
  };
};

module.exports = {
  connectBankingProvider,
  getBankAccounts,
  getAccountTransactions,
  analyzeSpending
};
