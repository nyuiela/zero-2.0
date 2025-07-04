"use client"

// import '@coinbase/onchainkit/styles.css';
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import {
  Swap,
  SwapAmountInput,
  SwapToggleButton,
  SwapButton,
  SwapMessage,
  SwapToast,
} from '@coinbase/onchainkit/swap';
import type { Token } from '@coinbase/onchainkit/token';
import { useAccount } from 'wagmi';

const EULER_LOGO = "https://docs.euler.finance/img/logo.svg";

// Example tokens for Base Sepolia (chainId: 84532)
const ETH: Token = {
  address: '',
  chainId: 84532,
  decimals: 18,
  name: 'Ethereum',
  symbol: 'ETH',
  image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
};

const USDC: Token = {
  address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  chainId: 84532,
  decimals: 6,
  name: 'USDC',
  symbol: 'USDC',
  image: 'https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png',
};

const DAI: Token = {
  address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
  chainId: 84532,
  decimals: 18,
  name: 'Dai',
  symbol: 'DAI',
  image: 'https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png',
};

const WBTC: Token = {
  address: '0x4200000000000000000000000000000000000006',
  chainId: 84532,
  decimals: 8,
  name: 'Wrapped BTC',
  symbol: 'WBTC',
  image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
};

const ARB: Token = {
  address: '0x912CE59144191C1204E64559FE8253a0e49E6548',
  chainId: 84532,
  decimals: 18,
  name: 'Arbitrum',
  symbol: 'ARB',
  image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
};

const OP: Token = {
  address: '0x4200000000000000000000000000000000000042',
  chainId: 84532,
  decimals: 18,
  name: 'Optimism',
  symbol: 'OP',
  image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
};

const BASE: Token = {
  address: '0x4200000000000000000000000000000000000006',
  chainId: 84532,
  decimals: 18,
  name: 'Base',
  symbol: 'BASE',
  image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
};

const LINK: Token = {
  address: '0x779877A7B0D9E8603169DdbD7836e478b4624789',
  chainId: 84532,
  decimals: 18,
  name: 'Chainlink',
  symbol: 'LINK',
  image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
};

const UNI: Token = {
  address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  chainId: 84532,
  decimals: 18,
  name: 'Uniswap',
  symbol: 'UNI',
  image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
};

const AAVE: Token = {
  address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
  chainId: 84532,
  decimals: 18,
  name: 'Aave',
  symbol: 'AAVE',
  image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
};

const MATIC: Token = {
  address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608aCafEBB0',
  chainId: 84532,
  decimals: 18,
  name: 'Polygon',
  symbol: 'MATIC',
  image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
};

const USDT: Token = {
  address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  chainId: 84532,
  decimals: 6,
  name: 'Tether',
  symbol: 'USDT',
  image: 'https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png',
};

const TOKENS: Token[] = [ETH, USDC, DAI, WBTC, ARB, OP, BASE, LINK, UNI, AAVE, MATIC, USDT];

const MOCK_HISTORY = [
  { hash: "0xabc123", from: "ETH", to: "USDC", amount: 0.5, status: "Success", explorer: "https://sepolia.etherscan.io/tx/0xabc123" },
  { hash: "0xdef456", from: "USDC", to: "ETH", amount: 1000, status: "Success", explorer: "https://sepolia.etherscan.io/tx/0xdef456" },
];

function EulerBrand() {
  const [hover, setHover] = useState(false);
  return (
    <span className="flex items-center gap-2 select-none">
      <Image src={EULER_LOGO} alt="Euler" width={24} height={24} />
      <span
        className="font-bold text-lg transition-colors duration-200 cursor-pointer"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {hover ? "Oiler" : "Euler"}
      </span>
    </span>
  );
}

export default function SwapPage() {
  const [tab, setTab] = useState("swap");
  const [search, setSearch] = useState("");
  const filteredTokens = TOKENS.filter(t => t.symbol.toLowerCase().includes(search.toLowerCase()) || t.name.toLowerCase().includes(search.toLowerCase()));
  const { address } = useAccount();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2 sm:px-0">
      <div className="max-w-[1600px] mx-auto">
        {/* Header with Euler Brand */}
        <div className="flex justify-center mb-8">
          <EulerBrand />
        </div>
        
        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab} className="w-full mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="swap">Swap</TabsTrigger>
            <TabsTrigger value="yield">Yield</TabsTrigger>
            <TabsTrigger value="vault">Vault</TabsTrigger>
          </TabsList>

        <TabsContent value="swap" className="mt-6 ml-14">
          <div className="flex flex-col md:flex-row gap-0 md:gap-0">
            {/* Left Column: Token List & History */}
            <div className="flex-1 md:max-w-[78%] min-w-[320px] md:pl-8 md:pr-8 md:py-4 md:rounded-l-2xl md:rounded-r-none bg-white shadow-lg border-r border-gray-100 flex flex-col md:sticky md:top-8 h-fit">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search tokens..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">Tokens & Rates</h3>
                <ul className="divide-y divide-gray-100">
                  {filteredTokens.slice(0, 12).map(token => (
                    <li key={token.symbol} className="py-2 flex items-center justify-between">
                      <span className="font-medium">{token.symbol}</span>
                      <span className="text-gray-500 text-sm">{token.name}</span>
                      <span className="text-amber-600 font-semibold">1.0</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto">
                <h3 className="font-semibold text-lg mb-2">Transaction History</h3>
                <ul className="divide-y divide-gray-100">
                  {MOCK_HISTORY.map(tx => (
                    <li key={tx.hash} className="py-2 flex items-center justify-between">
                      <span className="font-mono text-xs">{tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}</span>
                      <span className="text-gray-500 text-xs">{tx.from} → {tx.to}</span>
                      <a href={tx.explorer} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">View</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Right Column: Swap Form */}
            <div className="flex-1 md:max-w-[38%] md:ml-auto md:mr-12 md:py-4 md:rounded-r-2xl md:rounded-l-none flex flex-col items-end">
              <div className="w-full md:w-[420px] sticky top-24 self-end">
                <Card className="p-6 rounded-xl shadow-xl bg-white">
                  <h2 className="text-2xl font-bold mb-4">Swap Tokens</h2>
                  <div className="mb-4">
                    <p className="text-gray-500">Swap tokens across chains to participate in auctions or stake.</p>
                  </div>
                  {/* OnchainKit Swap UI */}
                  {address ? (
                    <Swap>
                      <SwapAmountInput
                        label="Sell"
                        swappableTokens={TOKENS}
                        token={TOKENS[0]}
                        type="from"
                      />
                      <SwapToggleButton />
                      <SwapAmountInput
                        label="Buy"
                        swappableTokens={TOKENS}
                        token={TOKENS[1]}
                        type="to"
                      />
                      <SwapButton />
                      <SwapMessage />
                      <SwapToast />
                    </Swap>
                  ) : (
                    <div className="text-center text-gray-400">Connect your wallet to start swapping.</div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="yield" className="mt-0">
          <div className="flex flex-col md:flex-row gap-0 md:gap-0">
            {/* Left Column: Yield Strategies */}
            <div className="flex-1 md:max-w-[48%] min-w-[320px] md:pl-8 md:pr-8 md:py-4 md:rounded-l-2xl md:rounded-r-none bg-white shadow-lg border-r border-gray-100 flex flex-col md:sticky md:top-8 h-fit">
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-4">Yield Strategies</h3>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">ETH-USDC LP</span>
                      <span className="text-green-600 font-semibold">12.5% APY</span>
                    </div>
                    <p className="text-sm text-gray-600">Liquidity provision on Uniswap V3</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Staking Pool</span>
                      <span className="text-green-600 font-semibold">8.2% APY</span>
                    </div>
                    <p className="text-sm text-gray-600">Stake ETH for rewards</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Lending Protocol</span>
                      <span className="text-green-600 font-semibold">6.8% APY</span>
                    </div>
                    <p className="text-sm text-gray-600">Lend assets for interest</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Right Column: Yield Form */}
            <div className="flex-1 md:max-w-[38%] md:ml-auto md:mr-12 md:py-4 md:rounded-r-2xl md:rounded-l-none flex flex-col items-end">
              <div className="w-full md:w-[420px] sticky top-24 self-end">
                <Card className="p-6 rounded-xl shadow-xl bg-white">
                  <h2 className="text-2xl font-bold mb-4">Yield Farming</h2>
                  <div className="mb-4">
                    <p className="text-gray-500">Earn yield on your assets through various DeFi strategies.</p>
                  </div>
                  {address ? (
                    <div className="space-y-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <label className="block text-sm font-medium mb-2">Amount to Stake</label>
                        <input
                          type="number"
                          placeholder="0.0"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <button className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors">
                        Start Earning Yield
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400">Connect your wallet to start yield farming.</div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="vault" className="mt-0">
          <div className="flex flex-col md:flex-row gap-0 md:gap-0">
            {/* Left Column: Vault Strategies */}
            <div className="flex-1 md:max-w-[48%] min-w-[320px] md:pl-8 md:pr-8 md:py-4 md:rounded-l-2xl md:rounded-r-none bg-white shadow-lg border-r border-gray-100 flex flex-col md:sticky md:top-8 h-fit">
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-4">Vault Strategies</h3>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Conservative Vault</span>
                      <span className="text-blue-600 font-semibold">5.2% APY</span>
                    </div>
                    <p className="text-sm text-gray-600">Low risk, stable returns</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Balanced Vault</span>
                      <span className="text-orange-600 font-semibold">9.1% APY</span>
                    </div>
                    <p className="text-sm text-gray-600">Moderate risk and returns</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Aggressive Vault</span>
                      <span className="text-red-600 font-semibold">15.3% APY</span>
                    </div>
                    <p className="text-sm text-gray-600">High risk, high returns</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Right Column: Vault Form */}
            <div className="flex-1 md:max-w-[38%] md:ml-auto md:mr-12 md:py-4 md:rounded-r-2xl md:rounded-l-none flex flex-col items-end">
              <div className="w-full md:w-[420px] sticky top-24 self-end">
                <Card className="p-6 rounded-xl shadow-xl bg-white">
                  <h2 className="text-2xl font-bold mb-4">Vault Investment</h2>
                  <div className="mb-4">
                    <p className="text-gray-500">Invest in automated yield strategies with different risk profiles.</p>
                  </div>
                  {address ? (
                    <div className="space-y-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <label className="block text-sm font-medium mb-2">Select Strategy</label>
                        <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                          <option>Conservative Vault</option>
                          <option>Balanced Vault</option>
                          <option>Aggressive Vault</option>
                        </select>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <label className="block text-sm font-medium mb-2">Investment Amount</label>
                        <input
                          type="number"
                          placeholder="0.0"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <button className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors">
                        Invest in Vault
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400">Connect your wallet to invest in vaults.</div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 