// Centralized list of supported networks and tokens for the swap UI

export interface SwapChain {
  id: number
  name: string
  icon: string
  theme: {
    card: {
      className: string
      overlay?: {
        className?: string
        image?: string
      }
    }
    title: string
  }
}

export interface SwapToken {
  address: string
  chainId: number
  decimals: number
  name: string
  symbol: string
  image: string
}

// Major EVM mainnets and testnets
export const SWAP_CHAINS: SwapChain[] = [
  // Mainnets
  { id: 1, name: 'Ethereum', icon: '/img/networks/ethereum.svg', theme: { card: { className: 'bg-[#627EEA]' }, title: 'text-white' } },
  { id: 8453, name: 'Base', icon: '/img/networks/base.svg', theme: { card: { className: 'bg-blue-600' }, title: 'text-white' } },
  { id: 42161, name: 'Arbitrum', icon: '/img/networks/arbitrum-one.svg', theme: { card: { className: 'bg-[#1C4ADD]' }, title: 'text-white' } },
  { id: 10, name: 'Optimism', icon: '/img/networks/optimism.svg', theme: { card: { className: 'bg-[#FF0420]' }, title: 'text-white' } },
  { id: 137, name: 'Polygon', icon: '/img/networks/polygon.svg', theme: { card: { className: 'bg-[#8247E5]' }, title: 'text-white' } },
  { id: 56, name: 'BNB Chain', icon: '/img/networks/bsc.svg', theme: { card: { className: 'bg-[#F3BA2F]' }, title: 'text-black' } },
  { id: 43114, name: 'Avalanche', icon: '/img/networks/avalanche.svg', theme: { card: { className: 'bg-[#E84142]' }, title: 'text-white' } },
  { id: 250, name: 'Fantom', icon: '/img/networks/fantom/icon.svg', theme: { card: { className: 'bg-[#1969FF]' }, title: 'text-white' } },
  { id: 100, name: 'Gnosis', icon: '/img/networks/gnosis.svg', theme: { card: { className: 'bg-[#48A9A6]' }, title: 'text-white' } },
  // Testnets
  { id: 11155111, name: 'Sepolia', icon: '/img/networks/ethereum.svg', theme: { card: { className: 'bg-[#627EEA]' }, title: 'text-white' } },
  { id: 84532, name: 'Base Sepolia', icon: '/img/networks/base.svg', theme: { card: { className: 'bg-blue-600' }, title: 'text-white' } },
  { id: 421614, name: 'Arbitrum Sepolia', icon: '/img/networks/arbitrum-one.svg', theme: { card: { className: 'bg-[#1C4ADD]' }, title: 'text-white' } },
  { id: 11155420, name: 'Optimism Sepolia', icon: '/img/networks/optimism.svg', theme: { card: { className: 'bg-[#FF0420]' }, title: 'text-white' } },
  { id: 80001, name: 'Polygon Mumbai', icon: '/img/networks/polygon.svg', theme: { card: { className: 'bg-[#8247E5]' }, title: 'text-white' } },
  { id: 97, name: 'BNB Testnet', icon: '/img/networks/bsc.svg', theme: { card: { className: 'bg-[#F3BA2F]' }, title: 'text-black' } },
  { id: 43113, name: 'Avalanche Fuji', icon: '/img/networks/avalanche.svg', theme: { card: { className: 'bg-[#E84142]' }, title: 'text-white' } },
  { id: 4002, name: 'Fantom Testnet', icon: '/img/networks/fantom/icon.svg', theme: { card: { className: 'bg-[#1969FF]' }, title: 'text-white' } },
  { id: 10200, name: 'Gnosis Chiado', icon: '/img/networks/gnosis.svg', theme: { card: { className: 'bg-[#48A9A6]' }, title: 'text-white' } },
]

// Major tokens for each chain (ETH, USDC, USDT, DAI, WBTC, etc.)
export const SWAP_TOKENS: SwapToken[] = [
  // Ethereum Mainnet
  { address: '', chainId: 1, decimals: 18, name: 'Ethereum', symbol: 'ETH', image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png' },
  { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', chainId: 1, decimals: 6, name: 'USD Coin', symbol: 'USDC', image: 'https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png' },
  { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', chainId: 1, decimals: 6, name: 'Tether USD', symbol: 'USDT', image: 'https://assets.coingecko.com/coins/images/325/large/Tether-logo.png' },
  { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', chainId: 1, decimals: 18, name: 'Dai Stablecoin', symbol: 'DAI', image: 'https://assets.coingecko.com/coins/images/9956/large/4943.png' },
  { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', chainId: 1, decimals: 8, name: 'Wrapped Bitcoin', symbol: 'WBTC', image: 'https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png' },
  // Base Mainnet
  { address: '', chainId: 8453, decimals: 18, name: 'Ethereum', symbol: 'ETH', image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png' },
  { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', chainId: 8453, decimals: 6, name: 'USD Coin', symbol: 'USDC', image: 'https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png' },
  // Arbitrum Mainnet
  { address: '', chainId: 42161, decimals: 18, name: 'Ethereum', symbol: 'ETH', image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png' },
  { address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', chainId: 42161, decimals: 6, name: 'USD Coin', symbol: 'USDC', image: 'https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png' },
  // Optimism Mainnet
  { address: '', chainId: 10, decimals: 18, name: 'Ethereum', symbol: 'ETH', image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png' },
  { address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607', chainId: 10, decimals: 6, name: 'USD Coin', symbol: 'USDC', image: 'https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png' },
  // Polygon Mainnet
  { address: '', chainId: 137, decimals: 18, name: 'Matic', symbol: 'MATIC', image: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png' },
  { address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', chainId: 137, decimals: 6, name: 'USD Coin', symbol: 'USDC', image: 'https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png' },
  // BNB Chain Mainnet
  { address: '', chainId: 56, decimals: 18, name: 'BNB', symbol: 'BNB', image: 'https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png' },
  { address: '0x55d398326f99059fF775485246999027B3197955', chainId: 56, decimals: 18, name: 'Tether USD', symbol: 'USDT', image: 'https://assets.coingecko.com/coins/images/325/large/Tether-logo.png' },
  // Avalanche Mainnet
  { address: '', chainId: 43114, decimals: 18, name: 'Avalanche', symbol: 'AVAX', image: 'https://assets.coingecko.com/coins/images/12559/large/coin-round-red.png' },
  { address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', chainId: 43114, decimals: 6, name: 'USD Coin', symbol: 'USDC', image: 'https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png' },
  // Fantom Mainnet
  { address: '', chainId: 250, decimals: 18, name: 'Fantom', symbol: 'FTM', image: 'https://assets.coingecko.com/coins/images/4001/large/Fantom.png' },
  // Gnosis Mainnet
  { address: '', chainId: 100, decimals: 18, name: 'xDAI', symbol: 'xDAI', image: 'https://assets.coingecko.com/coins/images/11062/large/xdai.png' },
  // Testnet tokens (ETH, USDC, etc. on Sepolia, Base Sepolia, etc.)
  { address: '', chainId: 11155111, decimals: 18, name: 'SepoliaETH', symbol: 'ETH', image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png' },
  { address: '', chainId: 84532, decimals: 18, name: 'BaseETH', symbol: 'ETH', image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png' },
  { address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', chainId: 84532, decimals: 6, name: 'USD Coin', symbol: 'USDC', image: 'https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png' },
  { address: '', chainId: 421614, decimals: 18, name: 'ArbitrumETH', symbol: 'ETH', image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png' },
  { address: '', chainId: 11155420, decimals: 18, name: 'OptimismETH', symbol: 'ETH', image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png' },
  // Add more tokens for each chain as needed
] 