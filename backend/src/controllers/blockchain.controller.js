/**
 * Blockchain Controller
 * Handles API requests for blockchain interactions, NFT minting, and price data
 */
const blockchainService = require('../services/blockchain.service');

/**
 * Validate a wallet address
 * @route POST /api/blockchain/validate-address
 */
exports.validateAddress = async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({ message: 'Wallet address is required' });
    }
    
    const isValid = blockchainService.isValidAddress(address);
    res.json({ isValid });
  } catch (err) {
    console.error('Error validating wallet address:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * Get wallet information
 * @route GET /api/blockchain/wallet/:address
 */
exports.getWalletInfo = async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!address) {
      return res.status(400).json({ message: 'Wallet address is required' });
    }
    
    const walletInfo = await blockchainService.getWalletInfo(address);
    res.json(walletInfo);
  } catch (err) {
    console.error('Error getting wallet info:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * Mint a credit score NFT
 * @route POST /api/blockchain/mint-credit-score-nft
 */
exports.mintCreditScoreNFT = async (req, res) => {
  try {
    const { walletAddress, creditScore, additionalData } = req.body;
    
    // Use the authenticated user's ID
    const userId = req.user.id;
    
    if (!walletAddress) {
      return res.status(400).json({ message: 'Wallet address is required' });
    }
    
    if (!creditScore || isNaN(creditScore)) {
      return res.status(400).json({ message: 'Valid credit score is required' });
    }
    
    // Validate the wallet address
    const isValid = blockchainService.isValidAddress(walletAddress);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid wallet address' });
    }
    
    // Mint the NFT
    const result = await blockchainService.mintCreditScoreNFT(walletAddress, creditScore, additionalData || {});
    res.json(result);
  } catch (err) {
    console.error('Error minting credit score NFT:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * Get real-time price data for a cryptocurrency
 * @route GET /api/blockchain/price/:symbol
 */
exports.getCryptoPriceData = async (req, res) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol) {
      return res.status(400).json({ message: 'Cryptocurrency symbol is required' });
    }
    
    const priceData = await blockchainService.getCryptoPriceData(symbol);
    res.json(priceData);
  } catch (err) {
    console.error('Error getting cryptocurrency price data:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * Get historical price data for a cryptocurrency
 * @route GET /api/blockchain/historical-price/:symbol
 */
exports.getHistoricalPriceData = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { days } = req.query;
    
    if (!symbol) {
      return res.status(400).json({ message: 'Cryptocurrency symbol is required' });
    }
    
    const historicalData = await blockchainService.getHistoricalPriceData(symbol, days || '30');
    res.json(historicalData);
  } catch (err) {
    console.error('Error getting historical price data:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * Get smart contract activity
 * @route GET /api/blockchain/contract-activity/:address
 */
exports.getSmartContractActivity = async (req, res) => {
  try {
    const { address } = req.params;
    const { limit } = req.query;
    
    if (!address) {
      return res.status(400).json({ message: 'Contract address is required' });
    }
    
    const activity = await blockchainService.getSmartContractActivity(address, limit ? parseInt(limit) : 10);
    res.json(activity);
  } catch (err) {
    console.error('Error getting smart contract activity:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
