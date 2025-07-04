import { ChainDto } from "../types";

export const isValidAddress = (chain: ChainDto | null, address: string) => {
  if (!chain || !address) return false;

  if (chain.solana) {
    // Basic Solana address validation
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  } else {
    // Basic EVM address validation
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
}; 