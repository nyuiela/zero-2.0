"use client";

import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/lib/queryClient'
import {
  baseSepolia,
} from 'wagmi/chains';

const projectId = process.env.RAINBOW_KIT_PROJECT_ID
const RAINVOW_KIT_PROJECT_ID = `${projectId}`
const config = getDefaultConfig({
  appName: 'Ataeru',
  projectId: `${RAINVOW_KIT_PROJECT_ID}`,
  chains: [baseSepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

export function ClientBody({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </WagmiProvider>
  )
}
