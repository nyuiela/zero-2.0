import { useState } from "react";

// Mock token data
export const mockTokens = [
  { symbol: "USDC", name: "USD Coin" },
  { symbol: "ETH", name: "Ether" },
  { symbol: "DAI", name: "Dai" },
  { symbol: "WBTC", name: "Wrapped Bitcoin" },
];

export function useTokens() {
  // Token selection state
  const [selectedToken, setSelectedToken] = useState(mockTokens[0]);
  return { selectedToken, setSelectedToken, tokens: mockTokens };
} 