"use client"

// import '@coinbase/onchainkit/styles.css';
import { useState, useEffect, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import type { Token } from '@coinbase/onchainkit/token';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { ChevronDown, Settings } from "lucide-react";
import CustomCoinbaseSwap from '@/components/custom-coinbase-swap';
import { registry_abi, registry_addr } from '@/lib/abi/abi';
import { parseEther } from 'viem';
import { toast } from 'sonner';
import { useEulerVaults } from '@/hooks/useEulerVaults';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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
  address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
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

// Stake Button Component
function StakeButton({ onStake }: { onStake: () => void }) {
  const { address } = useAccount();
  const {
    data: hash,
    isPending,
    writeContract,
    error: contractError,
    isError
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      confirmations: 3,
      hash,
    });

  const handleStake = async () => {
    if (!address) return;

    try {
      writeContract({
        address: registry_addr,
        abi: registry_abi,
        functionName: 'stake',
        args: ['swap_user'],
        value: parseEther("0.0000005"),
        account: address
      });
    } catch (error) {
      console.error('Stake error:', error);
      toast.error("Stake transaction failed");
    }
  };

  // Handle stake completion
  if (isConfirmed) {
    toast.success("Stake transaction confirmed!");
    onStake();
  }

  return (
    <button
      onClick={handleStake}
      disabled={isPending || isConfirming}
      className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50"
    >
      {isPending || isConfirming ? "Staking..." : "Stake to Enable"}
    </button>
  );
}

export default function SwapPage() {
  const [tab, setTab] = useState("swap");
  const [search, setSearch] = useState("");
  const filteredTokens = TOKENS.filter(t => t.symbol.toLowerCase().includes(search.toLowerCase()) || t.name.toLowerCase().includes(search.toLowerCase()));
  const { address } = useAccount();
  // Use default chain ID since useNetwork doesn't exist in wagmi v2
  const { vaults, earnVaults, loading: vaultsLoading, error: vaultsError, fetchAccountPositions } = useEulerVaults(1); // Default to Ethereum mainnet

  // Dashboard state
  const [accountPositions, setAccountPositions] = useState<{ deposits: any[]; borrows: any[] } | null>(null);
  const [positionsLoading, setPositionsLoading] = useState(false);

  useEffect(() => {
    if (!address) {
      setAccountPositions(null);
      return;
    }
    setPositionsLoading(true);
    fetchAccountPositions(address)
      .then((data) => {
        setAccountPositions(data ? { deposits: data.deposits || [], borrows: data.borrows || [] } : { deposits: [], borrows: [] });
      })
      .finally(() => setPositionsLoading(false));
  }, [address, fetchAccountPositions]);

  // Calculate dashboard stats
  const totalLent = useMemo(() => {
    if (!accountPositions) return 0;
    // Assume deposits is an array of objects with an 'amount' property (string or number)
    return accountPositions.deposits.reduce((sum, d) => sum + (parseFloat(d.amount || "0") || 0), 0);
  }, [accountPositions]);

  const totalBorrowed = useMemo(() => {
    if (!accountPositions) return 0;
    return accountPositions.borrows.reduce((sum, b) => sum + (parseFloat(b.amount || "0") || 0), 0);
  }, [accountPositions]);

  const vaultsInvested = useMemo(() => {
    if (!accountPositions) return 0;
    // Count unique vaults with a deposit > 0
    const vaultIds = new Set((accountPositions.deposits || []).map((d) => d.vaultId || d.vault || d.id));
    return vaultIds.size;
  }, [accountPositions]);

  const availableVaults = vaults.length;

  // Bridge state
  const [bridgeAmount, setBridgeAmount] = useState("");
  const [bridgeModalOpen, setBridgeModalOpen] = useState(false);
  const [bridgeStep, setBridgeStep] = useState(0); // 0: not started, 1: bridging, 2: waiting, 3: done
  const [bridgeTab, setBridgeTab] = useState("steps");
  const [bridgeStatus, setBridgeStatus] = useState("idle"); // idle, bridging, waiting, done

  // Yield farming state
  const [yieldAmount, setYieldAmount] = useState("");
  const [selectedYieldToken, setSelectedYieldToken] = useState(USDC);
  const [useNFTTokenization, setUseNFTTokenization] = useState(false);
  const [selectedNFTs, setSelectedNFTs] = useState<string[]>([]);

  // Vault investment state
  const [vaultAmount, setVaultAmount] = useState("");
  const [selectedVaultStrategy, setSelectedVaultStrategy] = useState("Conservative Vault");

  // Simulate bridge process
  const startBridge = () => {
    setBridgeModalOpen(true);
    setBridgeStep(1);
    setBridgeStatus("bridging");
    setTimeout(() => {
      setBridgeStep(2);
      setBridgeStatus("waiting");
      setTimeout(() => {
        setBridgeStep(3);
        setBridgeStatus("done");
      }, 4000);
    }, 2000);
  };

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [slippage, setSlippage] = useState("1");
  const [currency, setCurrency] = useState("USD");
  const [language, setLanguage] = useState("English");
  const [explorer, setExplorer] = useState("Etherscan");
  const [enableTestnets, setEnableTestnets] = useState(false);
  const [showTokenLists, setShowTokenLists] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [escapeHatch, setEscapeHatch] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-[10rem] xl:px-[20rem]">
      <div className="max-w-[1600px] mx-auto">
        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-start">
            <span className="text-xs text-gray-500 mb-1">Total Lent</span>
            <span className="text-2xl font-bold text-gray-900">0</span>
            {/* <span className="text-2xl font-bold text-gray-900">{positionsLoading ? '...' : totalLent.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span> */}
            <span className="text-xs text-gray-400 mt-1">Across all vaults</span>
          </div>
          <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-start">
            <span className="text-xs text-gray-500 mb-1">Total Borrowed</span>
            <span className="text-2xl font-bold text-gray-900">0</span>
            {/* <span className="text-2xl font-bold text-gray-900">{positionsLoading ? '...' : totalBorrowed.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span> */}
            <span className="text-xs text-gray-400 mt-1">Across all vaults</span>
          </div>
          <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-start">
            <span className="text-xs text-gray-500 mb-1">Vaults Invested</span>
            <span className="text-2xl font-bold text-gray-900">0</span>
            {/* <span className="text-2xl font-bold text-gray-900">{positionsLoading ? '...' : vaultsInvested}</span> */}
            <span className="text-xs text-gray-400 mt-1">You have deposits in</span>
          </div>
          <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-start">
            <span className="text-xs text-gray-500 mb-1">Available Vaults</span>
            <span className="text-2xl font-bold text-gray-900">{vaultsLoading ? '...' : availableVaults}</span>
            <span className="text-xs text-gray-400 mt-1">Total vaults</span>
          </div>
        </div>

        {/* --- Additional Dashboard Sections --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Swaps Transactions */}
          <Card className="p-6 rounded-xl shadow-xl bg-white border-none">
            <h3 className="text-xs text-gray-500 font-normal mb-1">Recent Swaps</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-500">
                    <th className="py-2 px-2 text-xs text-gray-500 font-normal">From</th>
                    <th className="py-2 px-2 text-xs text-gray-500 font-normal">To</th>
                    <th className="py-2 px-2 text-xs text-gray-500 font-normal">Amount</th>
                    <th className="py-2 px-2 text-xs text-gray-500 font-normal">Status</th>
                    <th className="py-2 px-2 text-xs text-gray-500 font-normal">Explorer</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_HISTORY.map((tx) => (
                    <tr key={tx.hash} className="border-b border-gray-300 hover:bg-gray-50">
                      <td className="py-2 px-2 text-gray-900 font-bold">{tx.from}</td>
                      <td className="py-2 px-2 text-gray-900 font-bold">{tx.to}</td>
                      <td className="py-2 px-2 text-gray-900 font-bold">{tx.amount}</td>
                      <td className="py-2 px-2">
                        <Badge className={tx.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>{tx.status}</Badge>
                      </td>
                      <td className="py-2 px-2">
                        <a href={tx.explorer} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-bold">View</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Requests Made to Borrow (P2P) - Mocked */}
          <Card className="p-6 rounded-xl shadow-xl bg-white border-none">
            <h3 className="text-xs text-gray-500 font-normal mb-1">P2P Borrow Requests</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-500">
                    <th className="py-2 px-2 text-xs text-gray-500 font-normal">Token</th>
                    <th className="py-2 px-2 text-xs text-gray-500 font-normal">Amount</th>
                    <th className="py-2 px-2 text-xs text-gray-500 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { token: 'USDC', amount: 500, status: 'Pending' },
                    { token: 'ETH', amount: 0.2, status: 'Matched' },
                  ].map((req, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50 border-gray-300">
                      <td className="py-2 px-2 text-gray-900 font-bold">{req.token}</td>
                      <td className="py-2 px-2 text-gray-900 font-bold">{req.amount}</td>
                      <td className="py-2 px-2">
                        <Badge className={req.status === 'Matched' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>{req.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Collateral in EulerSwap */}
          <Card className="p-6 rounded-xl shadow-xl bg-white border-none">
            <h3 className="text-xs text-gray-500 font-normal mb-1">Collateral in EulerSwap</h3>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {/* {positionsLoading ? '...' : accountPositions ? accountPositions.deposits.reduce((sum, d) => sum + (parseFloat(d.amount || '0') || 0), 0).toLocaleString(undefined, { maximumFractionDigits: 4 }) : '0'} */}
              0
            </div>
            <div className="text-xs text-gray-400">Total value of your collateral</div>
          </Card>

          {/* Estimated Returns or Profit/Loss - Mocked */}
          <Card className="p-6 rounded-xl shadow-xl bg-white border-none">
            <h3 className="text-xs text-gray-500 font-normal mb-1">Estimated Returns</h3>
            {/* Mock calculation: profit if lent > borrowed, loss otherwise */}
            {(() => {
              const profit = totalLent - totalBorrowed;
              return (
                <div className={`text-3xl font-bold mb-2 ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{/* {positionsLoading ? '...' : profit.toLocaleString(undefined, { maximumFractionDigits: 4 })} */}0</div>
              );
            })()}
            <div className="text-xs text-gray-400">(Lent - Borrowed)</div>
          </Card>
        </div>

        {/* NFT Collateral/Locked Section */}
        <div className="mb-12">
          <Card className="p-6 rounded-xl shadow-xl bg-white border-none">
            <h3 className="text-xs text-gray-500 font-normal mb-1">NFTs (Collateralizable or Locked)</h3>
            <div className="flex flex-wrap gap-4">
              {/* Use the same mock NFTs as in yield farming */}
              {[
                { id: "1", name: "Ferrari 488 GTB", year: 2019, image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", status: 'collateralizable' },
                { id: "2", name: "Tesla Model S", year: 2022, image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", status: 'locked' }
              ].map((nft) => (
                <div key={nft.id} className="flex flex-col items-center bg-gray-50 rounded-lg p-4 w-40">
                  <img src={nft.image} alt={nft.name} className="w-20 h-20 rounded object-cover mb-2" />
                  <div className="font-bold text-sm text-gray-900 truncate">{nft.name}</div>
                  <div className="text-xs text-gray-500 mb-1">{nft.year}</div>
                  <Badge className={nft.status === 'collateralizable' ? 'bg-blue-100 text-blue-800' : 'bg-gray-300 text-gray-700'}>
                    {nft.status.charAt(0).toUpperCase() + nft.status.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
        {/* Header with Euler Brand */}
        {/* <div className="flex justify-center mb-8">
          <EulerBrand />
        </div> */}

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab} className="mb-8 w-[20rem]">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bridge" className="hover:bg-gray-50">Bridge</TabsTrigger>
            <TabsTrigger value="swap">Swap</TabsTrigger>
            <TabsTrigger value="yield">Yield</TabsTrigger>
            <TabsTrigger value="vault">Vault</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Tab Content */}
        <div className="w-full mb-8">
          {/* Bridge Tab Content */}
          {tab === "bridge" && (
            <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-b from-[#b993f4] to-[#8ca6db] rounded-3xl py-20">
              <div className="w-full max-w-md mx-auto rounded-2xl bg-white/80 shadow-2xl p-0 flex flex-col items-center" style={{ fontFamily: 'Geist, Space Grotesk, Arial, sans-serif' }}>
                {/* Bridge/Buy Tabs */}
                <div className="flex justify-center gap-2 mt-6">
                  <button className="px-4 py-1 rounded-full text-sm font-semibold bg-[#b993f4] text-white shadow transition-all">Bridge</button>
                  <button className="px-4 py-1 rounded-full text-sm font-semibold bg-gray-200 text-gray-700 shadow transition-all">Buy</button>
                </div>
                {/* Card Content */}
                <div className="w-full px-8 py-6 flex flex-col gap-4">
                  {/* Chain selectors */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-xs font-medium">
                        <img src="/icons/sepolia.svg" alt="Sepolia" className="w-5 h-5" />
                        Sepolia
                      </span>
                    </div>
                    <span className="text-gray-400 font-bold text-lg">→</span>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-xs font-medium">
                        <img src="/icons/base-sepolia.svg" alt="Base Sepolia" className="w-5 h-5" />
                        Base Sepolia
                      </span>
                    </div>
                  </div>
                  {/* Amount input and token selector */}
                  <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 px-4 py-3">
                    <input
                      type="number"
                      placeholder="0"
                      value={bridgeAmount}
                      onChange={e => setBridgeAmount(e.target.value)}
                      className="flex-1 text-2xl font-bold bg-transparent outline-none border-none focus:ring-0"
                      style={{ fontFamily: 'inherit' }}
                    />
                    <button className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 text-gray-700 font-semibold text-sm">
                      <img src="/icons/eth.svg" alt="ETH" className="w-5 h-5" />
                      ETH
                    </button>
                  </div>
                  {/* Connect Wallet or Bridge Button */}
                  {address ? (
                    <button
                      className="w-full mt-4 bg-black text-white rounded-xl py-4 text-lg font-bold transition hover:bg-gray-900"
                      onClick={startBridge}
                      disabled={!bridgeAmount || bridgeStatus === 'bridging' || bridgeStatus === 'waiting'}
                    >
                      {bridgeStatus === 'bridging' || bridgeStatus === 'waiting' ? 'Bridging...' : `Bridge${bridgeAmount ? ` ${bridgeAmount} ETH` : ''}`}
                    </button>
                  ) : (
                    <button className="w-full mt-4 bg-black text-white rounded-xl py-4 text-lg font-bold transition hover:bg-gray-900">
                      Connect wallet
                    </button>
                  )}
                </div>
                <div className="absolute top-4 right-4 z-10">
                  <button onClick={() => setSettingsOpen(true)} className="rounded-full p-2 bg-white/80 hover:bg-white shadow">
                    <Settings className="w-6 h-6 text-gray-700" />
                  </button>
                </div>
              </div>
              {/* Bridge Progress Modal */}
              <Dialog open={bridgeModalOpen} onOpenChange={setBridgeModalOpen}>
                <DialogContent className="max-w-md w-full p-0 rounded-2xl overflow-hidden bg-white shadow-2xl mt-10">
                  <div className="flex justify-between items-center px-6 pt-6 pb-2">
                    <span className="w-6" />
                    <div className="flex flex-col items-center">
                      <img src="/icons/eth.svg" alt="ETH" className="w-12 h-12 mb-2" />
                      <span className="font-bold text-2xl">Bridge {bridgeAmount || '0'} ETH</span>
                      <span className="text-gray-500 text-sm -mt-1">Via Native Bridge</span>
                    </div>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100" onClick={() => setBridgeModalOpen(false)}>
                      <X className="w-6 h-6 text-gray-400" />
                    </button>
                  </div>
                  {/* Steps/Info Tabs */}
                  <div className="flex justify-center gap-2 mt-2 mb-4">
                    <button onClick={() => setBridgeTab('steps')} className={`px-4 py-1 rounded-full text-sm font-semibold ${bridgeTab === 'steps' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'} shadow transition-all`}>Steps</button>
                    <button onClick={() => setBridgeTab('info')} className={`px-4 py-1 rounded-full text-sm font-semibold ${bridgeTab === 'info' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'} shadow transition-all`}>Bridge info</button>
                  </div>
                  {bridgeTab === 'steps' ? (
                    <div className="flex flex-col gap-3 px-6 pb-4">
                      <div className={`flex items-center gap-3 rounded-xl px-4 py-3 ${bridgeStep >= 1 ? 'bg-gray-50' : 'bg-gray-100'}`}>
                        <img src="/icons/sepolia.svg" alt="Sepolia" className="w-7 h-7" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">Start on Sepolia</div>
                          <div className="text-xs text-gray-500">{Number(bridgeAmount || 0).toFixed(6)} ETH</div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${bridgeStatus === 'bridging' ? 'bg-gray-300 text-gray-700' : bridgeStep > 1 ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-400'}`}>{bridgeStatus === 'bridging' ? 'Bridging' : bridgeStep > 1 ? 'Done' : ''}</span>
                      </div>
                      <div className={`flex items-center gap-3 rounded-xl px-4 py-3 ${bridgeStep >= 2 ? 'bg-gray-50' : 'bg-gray-100'}`}>
                        <span className="w-7 h-7 flex items-center justify-center"><svg width="20" height="20" fill="none"><circle cx="10" cy="10" r="10" fill="#e5e7eb" /><path d="M10 5v5l3 3" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">Wait 6 mins</div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${bridgeStatus === 'waiting' ? 'bg-gray-300 text-gray-700' : bridgeStep > 2 ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-400'}`}>{bridgeStatus === 'waiting' ? 'Waiting' : bridgeStep > 2 ? 'Done' : ''}</span>
                      </div>
                      <div className={`flex items-center gap-3 rounded-xl px-4 py-3 ${bridgeStep >= 3 ? 'bg-gray-50' : 'bg-gray-100'}`}>
                        <img src="/icons/base-sepolia.svg" alt="Base Sepolia" className="w-7 h-7" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">Get {bridgeAmount || 0} ETH on Base Sepolia</div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${bridgeStep === 3 ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-400'}`}>{bridgeStep === 3 ? 'Done' : ''}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="px-6 pb-4 text-sm text-gray-600">
                      <div className="mb-2 font-semibold">Bridge info</div>
                      <div>This bridge uses the official Base Sepolia bridge contract. Bridging may take a few minutes to complete. Please do not close this window until the process is finished.</div>
                    </div>
                  )}
                  <div className="flex justify-center py-3 border-t mt-2">
                    <a href="#" className="text-xs text-gray-500 hover:underline">Need help? View FAQs <span className="inline-block align-middle">❓</span></a>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Swap Tab Content */}
          {tab === "swap" && (
            <div className="w-fit mb-[10rem]">
              {/* <Card className="p-6 rounded-xl shadow-xl bg-white max-w-2xl mx-auto border-none"> */}
              <h2 className="text-2xl font-bold mb-2">Swap Tokens</h2>
              <div className="mb-10">
                <p className="text-gray-500">Swap tokens across chains to participate in auctions or stake.</p>
              </div>
              <CustomCoinbaseSwap />
              {/* </Card> */}
            </div>
          )}

          {/* Yield Tab Content */}
          {tab === "yield" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Yield Farming Card */}
              <Card className="p-6 rounded-xl shadow-xl bg-white border-none">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Yield Farming</h2>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <p className="text-gray-600 mb-6">Lend your tokens to earn yield with optional NFT tokenization.</p>

                {/* Token Selector */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Token to Lend</label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
                    <img
                      src={selectedYieldToken.image || ''}
                      alt={selectedYieldToken.symbol}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="font-medium">{selectedYieldToken.symbol}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </div>
                </div>

                {/* Amount Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Lend</label>
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={yieldAmount}
                    onChange={(e) => setYieldAmount(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* NFT Tokenization Option */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">Use NFT Tokenization (Optional)</label>
                    <input
                      type="checkbox"
                      checked={useNFTTokenization}
                      onChange={(e) => setUseNFTTokenization(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  {useNFTTokenization && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800 mb-3">
                        Select your car NFTs to tokenize for additional yield:
                      </p>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {/* Mock NFTs - in real app, fetch from profile */}
                        {[
                          { id: "1", name: "Ferrari 488 GTB", year: 2019, image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
                          { id: "2", name: "Tesla Model S", year: 2022, image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" }
                        ].map((nft) => (
                          <label key={nft.id} className="flex items-center space-x-3 p-2 bg-white rounded border hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedNFTs.includes(nft.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedNFTs([...selectedNFTs, nft.id]);
                                } else {
                                  setSelectedNFTs(selectedNFTs.filter(id => id !== nft.id));
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {nft.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {nft.year}
                              </div>
                            </div>
                            <img
                              src={nft.image}
                              alt={nft.name}
                              className="w-8 h-8 rounded object-cover"
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Stake Button */}
                <StakeButton onStake={() => console.log("Staking for yield farming")} />
              </Card>
            </div>
          )}

          {/* Vault Tab Content */}
          {tab === "vault" && (
            <div className="space-y-8">
              {/* Vault Investment Card */}
              <Card className="p-6 rounded-xl shadow-xl bg-white border-none">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Vault Investment</h2>
                  <Badge className="bg-blue-100 text-blue-800">Euler Vaults</Badge>
                </div>
                <p className="text-gray-600 mb-6">Invest in Euler vaults with automated strategies.</p>

                {/* Vault List */}
                {vaultsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading vaults...</span>
                  </div>
                ) : vaultsError ? (
                  <div className="text-center py-8">
                    <p className="text-red-600 mb-2">Error loading vaults</p>
                    <p className="text-sm text-gray-500">{vaultsError}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {vaults.map((vault, index) => (
                      <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{vault.vaultName}</h3>
                          <Badge className="bg-green-100 text-green-800">
                            {vault.supplyAPY}% APY
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Total Assets: {parseFloat(vault.totalAssets) / 1e18} |
                          Total Borrows: {parseFloat(vault.totalBorrows) / 1e18}
                        </p>

                        {/* Strategy Dropdown */}
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Strategy</label>
                          <select
                            className="w-full p-2 border rounded-lg bg-white"
                            value={selectedVaultStrategy}
                            onChange={(e) => setSelectedVaultStrategy(e.target.value)}
                          >
                            <option value="Conservative Vault">Conservative Vault</option>
                            <option value="Balanced Vault">Balanced Vault</option>
                            <option value="Aggressive Vault">Aggressive Vault</option>
                          </select>
                        </div>

                        {/* Investment Amount */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Investment Amount (ETH)</label>
                          <Input
                            type="number"
                            placeholder="0.0"
                            value={vaultAmount}
                            onChange={(e) => setVaultAmount(e.target.value)}
                            className="w-full"
                          />
                        </div>

                        {/* Stake Button */}
                        <StakeButton onStake={() => console.log(`Staking for vault: ${vault.vaultName}`)} />
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 