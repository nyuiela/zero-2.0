'use client'

import React from "react";
import { SwapBridgeModal } from "@/components/awesome-swap/src/components/SwapBridgeModal";
import { SwapBridgeProvider } from "@/components/awesome-swap/src/providers/SwapBridgeProvider";
import { InjectedState } from "@/components/awesome-swap/src/state/injected-store";
// import "@/components/awesome-swap/ui/index.css";

// Sample injected state for demo
const demoInjectedState: InjectedState = {
  id: "superbridge",
  superbridgeTestnets: false,
  superbridgeConfig: null,
  deployments: [],
  acrossDomains: [],
  cctpDomains: [],
  lzDomains: [],
  ccipDomains: [],
  hyperlaneMailboxes: [],
  opInteropDomains: [],
  ecoDomains: [],
  relayDomains: [],
  signetHosts: [],
  signetChildren: [],
  fromChainId: 1, // Ethereum mainnet
  toChainId: 137, // Polygon
  chains: [
    {
      id: 1,
      name: "Ethereum",
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: ["https://ethereum.rpc.thirdweb.com"],
      blockExplorerUrls: ["https://etherscan.io"],
      testnet: false,
      solana: false,
    },
    {
      id: 137,
      name: "Polygon",
      nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
      rpcUrls: ["https://polygon.rpc.thirdweb.com"],
      blockExplorerUrls: ["https://polygonscan.com"],
      testnet: false,
      solana: false,
    },
    {
      id: 42161,
      name: "Arbitrum One",
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: ["https://arbitrum-one.rpc.thirdweb.com"],
      blockExplorerUrls: ["https://arbiscan.io"],
      testnet: false,
      solana: false,
    },
  ],
  app: {
    name: "Superbridge",
    description: "Cross-chain bridge",
    version: "1.0.0",
  },
  host: "https://superbridge.app",
  widget: false,
  isPaid: false,
  deletedAt: null,
  defaultRoute: null,
  supportsOnRamp: true,
  tos: {
    accepted: true,
  },
  tokensId: null,
};

export default function App() {
  return (
    <SwapBridgeProvider injectedState={demoInjectedState}>
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <SwapBridgeModal />
      </div>
    </SwapBridgeProvider>
  );
};
