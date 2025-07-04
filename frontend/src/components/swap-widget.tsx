"use client"
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Repeat2 } from "lucide-react";
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

export default function SwapWidget() {
  const [open, setOpen] = useState(false);
  const { address } = useAccount();

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
  const swappableTokens: Token[] = [ETH, USDC]; // Expand this array for more pairs

  return (
    <>
      {/* Floating Button */}
      <button
        className="fixed z-50 bottom-8 right-8 w-16 h-16 rounded-full bg-black shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open Swap"
      >
        <Repeat2 className="w-8 h-8 text-white" />
      </button>
      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md w-full p-0 rounded-2xl overflow-hidden bg-white shadow-2xl ml-48 scale-[0.9] lg:scale-75 lg:ml-[640px] mt-10">
          <div className="flex justify-between items-center px-6 py-4 border-b -mb-16">
            <span className="font-bold text-lg">Swap Tokens</span>
          </div>
          <div className="p-6">
            {/* OnchainKit Swap UI */}
            {address ? (
              <Swap className="bg-white">
                <SwapAmountInput
                  label="Sell"
                  swappableTokens={swappableTokens}
                  token={ETH}
                  type="from"
                  className="mt-4 bg-white"
                />
                <SwapToggleButton className="scale-[1.3] mt-2" />
                <SwapAmountInput
                  label="Buy"
                  swappableTokens={swappableTokens}
                  token={USDC}
                  type="to"
                  className="mt-4 bg-white"
                />
                <SwapButton />
                <SwapMessage />
                <SwapToast />
              </Swap>
            ) : (
              <div className="text-center text-gray-400">Connect your wallet to start swapping.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 