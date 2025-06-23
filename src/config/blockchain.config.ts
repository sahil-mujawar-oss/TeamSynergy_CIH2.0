/**
 * Blockchain Configuration
 * Contains network configurations and provider endpoints for different blockchains
 */

export interface NetworkConfig {
  chainId: number;
  name: string;
  currency: string;
  symbol: string;
  decimals: number;
  rpcUrl: string;
  blockExplorerUrl: string;
  logoUrl: string;
  isTestnet: boolean;
}

export interface BlockchainConfig {
  [key: string]: {
    networks: { [key: string]: NetworkConfig };
    defaultNetwork: string;
  };
}

// Default RPC URLs - in production, these should be environment variables
const ETHEREUM_RPC_URL = import.meta.env.VITE_ETHEREUM_RPC_URL || 'https://mainnet.infura.io/v3/your-infura-key';
const POLYGON_RPC_URL = import.meta.env.VITE_POLYGON_RPC_URL || 'https://polygon-rpc.com';
const ARBITRUM_RPC_URL = import.meta.env.VITE_ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc';
const OPTIMISM_RPC_URL = import.meta.env.VITE_OPTIMISM_RPC_URL || 'https://mainnet.optimism.io';
const SOLANA_RPC_URL = import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

// Blockchain configuration
const blockchainConfig: BlockchainConfig = {
  ethereum: {
    networks: {
      mainnet: {
        chainId: 1,
        name: 'Ethereum Mainnet',
        currency: 'Ether',
        symbol: 'ETH',
        decimals: 18,
        rpcUrl: ETHEREUM_RPC_URL,
        blockExplorerUrl: 'https://etherscan.io',
        logoUrl: '/assets/networks/ethereum.svg',
        isTestnet: false,
      },
      goerli: {
        chainId: 5,
        name: 'Goerli Testnet',
        currency: 'Goerli Ether',
        symbol: 'GoerliETH',
        decimals: 18,
        rpcUrl: 'https://goerli.infura.io/v3/your-infura-key',
        blockExplorerUrl: 'https://goerli.etherscan.io',
        logoUrl: '/assets/networks/ethereum.svg',
        isTestnet: true,
      },
    },
    defaultNetwork: 'mainnet',
  },
  polygon: {
    networks: {
      mainnet: {
        chainId: 137,
        name: 'Polygon Mainnet',
        currency: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
        rpcUrl: POLYGON_RPC_URL,
        blockExplorerUrl: 'https://polygonscan.com',
        logoUrl: '/assets/networks/polygon.svg',
        isTestnet: false,
      },
      mumbai: {
        chainId: 80001,
        name: 'Mumbai Testnet',
        currency: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
        rpcUrl: 'https://rpc-mumbai.maticvigil.com',
        blockExplorerUrl: 'https://mumbai.polygonscan.com',
        logoUrl: '/assets/networks/polygon.svg',
        isTestnet: true,
      },
    },
    defaultNetwork: 'mainnet',
  },
  arbitrum: {
    networks: {
      mainnet: {
        chainId: 42161,
        name: 'Arbitrum One',
        currency: 'Ether',
        symbol: 'ETH',
        decimals: 18,
        rpcUrl: ARBITRUM_RPC_URL,
        blockExplorerUrl: 'https://arbiscan.io',
        logoUrl: '/assets/networks/arbitrum.svg',
        isTestnet: false,
      },
      goerli: {
        chainId: 421613,
        name: 'Arbitrum Goerli',
        currency: 'Goerli Ether',
        symbol: 'GoerliETH',
        decimals: 18,
        rpcUrl: 'https://goerli-rollup.arbitrum.io/rpc',
        blockExplorerUrl: 'https://goerli.arbiscan.io',
        logoUrl: '/assets/networks/arbitrum.svg',
        isTestnet: true,
      },
    },
    defaultNetwork: 'mainnet',
  },
  optimism: {
    networks: {
      mainnet: {
        chainId: 10,
        name: 'Optimism',
        currency: 'Ether',
        symbol: 'ETH',
        decimals: 18,
        rpcUrl: OPTIMISM_RPC_URL,
        blockExplorerUrl: 'https://optimistic.etherscan.io',
        logoUrl: '/assets/networks/optimism.svg',
        isTestnet: false,
      },
      goerli: {
        chainId: 420,
        name: 'Optimism Goerli',
        currency: 'Goerli Ether',
        symbol: 'GoerliETH',
        decimals: 18,
        rpcUrl: 'https://goerli.optimism.io',
        blockExplorerUrl: 'https://goerli-optimism.etherscan.io',
        logoUrl: '/assets/networks/optimism.svg',
        isTestnet: true,
      },
    },
    defaultNetwork: 'mainnet',
  },
  solana: {
    networks: {
      mainnet: {
        chainId: 101, // Solana doesn't use EVM chainId, but we include for consistency
        name: 'Solana Mainnet',
        currency: 'SOL',
        symbol: 'SOL',
        decimals: 9,
        rpcUrl: SOLANA_RPC_URL,
        blockExplorerUrl: 'https://explorer.solana.com',
        logoUrl: '/assets/networks/solana.svg',
        isTestnet: false,
      },
      devnet: {
        chainId: 103,
        name: 'Solana Devnet',
        currency: 'SOL',
        symbol: 'SOL',
        decimals: 9,
        rpcUrl: 'https://api.devnet.solana.com',
        blockExplorerUrl: 'https://explorer.solana.com/?cluster=devnet',
        logoUrl: '/assets/networks/solana.svg',
        isTestnet: true,
      },
    },
    defaultNetwork: 'mainnet',
  },
};

export default blockchainConfig;
