/**
 * Risk Controller
 * Handles API requests for risk analysis features including wallet risk profiling,
 * token volatility tracking, and predictive risk scoring.
 */
const riskService = require('../services/risk.service');

/**
 * Analyze wallet risk profile
 * @route GET /api/risk/wallet/:address
 */
exports.analyzeWalletRisk = async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!address) {
      return res.status(400).json({ message: 'Wallet address is required' });
    }
    
    // Validate Ethereum address format
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!addressRegex.test(address)) {
      return res.status(400).json({ message: 'Invalid Ethereum address format' });
    }
    
    const riskAnalysis = await riskService.analyzeWalletRisk(address);
    res.json(riskAnalysis);
  } catch (err) {
    console.error('Error analyzing wallet risk:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * Get token volatility analysis
 * @route GET /api/risk/volatility/:token
 */
exports.getTokenVolatility = async (req, res) => {
  try {
    const { token } = req.params;
    const days = req.query.days ? parseInt(req.query.days) : 14;
    
    if (!token) {
      return res.status(400).json({ message: 'Token symbol is required' });
    }
    
    if (isNaN(days) || days < 1 || days > 365) {
      return res.status(400).json({ message: 'Days parameter must be between 1 and 365' });
    }
    
    const volatilityAnalysis = await riskService.getTokenVolatility(token, days);
    res.json(volatilityAnalysis);
  } catch (err) {
    console.error('Error analyzing token volatility:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * Calculate Value at Risk (VaR) for a portfolio
 * @route POST /api/risk/var
 */
exports.calculateVaR = async (req, res) => {
  try {
    const { holdings, confidenceLevel } = req.body;
    
    if (!holdings || !Array.isArray(holdings) || holdings.length === 0) {
      return res.status(400).json({ message: 'Valid holdings array is required' });
    }
    
    // Validate holdings format
    for (const holding of holdings) {
      if (!holding.token || typeof holding.amount !== 'number' || holding.amount <= 0) {
        return res.status(400).json({ 
          message: 'Each holding must have a token symbol and a positive amount',
          example: { token: 'ETH', amount: 2.5 }
        });
      }
    }
    
    // Validate confidence level if provided
    let confLevel = 0.95; // Default
    if (confidenceLevel) {
      confLevel = parseFloat(confidenceLevel);
      if (isNaN(confLevel) || confLevel <= 0 || confLevel >= 1) {
        return res.status(400).json({ message: 'Confidence level must be between 0 and 1' });
      }
    }
    
    const varAnalysis = await riskService.calculateVaR(holdings, confLevel);
    res.json(varAnalysis);
  } catch (err) {
    console.error('Error calculating VaR:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * Calculate Sharpe Ratio for a portfolio or token
 * @route POST /api/risk/sharpe
 */
exports.calculateSharpe = async (req, res) => {
  try {
    const { token, holdings, riskFreeRate } = req.body;
    
    // Validate input - either token or holdings must be provided
    if (!token && (!holdings || !Array.isArray(holdings) || holdings.length === 0)) {
      return res.status(400).json({ 
        message: 'Either a token symbol or valid holdings array is required',
        examples: {
          singleToken: { token: 'ETH', riskFreeRate: 0.04 },
          portfolio: { 
            holdings: [
              { token: 'BTC', amount: 0.5 },
              { token: 'ETH', amount: 10 }
            ],
            riskFreeRate: 0.04
          }
        }
      });
    }
    
    // Validate holdings format if provided
    if (holdings) {
      for (const holding of holdings) {
        if (!holding.token || typeof holding.amount !== 'number' || holding.amount <= 0) {
          return res.status(400).json({ 
            message: 'Each holding must have a token symbol and a positive amount',
            example: { token: 'ETH', amount: 2.5 }
          });
        }
      }
    }
    
    // Validate risk-free rate if provided
    let rfRate = 0.04; // Default 4%
    if (riskFreeRate !== undefined) {
      rfRate = parseFloat(riskFreeRate);
      if (isNaN(rfRate) || rfRate < 0 || rfRate > 1) {
        return res.status(400).json({ message: 'Risk-free rate must be between 0 and 1' });
      }
    }
    
    // Calculate Sharpe ratio
    const sharpeAnalysis = await riskService.calculateSharpe(
      token || holdings,
      rfRate
    );
    
    res.json(sharpeAnalysis);
  } catch (err) {
    console.error('Error calculating Sharpe ratio:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * Get hybrid risk analysis (combining crypto and traditional finance)
 * @route POST /api/risk/hybrid
 */
exports.getHybridRiskAnalysis = async (req, res) => {
  try {
    const { cryptoHoldings, traditionalAssets } = req.body;
    
    if (!cryptoHoldings || !Array.isArray(cryptoHoldings) || cryptoHoldings.length === 0) {
      return res.status(400).json({ message: 'Valid crypto holdings array is required' });
    }
    
    if (!traditionalAssets || !Array.isArray(traditionalAssets) || traditionalAssets.length === 0) {
      return res.status(400).json({ message: 'Valid traditional assets array is required' });
    }
    
    // Validate crypto holdings format
    for (const holding of cryptoHoldings) {
      if (!holding.token || typeof holding.amount !== 'number' || holding.amount <= 0) {
        return res.status(400).json({ 
          message: 'Each crypto holding must have a token symbol and a positive amount',
          example: { token: 'ETH', amount: 2.5 }
        });
      }
    }
    
    // Validate traditional assets format
    for (const asset of traditionalAssets) {
      if (!asset.type || typeof asset.value !== 'number' || asset.value <= 0) {
        return res.status(400).json({ 
          message: 'Each traditional asset must have a type and a positive value',
          example: { type: 'stock', ticker: 'AAPL', value: 10000 }
        });
      }
    }
    
    // Calculate crypto portfolio metrics
    const cryptoVaR = await riskService.calculateVaR(cryptoHoldings);
    const cryptoSharpe = await riskService.calculateSharpe(cryptoHoldings);
    
    // Mock traditional finance risk metrics
    // In a real implementation, we would calculate these using actual market data
    const traditionalValue = traditionalAssets.reduce((sum, asset) => sum + asset.value, 0);
    const traditionalRisk = Math.random() * 0.15; // Random daily volatility between 0-15%
    const traditionalReturn = 0.08 + (Math.random() * 0.1); // Random annual return between 8-18%
    
    // Calculate combined portfolio metrics
    const totalValue = cryptoVaR.portfolioValue + traditionalValue;
    const cryptoWeight = cryptoVaR.portfolioValue / totalValue;
    const traditionalWeight = traditionalValue / totalValue;
    
    // Weighted risk calculation (simplified)
    const combinedRisk = (cryptoVaR.dailyVaR.percentage / 100) * cryptoWeight + 
                         traditionalRisk * traditionalWeight;
    
    // Determine correlation factor (typically crypto and traditional have low correlation)
    const correlation = -0.2 + (Math.random() * 0.4); // Random correlation between -0.2 and 0.2
    
    // Diversification benefit
    const diversificationBenefit = 1 - Math.sqrt(
      Math.pow(cryptoWeight, 2) + 
      Math.pow(traditionalWeight, 2) + 
      2 * cryptoWeight * traditionalWeight * correlation
    );
    
    // Calculate risk-adjusted return
    const combinedReturn = (cryptoSharpe.averageDailyReturn * 365) * cryptoWeight + 
                           traditionalReturn * traditionalWeight;
    
    const hybridSharpe = (combinedReturn - 0.04) / (combinedRisk * Math.sqrt(365));
    
    // Determine risk level
    let riskLevel;
    if (combinedRisk > 0.03) {
      riskLevel = 'High';
    } else if (combinedRisk > 0.015) {
      riskLevel = 'Medium';
    } else {
      riskLevel = 'Low';
    }
    
    // Generate recommendations based on portfolio composition
    const recommendations = [];
    
    if (cryptoWeight > 0.5) {
      recommendations.push('Consider reducing crypto exposure to decrease overall portfolio volatility');
    }
    
    if (diversificationBenefit < 0.2) {
      recommendations.push('Increase diversification across asset classes to improve risk-adjusted returns');
    }
    
    if (hybridSharpe < 0.5) {
      recommendations.push('Review asset allocation to improve risk-adjusted performance');
    }
    
    if (combinedRisk > 0.025) {
      recommendations.push('Consider hedging strategies to reduce downside risk');
    }
    
    // Construct response
    const hybridAnalysis = {
      totalPortfolioValue: totalValue,
      cryptoAllocation: {
        value: cryptoVaR.portfolioValue,
        percentage: cryptoWeight * 100
      },
      traditionalAllocation: {
        value: traditionalValue,
        percentage: traditionalWeight * 100
      },
      riskMetrics: {
        combinedRisk: combinedRisk * 100, // as percentage
        diversificationBenefit: diversificationBenefit * 100, // as percentage
        correlation,
        riskLevel
      },
      returnMetrics: {
        expectedAnnualReturn: combinedReturn * 100, // as percentage
        sharpeRatio: hybridSharpe
      },
      recommendations,
      analysisDate: new Date().toISOString(),
      cryptoHoldings: cryptoHoldings.map(holding => {
        const matchingHolding = cryptoSharpe.holdings.find(h => h.token === holding.token);
        return {
          token: holding.token,
          amount: holding.amount,
          value: matchingHolding ? matchingHolding.value : 0,
          weight: (matchingHolding ? matchingHolding.value : 0) / totalValue * 100, // as percentage
          volatility: matchingHolding ? matchingHolding.volatility * 100 : 0 // as percentage
        };
      }),
      traditionalAssets: traditionalAssets.map(asset => ({
        ...asset,
        weight: asset.value / totalValue * 100 // as percentage
      }))
    };
    
    res.json(hybridAnalysis);
  } catch (err) {
    console.error('Error calculating hybrid risk analysis:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
