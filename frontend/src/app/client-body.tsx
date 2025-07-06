"use client";

import '@rainbow-me/rainbowkit/styles.css'
import { OnchainKitProvider } from "@coinbase/onchainkit"
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/lib/queryClient'
import {
  baseSepolia, base
} from 'wagmi/chains';

const projectId = process.env.RAINBOW_KIT_PROJECT_ID
const RAINVOW_KIT_PROJECT_ID = `${projectId}`

const BASE_API_KEY = process.env.COINBASE_TOKEN
const PROJECT_ID = process.env.BASE_PROJECT_ID

const config = getDefaultConfig({
  appName: 'Ataeru',
  projectId: `${RAINVOW_KIT_PROJECT_ID}`,
  chains: [baseSepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

export function ClientBody({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <OnchainKitProvider
        apiKey={BASE_API_KEY}
        projectId={PROJECT_ID}
        chain={base}
        config={{
          appearance: {
            name: "Zero 2.0",
            logo: "https://pbs.twimg.com/profile_images/1902457858232287232/lLiKq_s__400x400.jpg",
            mode: "light",
            theme: "base",
          },
          wallet: {
            display: "modal",
            termsUrl: "https://cryptotraderpro.com/terms",
            privacyUrl: "https://cryptotraderpro.com/privacy",
          },
        }}
      >
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      </OnchainKitProvider>
    </WagmiProvider>
  )
}
