/**
 * Risk Analysis Service
 * Provides functionality for analyzing wallet risk, token volatility,
 * and predictive risk scoring.
 */

// Mock transaction data for demonstration purposes
const mockTransactions = {
  // High-risk wallet with many interactions with blacklisted contracts
  '0x8915BEab6cCaA2F486d8B1C36c7ec151F9C72F5E': [
    { type: 'swap', contract: '0xdead1234567890123456789012345678901234567', value: 0.5, timestamp: '2025-04-15T10:30:00Z' },
    { type: 'transfer', contract: '0xdead2345678901234567890123456789012345678', value: 1.2, timestamp: '2025-04-16T14:20:00Z' },
    { type: 'approve', contract: '0xdead3456789012345678901234567890123456789', value: 10, timestamp: '2025-04-17T09:15:00Z' },
    { type: 'swap', contract: '0xdead4567890123456789012345678901234567890', value: 2.3, timestamp: '2025-04-18T16:45:00Z' },
  ],
  // Medium-risk wallet with some suspicious activities
  '0x7825BEab6cCaA2F486d8B1C36c7ec151F9C72F5E': [
    { type: 'swap', contract: '0x1234567890123456789012345678901234567890', value: 1.0, timestamp: '2025-04-15T11:30:00Z' },
    { type: 'transfer', contract: '0xdead2345678901234567890123456789012345678', value: 0.5, timestamp: '2025-04-16T15:20:00Z' },
    { type: 'approve', contract: '0x2345678901234567890123456789012345678901', value: 5, timestamp: '2025-04-17T10:15:00Z' },
  ],
  // Low-risk wallet with normal activities
  '0x6735BEab6cCaA2F486d8B1C36c7ec151F9C72F5E': [
    { type: 'swap', contract: '0x1234567890123456789012345678901234567890', value: 0.2, timestamp: '2025-04-15T12:30:00Z' },
    { type: 'transfer', contract: '0x2345678901234567890123456789012345678901', value: 0.3, timestamp: '2025-04-16T16:20:00Z' },
    { type: 'approve', contract: '0x3456789012345678901234567890123456789012', value: 1, timestamp: '2025-04-17T11:15:00Z' },
  ],
};

// Mock blacklisted contracts for risk assessment
const blacklistedContracts = [
  '0xdead1234567890123456789012345678901234567',
  '0xdead2345678901234567890123456789012345678',
  '0xdead3456789012345678901234567890123456789',
  '0xdead4567890123456789012345678901234567890',
];

// Mock token price data for volatility analysis
const tokenPriceHistory = {
  'BTC': [
    { timestamp: '2025-04-01T00:00:00Z', price: 85000 },
    { timestamp: '2025-04-02T00:00:00Z', price: 86500 },
    { timestamp: '2025-04-03T00:00:00Z', price: 84200 },
    { timestamp: '2025-04-04T00:00:00Z', price: 87000 },
    { timestamp: '2025-04-05T00:00:00Z', price: 88500 },
    { timestamp: '2025-04-06T00:00:00Z', price: 89200 },
    { timestamp: '2025-04-07T00:00:00Z', price: 90100 },
    { timestamp: '2025-04-08T00:00:00Z', price: 91500 },
    { timestamp: '2025-04-09T00:00:00Z', price: 89800 },
    { timestamp: '2025-04-10T00:00:00Z', price: 92000 },
    { timestamp: '2025-04-11T00:00:00Z', price: 93500 },
    { timestamp: '2025-04-12T00:00:00Z', price: 94200 },
    { timestamp: '2025-04-13T00:00:00Z', price: 92800 },
    { timestamp: '2025-04-14T00:00:00Z', price: 95000 },
  ],
  'ETH': [
    { timestamp: '2025-04-01T00:00:00Z', price: 5200 },
    { timestamp: '2025-04-02T00:00:00Z', price: 5350 },
    { timestamp: '2025-04-03T00:00:00Z', price: 5100 },
    { timestamp: '2025-04-04T00:00:00Z', price: 5400 },
    { timestamp: '2025-04-05T00:00:00Z', price: 5600 },
    { timestamp: '2025-04-06T00:00:00Z', price: 5800 },
    { timestamp: '2025-04-07T00:00:00Z', price: 5750 },
    { timestamp: '2025-04-08T00:00:00Z', price: 5900 },
    { timestamp: '2025-04-09T00:00:00Z', price: 5650 },
    { timestamp: '2025-04-10T00:00:00Z', price: 6000 },
    { timestamp: '2025-04-11T00:00:00Z', price: 6200 },
    { timestamp: '2025-04-12T00:00:00Z', price: 6350 },
    { timestamp: '2025-04-13T00:00:00Z', price: 6100 },
    { timestamp: '2025-04-14T00:00:00Z', price: 6500 },
  ],
  'ARIES': [
    { timestamp: '2025-04-01T00:00:00Z', price: 2.5 },
    { timestamp: '2025-04-02T00:00:00Z', price: 2.8 },
    { timestamp: '2025-04-03T00:00:00Z', price: 2.3 },
    { timestamp: '2025-04-04T00:00:00Z', price: 3.1 },
    { timestamp: '2025-04-05T00:00:00Z', price: 3.5 },
    { timestamp: '2025-04-06T00:00:00Z', price: 3.2 },
    { timestamp: '2025-04-07T00:00:00Z', price: 3.8 },
    { timestamp: '2025-04-08T00:00:00Z', price: 4.2 },
    { timestamp: '2025-04-09T00:00:00Z', price: 3.9 },
    { timestamp: '2025-04-10T00:00:00Z', price: 4.5 },
    { timestamp: '2025-04-11T00:00:00Z', price: 5.0 },
    { timestamp: '2025-04-12T00:00:00Z', price: 4.7 },
    { timestamp: '2025-04-13T00:00:00Z', price: 5.2 },
    { timestamp: '2025-04-14T00:00:00Z', price: 5.5 },
  ],
};

/**
 * Analyze wallet risk based on transaction history and interactions
 * @param {string} address - Wallet address to analyze
 * @returns {Object} Risk analysis results
 */
const analyzeWalletRisk = async (address) => {
  // In a real implementation, we would:
  // 1. Fetch transaction history from blockchain APIs (Etherscan, The Graph, etc.)
  // 2. Analyze transaction patterns, interaction with known risky contracts
  // 3. Use ML models to predict risk based on historical data
  
  // For this demo, we'll use mock data
  let transactions = mockTransactions[address];
  
  // If we don't have mock data for this address, generate some random data
  if (!transactions) {
    // Generate random risk level for demo purposes
    const riskLevel = Math.random();
    if (riskLevel < 0.3) {
      // Low risk
      transactions = mockTransactions['0x6735BEab6cCaA2F486d8B1C36c7ec151F9C72F5E'];
    } else if (riskLevel < 0.7) {
      // Medium risk
      transactions = mockTransactions['0x7825BEab6cCaA2F486d8B1C36c7ec151F9C72F5E'];
    } else {
      // High risk
      transactions = mockTransactions['0x8915BEab6cCaA2F486d8B1C36c7ec151F9C72F5E'];
    }
  }
  
  // Count interactions with blacklisted contracts
  const blacklistedInteractions = transactions.filter(tx => 
    blacklistedContracts.includes(tx.contract)
  ).length;
  
  // Calculate risk metrics
  const totalTransactions = transactions.length;
  const riskPercentage = (blacklistedInteractions / totalTransactions) * 100;
  
  // Determine risk level
  let riskLevel;
  let riskScore;
  
  if (riskPercentage >= 50) {
    riskLevel = 'High';
    riskScore = 80 + (Math.random() * 20); // 80-100
  } else if (riskPercentage >= 20) {
    riskLevel = 'Medium';
    riskScore = 50 + (Math.random() * 30); // 50-80
  } else {
    riskLevel = 'Low';
    riskScore = 20 + (Math.random() * 30); // 20-50
  }
  
  // Generate risk factors
  const riskFactors = [];
  
  if (blacklistedInteractions > 0) {
    riskFactors.push({
      factor: 'Blacklisted Contracts',
      description: `Interacted with ${blacklistedInteractions} known high-risk contracts`,
      impact: 'High'
    });
  }
  
  if (transactions.some(tx => tx.value > 5)) {
    riskFactors.push({
      factor: 'Large Transactions',
      description: 'Multiple high-value transactions detected',
      impact: 'Medium'
    });
  }
  
  if (transactions.filter(tx => tx.type === 'approve').length > 2) {
    riskFactors.push({
      factor: 'Multiple Approvals',
      description: 'Granted approval to multiple contracts',
      impact: 'Medium'
    });
  }
  
  // Add some random risk factors for demonstration
  const additionalFactors = [
    {
      factor: 'New Wallet',
      description: 'Wallet created less than 30 days ago',
      impact: 'Low'
    },
    {
      factor: 'Mixing Services',
      description: 'Transactions associated with crypto mixing services',
      impact: 'High'
    },
    {
      factor: 'Unverified Contracts',
      description: 'Interactions with unverified smart contracts',
      impact: 'Medium'
    }
  ];
  
  // Add 1-2 random factors if we don't have enough
  if (riskFactors.length < 2) {
    const randomFactor = additionalFactors[Math.floor(Math.random() * additionalFactors.length)];
    if (!riskFactors.some(f => f.factor === randomFactor.factor)) {
      riskFactors.push(randomFactor);
    }
  }
  
  return {
    address,
    riskLevel,
    riskScore: Math.round(riskScore),
    analysisDate: new Date().toISOString(),
    transactions: {
      total: totalTransactions,
      suspicious: blacklistedInteractions
    },
    riskFactors,
    recommendations: [
      'Review wallet permissions and revoke unnecessary approvals',
      'Avoid interacting with unverified smart contracts',
      'Use hardware wallets for high-value transactions',
      'Enable multi-signature for critical operations'
    ]
  };
};

/**
 * Analyze token price volatility
 * @param {string} tokenSymbol - Token symbol (e.g., BTC, ETH)
 * @param {number} days - Number of days to analyze
 * @returns {Object} Volatility analysis results
 */
const getTokenVolatility = async (tokenSymbol, days = 14) => {
  // In a real implementation, we would:
  // 1. Fetch historical price data from APIs like CoinGecko or CryptoCompare
  // 2. Calculate volatility metrics (standard deviation, etc.)
  // 3. Compare with market benchmarks
  
  // For this demo, we'll use mock data
  const priceData = tokenPriceHistory[tokenSymbol.toUpperCase()];
  
  if (!priceData) {
    // Generate random data if we don't have mock data for this token
    const basePrice = 10 + Math.random() * 90;
    const mockData = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      
      // Generate price with some randomness
      const volatilityFactor = 0.1; // 10% daily volatility
      const randomChange = (Math.random() * 2 - 1) * volatilityFactor;
      const price = basePrice * (1 + randomChange);
      
      mockData.push({
        timestamp: date.toISOString(),
        price: price
      });
    }
    
    return calculateVolatilityMetrics(tokenSymbol, mockData);
  }
  
  return calculateVolatilityMetrics(tokenSymbol, priceData.slice(-days));
};

/**
 * Calculate volatility metrics from price data
 * @param {string} tokenSymbol - Token symbol
 * @param {Array} priceData - Array of price data points
 * @returns {Object} Volatility metrics
 */
const calculateVolatilityMetrics = (tokenSymbol, priceData) => {
  // Calculate daily returns
  const returns = [];
  for (let i = 1; i < priceData.length; i++) {
    const dailyReturn = (priceData[i].price - priceData[i-1].price) / priceData[i-1].price;
    returns.push(dailyReturn);
  }
  
  // Calculate standard deviation (volatility)
  const mean = returns.reduce((sum, value) => sum + value, 0) / returns.length;
  const variance = returns.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  
  // Annualized volatility (assuming 365 trading days)
  const annualizedVolatility = stdDev * Math.sqrt(365);
  
  // Calculate max drawdown
  let maxDrawdown = 0;
  let peak = priceData[0].price;
  
  for (const dataPoint of priceData) {
    if (dataPoint.price > peak) {
      peak = dataPoint.price;
    }
    
    const drawdown = (peak - dataPoint.price) / peak;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }
  
  // Determine volatility level
  let volatilityLevel;
  if (annualizedVolatility > 1.0) {
    volatilityLevel = 'Extreme';
  } else if (annualizedVolatility > 0.5) {
    volatilityLevel = 'High';
  } else if (annualizedVolatility > 0.25) {
    volatilityLevel = 'Medium';
  } else {
    volatilityLevel = 'Low';
  }
  
  // Current price trend
  const recentPrices = priceData.slice(-5);
  const priceChange = (recentPrices[recentPrices.length - 1].price - recentPrices[0].price) / recentPrices[0].price;
  const trend = priceChange > 0 ? 'Upward' : priceChange < 0 ? 'Downward' : 'Stable';
  
  return {
    token: tokenSymbol,
    currentPrice: priceData[priceData.length - 1].price,
    volatilityDaily: stdDev,
    volatilityAnnualized: annualizedVolatility,
    volatilityLevel,
    maxDrawdown,
    trend,
    priceChange: priceChange * 100, // as percentage
    analysisDate: new Date().toISOString(),
    historicalPrices: priceData.map(data => ({
      date: new Date(data.timestamp).toISOString().split('T')[0],
      price: data.price
    }))
  };
};

/**
 * Calculate Value at Risk (VaR) for a portfolio
 * @param {Array} holdings - Array of token holdings with amounts
 * @param {number} confidenceLevel - Confidence level (0.95, 0.99, etc.)
 * @returns {Object} VaR calculation results
 */
const calculateVaR = async (holdings, confidenceLevel = 0.95) => {
  // In a real implementation, we would:
  // 1. Fetch historical price data for all tokens in the portfolio
  // 2. Calculate returns correlation matrix
  // 3. Use Monte Carlo simulation or historical method to calculate VaR
  
  // For this demo, we'll use a simplified approach
  const portfolioValue = holdings.reduce((total, holding) => {
    // Get current price (mock)
    const tokenData = tokenPriceHistory[holding.token.toUpperCase()];
    const currentPrice = tokenData ? 
      tokenData[tokenData.length - 1].price : 
      10 + Math.random() * 90; // Random price if token not in our mock data
      
    return total + (holding.amount * currentPrice);
  }, 0);
  
  // Get volatility for each token
  const tokenVolatilities = await Promise.all(
    holdings.map(async holding => {
      const volatilityData = await getTokenVolatility(holding.token);
      return {
        token: holding.token,
        volatility: volatilityData.volatilityDaily,
        weight: (holding.amount * volatilityData.currentPrice) / portfolioValue
      };
    })
  );
  
  // Calculate portfolio volatility (simplified, ignoring correlations)
  const portfolioVolatility = Math.sqrt(
    tokenVolatilities.reduce((sum, token) => {
      return sum + Math.pow(token.volatility * token.weight, 2);
    }, 0)
  );
  
  // Calculate VaR using normal distribution assumption
  // For 95% confidence, z-score is approximately 1.645
  // For 99% confidence, z-score is approximately 2.326
  const zScore = confidenceLevel === 0.99 ? 2.326 : 1.645;
  const dailyVaR = portfolioValue * portfolioVolatility * zScore;
  
  // Calculate different time horizons
  const weeklyVaR = dailyVaR * Math.sqrt(7);
  const monthlyVaR = dailyVaR * Math.sqrt(30);
  
  return {
    portfolioValue,
    confidenceLevel: confidenceLevel * 100, // as percentage
    dailyVaR: {
      amount: dailyVaR,
      percentage: (dailyVaR / portfolioValue) * 100
    },
    weeklyVaR: {
      amount: weeklyVaR,
      percentage: (weeklyVaR / portfolioValue) * 100
    },
    monthlyVaR: {
      amount: monthlyVaR,
      percentage: (monthlyVaR / portfolioValue) * 100
    },
    riskLevel: dailyVaR / portfolioValue > 0.05 ? 'High' : 
               dailyVaR / portfolioValue > 0.02 ? 'Medium' : 'Low',
    analysisDate: new Date().toISOString(),
    holdings: holdings.map(holding => {
      const matchingVolatility = tokenVolatilities.find(v => v.token === holding.token);
      return {
        ...holding,
        volatility: matchingVolatility ? matchingVolatility.volatility : 0,
        weight: matchingVolatility ? matchingVolatility.weight : 0
      };
    })
  };
};

/**
 * Calculate Sharpe Ratio for a portfolio or token
 * @param {string|Array} tokenOrHoldings - Token symbol or array of holdings
 * @param {number} riskFreeRate - Annual risk-free rate (e.g., 0.04 for 4%)
 * @returns {Object} Sharpe ratio calculation results
 */
const calculateSharpe = async (tokenOrHoldings, riskFreeRate = 0.04) => {
  // In a real implementation, we would:
  // 1. Fetch historical price data
  // 2. Calculate returns and standard deviation
  // 3. Compare with risk-free rate
  
  // For this demo, we'll use a simplified approach
  let returns, volatility, currentValue;
  
  // Daily risk-free rate
  const dailyRiskFreeRate = Math.pow(1 + riskFreeRate, 1/365) - 1;
  
  if (typeof tokenOrHoldings === 'string') {
    // Single token
    const tokenData = await getTokenVolatility(tokenOrHoldings);
    
    // Calculate average daily return from historical prices
    const prices = tokenData.historicalPrices;
    returns = [];
    
    for (let i = 1; i < prices.length; i++) {
      const dailyReturn = (prices[i].price - prices[i-1].price) / prices[i-1].price;
      returns.push(dailyReturn);
    }
    
    const averageReturn = returns.reduce((sum, value) => sum + value, 0) / returns.length;
    volatility = tokenData.volatilityDaily;
    currentValue = prices[prices.length - 1].price;
    
    // Calculate Sharpe ratio
    const dailySharpe = (averageReturn - dailyRiskFreeRate) / volatility;
    const annualizedSharpe = dailySharpe * Math.sqrt(365);
    
    return {
      token: tokenOrHoldings,
      currentPrice: currentValue,
      averageDailyReturn: averageReturn,
      volatilityDaily: volatility,
      sharpeRatioDaily: dailySharpe,
      sharpeRatioAnnualized: annualizedSharpe,
      riskAdjustedPerformance: annualizedSharpe > 1 ? 'Good' : 
                               annualizedSharpe > 0 ? 'Neutral' : 'Poor',
      analysisDate: new Date().toISOString()
    };
  } else {
    // Portfolio of holdings
    const holdingsData = await Promise.all(
      tokenOrHoldings.map(async holding => {
        const tokenData = await getTokenVolatility(holding.token);
        return {
          ...holding,
          currentPrice: tokenData.currentPrice,
          volatility: tokenData.volatilityDaily,
          historicalPrices: tokenData.historicalPrices
        };
      })
    );
    
    // Calculate portfolio value
    const portfolioValue = holdingsData.reduce((total, holding) => {
      return total + (holding.amount * holding.currentPrice);
    }, 0);
    
    // Calculate portfolio returns and volatility
    const portfolioReturns = [];
    const days = holdingsData[0].historicalPrices.length;
    
    for (let day = 1; day < days; day++) {
      let dayReturn = 0;
      
      for (const holding of holdingsData) {
        const weight = (holding.amount * holding.currentPrice) / portfolioValue;
        const prices = holding.historicalPrices;
        const dailyReturn = (prices[day].price - prices[day-1].price) / prices[day-1].price;
        dayReturn += dailyReturn * weight;
      }
      
      portfolioReturns.push(dayReturn);
    }
    
    const averageReturn = portfolioReturns.reduce((sum, value) => sum + value, 0) / portfolioReturns.length;
    
    // Calculate portfolio volatility (simplified, ignoring correlations)
    volatility = Math.sqrt(
      holdingsData.reduce((sum, holding) => {
        const weight = (holding.amount * holding.currentPrice) / portfolioValue;
        return sum + Math.pow(holding.volatility * weight, 2);
      }, 0)
    );
    
    // Calculate Sharpe ratio
    const dailySharpe = (averageReturn - dailyRiskFreeRate) / volatility;
    const annualizedSharpe = dailySharpe * Math.sqrt(365);
    
    return {
      portfolioValue,
      averageDailyReturn: averageReturn,
      volatilityDaily: volatility,
      sharpeRatioDaily: dailySharpe,
      sharpeRatioAnnualized: annualizedSharpe,
      riskAdjustedPerformance: annualizedSharpe > 1 ? 'Good' : 
                               annualizedSharpe > 0 ? 'Neutral' : 'Poor',
      analysisDate: new Date().toISOString(),
      holdings: holdingsData.map(holding => ({
        token: holding.token,
        amount: holding.amount,
        value: holding.amount * holding.currentPrice,
        weight: (holding.amount * holding.currentPrice) / portfolioValue,
        volatility: holding.volatility
      }))
    };
  }
};

module.exports = {
  analyzeWalletRisk,
  getTokenVolatility,
  calculateVaR,
  calculateSharpe
};
