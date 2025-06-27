import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ClientBody } from "./client-body";

export const metadata: Metadata = {
  title: "Your Gateway to Supercar Auctions onchain.",
  description: "Join ZERO, the premier online auction platform for supercars and luxury vehicles. Bid on exclusive supercars, classic cars, and rare collectibles from around the globe.",
  keywords: "supercar auctions, luxury cars, car auctions, supercars, classic cars, ZERO, Supercar Blondie",
  openGraph: {
    title: "ZERO - Premium Supercar Auctions",
    description: "Discover your dream supercar at ZERO auction platform",
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
      <body className="font-sans bg-background text-foreground min-h-screen">
        <ClientBody>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Footer />
          </div>
        </ClientBody>
      </body>
    </html>
  );
}
