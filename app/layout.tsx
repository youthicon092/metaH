import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { WalletProvider } from "@/contexts/wallet-context"
import { Toaster } from "@/components/ui/toaster"
import NetworkDetection from "@/components/network-detection"
import EthersProvider from "@/components/ethers-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "META HEROIC - Revolutionizing Crypto Staking",
  description: "Join the next generation of staking platform with enhanced rewards and security",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <EthersProvider>
            <WalletProvider>
              <NetworkDetection />
              {children}
              <Toaster />
            </WalletProvider>
          </EthersProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
