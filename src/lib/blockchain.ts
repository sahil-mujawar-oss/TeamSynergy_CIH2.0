// src/lib/blockchain.ts
// Browser-safe Blockchain Data Integration using ethers.js

import { ethers } from "ethers";

// Fetch Ethereum balance using ethers.js (browser compatible)
export async function getEthBalance(address: string, rpcUrl: string): Promise<string> {
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}
