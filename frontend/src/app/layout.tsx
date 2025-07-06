import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Footer from "@/components/footer";
import { ClientBody } from "./client-body";
import Header from "@/components/header";
import AuthInitializer from '@/components/auth-initializer';
// import '@coinbase/onchainkit/styles.css';
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import SwapWidget from '@/components/swap-widget';
import QueryProvider from "@/components/graph-ql/provider";

const outfit = Outfit({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Zero 2.0 - Decentralized Car Auctions",
  description: "Buy and sell cars through decentralized auctions powered by blockchain technology",
  keywords: "supercar auctions, luxury cars, car auctions, supercars, classic cars, ZERO, Supercar Blondie",
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    title: "ZERO - Premium Supercar Auctions",
    description: "Discover your dream supercar at ZERO auction platform",
    type: "website",
  },

};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <QueryProvider>

          <ClientBody>
            <Toaster />
            <SwapWidget />
            <AuthInitializer />
            <Header />
            <main>
              {children}
            </main>
            <Footer />
          </ClientBody>
        </QueryProvider>
      </body>
    </html>
  );
}
