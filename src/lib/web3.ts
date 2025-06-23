// src/lib/web3.ts
// Web3 Wallet Integration: MetaMask and WalletConnect

// MetaMask connection
export async function connectMetaMask(): Promise<string | null> {
  if (typeof window === "undefined" || !(window as any).ethereum) {
    throw new Error("MetaMask is not installed");
  }
  const provider = (window as any).ethereum;
  const accounts = await provider.request({ method: "eth_requestAccounts" });
  return accounts[0] || null;
}

// WalletConnect (placeholder, requires WalletConnect SDK for full implementation)
export async function connectWalletConnect(): Promise<string | null> {
  // Implement WalletConnect logic here using @walletconnect/client or wagmi
  throw new Error("WalletConnect integration not implemented yet");
}
