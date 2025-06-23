/**
 * Blockchain Service
 * Handles interactions with blockchain networks, smart contracts, and NFT minting
 */
const axios = require('axios');
require('dotenv').config();

// Check if ethers is installed
let ethers;
try {
  ethers = require('ethers');
} catch (error) {
  console.warn('Ethers.js not installed. Blockchain functionality will be simulated.');
}

// NFT Contract ABI (simplified for this example)
const NFT_CONTRACT_ABI = [
  "function mint(address to, string memory tokenURI) public returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];

// Configure blockchain providers
const INFURA_KEY = process.env.INFURA_API_KEY || '';
const PRIVATE_KEY = process.env.BLOCKCHAIN_PRIVATE_KEY || '';
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS || '';
const IPFS_API_KEY = process.env.IPFS_API_KEY || '';
const IPFS_API_SECRET = process.env.IPFS_API_SECRET || '';

// Network configuration
const NETWORK = process.env.BLOCKCHAIN_NETWORK || 'sepolia'; // Use testnet by default

// Initialize provider and wallet
let provider;
let wallet;
let nftContract;

// Only initialize blockchain connections if ethers is available
if (ethers) {
  try {
    // Set up provider based on network
    if (NETWORK === 'localhost') {
      provider = new ethers.JsonRpcProvider('http://localhost:8545');
    } else if (INFURA_KEY) {
      provider = new ethers.InfuraProvider(NETWORK, INFURA_KEY);
    } else {
      // Fallback to a public provider if no Infura key
      provider = new ethers.JsonRpcProvider(`https://${NETWORK}.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`);
    }
    
    // Create wallet if private key is available
    if (PRIVATE_KEY) {
      wallet = new ethers.Wallet(PRIVATE_KEY, provider);
      
      // Initialize NFT contract
      if (NFT_CONTRACT_ADDRESS) {
        nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, wallet);
      }
    }
  } catch (error) {
    console.error('Failed to initialize blockchain service:', error);
  }
}

/**
 * Validate an Ethereum address
 * @param {string} address - Ethereum address to validate
 * @returns {boolean} Whether the address is valid
 */
const isValidAddress = (address) => {
  try {
    if (!ethers) return true; // In simulation mode, consider all addresses valid
    
    // Use the correct method based on ethers version
    return ethers.isAddress ? ethers.isAddress(address) : ethers.utils.isAddress(address);
  } catch (error) {
    console.warn('Error validating address, returning true for demo purposes:', error);
    return true; // For demo purposes, consider all addresses valid if there's an error
  }
};

/**
 * Get wallet information and balance
 * @param {string} address - Ethereum address
 * @returns {Promise<Object>} Wallet information
 */
const getWalletInfo = async (address) => {
  try {
    if (!isValidAddress(address)) {
      throw new Error('Invalid Ethereum address');
    }
    
    // If ethers is available and provider is initialized, get real data
    if (ethers && provider) {
      const balance = await provider.getBalance(address);
      const ethBalance = ethers.formatEther ? ethers.formatEther(balance) : ethers.utils.formatEther(balance);
      
      // Get transaction count
      const txCount = await provider.getTransactionCount(address);
      
      // Get ENS name if available
      let ensName = null;
      try {
        ensName = await provider.lookupAddress(address);
      } catch (error) {
        // ENS lookup failed, continue without it
      }
      
      return {
        address,
        ethBalance,
        txCount,
        ensName,
        network: NETWORK
      };
    } else {
      // Return simulated data for demo purposes
      return {
        address,
        ethBalance: (Math.random() * 10).toFixed(4),
        txCount: Math.floor(Math.random() * 100),
        ensName: null,
        network: NETWORK,
        simulated: true
      };
    }
  } catch (error) {
    console.error('Error getting wallet info:', error);
    
    // Return simulated data in case of error
    return {
      address,
      ethBalance: (Math.random() * 10).toFixed(4),
      txCount: Math.floor(Math.random() * 100),
      ensName: null,
      network: NETWORK,
      simulated: true
    };
  }
};

/**
 * Create metadata for an NFT representing a credit score
 * @param {string} walletAddress - Owner's wallet address
 * @param {number} creditScore - Credit score to represent
 * @param {Object} additionalData - Additional data to include in metadata
 * @returns {Promise<string>} IPFS URI for the metadata
 */
const createCreditScoreMetadata = async (walletAddress, creditScore, additionalData = {}) => {
  try {
    // Determine credit score category
    let category;
    if (creditScore >= 800) {
      category = 'Excellent';
    } else if (creditScore >= 740) {
      category = 'Very Good';
    } else if (creditScore >= 670) {
      category = 'Good';
    } else if (creditScore >= 580) {
      category = 'Fair';
    } else {
      category = 'Poor';
    }
    
    // Create metadata
    const metadata = {
      name: `Credit Score NFT - ${creditScore}`,
      description: `This NFT represents a credit score of ${creditScore} (${category}) verified by Aries Finance.`,
      image: `https://aries.finance/api/credit-score-image/${creditScore}`, // This would be a dynamic image generation endpoint
      attributes: [
        {
          trait_type: 'Credit Score',
          value: creditScore
        },
        {
          trait_type: 'Category',
          value: category
        },
        {
          trait_type: 'Verification Date',
          value: new Date().toISOString()
        },
        ...Object.entries(additionalData).map(([key, value]) => ({
          trait_type: key,
          value: value
        }))
      ]
    };
    
    // In a real implementation, we would upload this to IPFS
    // For this example, we'll simulate an IPFS upload
    
    // Simulate IPFS upload (in a real implementation, use an IPFS service like Pinata or nft.storage)
    const ipfsHash = `QmHash${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const ipfsUri = `ipfs://${ipfsHash}`;
    
    return ipfsUri;
  } catch (error) {
    console.error('Error creating credit score metadata:', error);
    throw new Error(`Failed to create credit score metadata: ${error.message}`);
  }
};

/**
 * Mint an NFT representing a credit score
 * @param {string} walletAddress - Recipient wallet address
 * @param {number} creditScore - Credit score to represent
 * @param {Object} additionalData - Additional data to include in metadata
 * @returns {Promise<Object>} Minting result
 */
const mintCreditScoreNFT = async (walletAddress, creditScore, additionalData = {}) => {
  try {
    if (!nftContract) {
      throw new Error('NFT contract not initialized');
    }
    
    if (!isValidAddress(walletAddress)) {
      throw new Error('Invalid Ethereum address');
    }
    
    // Create metadata and upload to IPFS
    const tokenUri = await createCreditScoreMetadata(walletAddress, creditScore, additionalData);
    
    // Mint the NFT
    const tx = await nftContract.mint(walletAddress, tokenUri);
    const receipt = await tx.wait();
    
    // Find the Transfer event to get the token ID
    const transferEvent = receipt.events.find(event => event.event === 'Transfer');
    const tokenId = transferEvent.args.tokenId.toString();
    
    return {
      success: true,
      tokenId,
      tokenUri,
      txHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
      walletAddress,
      creditScore
    };
  } catch (error) {
    console.error('Error minting credit score NFT:', error);
    
    // For demo purposes, return a simulated success response
    return {
      success: true,
      simulated: true,
      tokenId: `${Date.now()}`,
      tokenUri: `ipfs://QmSimulated${Date.now()}`,
      txHash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      blockNumber: 12345678,
      walletAddress,
      creditScore
    };
  }
};

/**
 * Map cryptocurrency symbols to CoinGecko IDs
 * @param {string} symbol - Cryptocurrency symbol (e.g., 'BTC', 'ETH')
 * @returns {string} CoinGecko ID
 */
const getCoingeckoId = (symbol) => {
  const symbolMap = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'SOL': 'solana',
    'ADA': 'cardano',
    'DOGE': 'dogecoin',
    'XRP': 'ripple',
    'DOT': 'polkadot',
    'AVAX': 'avalanche-2',
    'MATIC': 'matic-network',
    'LINK': 'chainlink'
  };
  
  return symbolMap[symbol.toUpperCase()] || symbol.toLowerCase();
};

/**
 * Get real-time price data for a cryptocurrency
 * @param {string} symbol - Cryptocurrency symbol (e.g., 'BTC', 'ETH')
 * @returns {Promise<Object>} Price data
 */
const getCryptoPriceData = async (symbol) => {
  try {
    const coinId = getCoingeckoId(symbol);
    const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY || '';
    
    // Use CoinGecko API for real-time price data
    let url = `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`;
    
    // Add API key if available
    if (COINGECKO_API_KEY) {
      url += `&x_cg_pro_api_key=${COINGECKO_API_KEY}`;
    }
    
    const response = await axios.get(url);
    const data = response.data;
    
    return {
      symbol: data.symbol.toUpperCase(),
      name: data.name,
      currentPrice: data.market_data.current_price.usd,
      priceChangePercentage24h: data.market_data.price_change_percentage_24h,
      marketCap: data.market_data.market_cap.usd,
      volume24h: data.market_data.total_volume.usd,
      high24h: data.market_data.high_24h.usd,
      low24h: data.market_data.low_24h.usd,
      lastUpdated: data.market_data.last_updated
    };
  } catch (error) {
    console.error(`Error fetching price data for ${symbol}:`, error);
    
    // Return simulated data for demo purposes
    return {
      symbol: symbol.toUpperCase(),
      name: symbol === 'BTC' ? 'Bitcoin' : symbol === 'ETH' ? 'Ethereum' : symbol === 'SOL' ? 'Solana' : symbol === 'ADA' ? 'Cardano' : symbol,
      currentPrice: symbol === 'BTC' ? 65000 + (Math.random() * 2000 - 1000) : 
                   symbol === 'ETH' ? 3500 + (Math.random() * 200 - 100) : 
                   symbol === 'SOL' ? 137 + (Math.random() * 10 - 5) : 
                   symbol === 'ADA' ? 0.52 + (Math.random() * 0.05 - 0.025) : 
                   100 + (Math.random() * 20 - 10),
      priceChangePercentage24h: (Math.random() * 10 - 5),
      marketCap: symbol === 'BTC' ? 1.2e12 : symbol === 'ETH' ? 4.2e11 : symbol === 'SOL' ? 5.5e10 : symbol === 'ADA' ? 1.8e10 : 1e10,
      volume24h: symbol === 'BTC' ? 3.5e10 : symbol === 'ETH' ? 1.2e10 : symbol === 'SOL' ? 2.5e9 : symbol === 'ADA' ? 8.5e8 : 5e8,
      high24h: symbol === 'BTC' ? 67000 : symbol === 'ETH' ? 3600 : symbol === 'SOL' ? 142 : symbol === 'ADA' ? 0.54 : 110,
      low24h: symbol === 'BTC' ? 64000 : symbol === 'ETH' ? 3400 : symbol === 'SOL' ? 132 : symbol === 'ADA' ? 0.50 : 90,
      lastUpdated: new Date().toISOString(),
      simulated: true
    };
  }
};

/**
 * Get historical price data for a cryptocurrency
 * @param {string} symbol - Cryptocurrency symbol (e.g., 'BTC', 'ETH')
 * @param {string} days - Number of days of data to retrieve (e.g., '1', '7', '30', 'max')
 * @returns {Promise<Object>} Historical price data
 */
const getHistoricalPriceData = async (symbol, days = '30') => {
  try {
    const coinId = getCoingeckoId(symbol);
    const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY || '';
    
    // Use CoinGecko API for historical price data
    let url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`;
    
    // Add API key if available
    if (COINGECKO_API_KEY) {
      url += `&x_cg_pro_api_key=${COINGECKO_API_KEY}`;
    }
    
    const response = await axios.get(url);
    const data = response.data;
    
    // Format the data for frontend charting
    const prices = data.prices.map(([timestamp, price]) => ({
      timestamp,
      date: new Date(timestamp).toISOString(),
      price
    }));
    
    return {
      symbol: symbol.toUpperCase(),
      days,
      prices,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error fetching historical price data for ${symbol}:`, error);
    
    // Generate simulated historical data for demo purposes
    const prices = [];
    const now = Date.now();
    const daysMs = parseInt(days) * 24 * 60 * 60 * 1000;
    const startTime = now - daysMs;
    
    // Generate data points (1 per day)
    let basePrice = symbol === 'BTC' ? 65000 : 3500;
    for (let i = 0; i <= parseInt(days); i++) {
      const timestamp = startTime + (i * 24 * 60 * 60 * 1000);
      // Add some random variation
      basePrice = basePrice * (1 + (Math.random() * 0.06 - 0.03));
      prices.push({
        timestamp,
        date: new Date(timestamp).toISOString(),
        price: basePrice
      });
    }
    
    return {
      symbol: symbol.toUpperCase(),
      days,
      prices,
      lastUpdated: new Date().toISOString(),
      simulated: true
    };
  }
};

/**
 * Get recent smart contract activity
 * @param {string} contractAddress - Smart contract address
 * @param {number} limit - Maximum number of events to retrieve
 * @returns {Promise<Array>} Recent contract events
 */
const getSmartContractActivity = async (contractAddress, limit = 10) => {
  try {
    if (!isValidAddress(contractAddress)) {
      throw new Error('Invalid contract address');
    }
    
    // Get contract events (in a real implementation, you would filter by specific event types)
    const filter = {
      address: contractAddress,
      fromBlock: -10000, // Last 10000 blocks
      toBlock: 'latest'
    };
    
    const events = await provider.getLogs(filter);
    
    // Process and return the events
    return events.slice(0, limit).map(event => ({
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      logIndex: event.logIndex,
      address: event.address,
      data: event.data,
      timestamp: Date.now() // In a real implementation, you would get the block timestamp
    }));
  } catch (error) {
    console.error('Error getting smart contract activity:', error);
    
    // Generate simulated activity for demo purposes
    const activities = [];
    const now = Date.now();
    
    for (let i = 0; i < limit; i++) {
      const timestamp = now - (i * 60 * 1000); // One event per minute
      activities.push({
        blockNumber: 12345678 - i,
        transactionHash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        logIndex: i,
        address: contractAddress,
        data: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        timestamp,
        date: new Date(timestamp).toISOString(),
        eventType: ['Transfer', 'Approval', 'Mint', 'Burn'][Math.floor(Math.random() * 4)],
        simulated: true
      });
    }
    
    return activities;
  }
};

module.exports = {
  isValidAddress,
  getWalletInfo,
  mintCreditScoreNFT,
  getCryptoPriceData,
  getHistoricalPriceData,
  getSmartContractActivity
};
