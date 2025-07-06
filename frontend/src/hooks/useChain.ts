import { useState } from "react";

// Mock network data
export const mockNetworks = [
  { id: 1, name: "Ethereum" },
  { id: 10, name: "Optimism" },
  { id: 42161, name: "Arbitrum One" },
  { id: 8453, name: "Base" },
  { id: 137, name: "Polygon" },
];

export function useChain() {
  // Network selection state
  const [selectedNetwork, setSelectedNetwork] = useState(mockNetworks[0]);
  return { selectedNetwork, setSelectedNetwork, networks: mockNetworks };
} 