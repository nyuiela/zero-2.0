import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Your Gateway to Supercar Auctions | SBX Cars by Supercar Blondie",
  description: "Join SBX Cars, the premier online auction platform for supercars and luxury vehicles. Bid on exclusive supercars, classic cars, and rare collectibles from around the globe.",
  keywords: "supercar auctions, luxury cars, car auctions, supercars, classic cars, SBX Cars, Supercar Blondie",
  openGraph: {
    title: "SBX Cars - Premium Supercar Auctions",
    description: "Discover your dream supercar at SBX Cars auction platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-inter antialiased bg-[#202626] text-white`}
      >
        <Header/>
        {children}
        <Footer />
      </body>
    </html>
  );
}
