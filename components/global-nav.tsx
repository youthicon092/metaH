"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import WalletConnect from "@/components/wallet-connect"
import { useWallet } from "@/contexts/wallet-context"
import { Button } from "@/components/ui/button"

export default function GlobalNav() {
  const pathname = usePathname()
  const { isConnected } = useWallet()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="border-b border-gray-800 bg-black">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-white">META HEROIC</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className={`text-sm font-medium ${isActive("/") ? "text-yellow-400" : "text-white hover:text-yellow-400"}`}
          >
            Home
          </Link>
          <Link
            href="/leaderboard"
            className={`text-sm font-medium ${isActive("/leaderboard") ? "text-yellow-400" : "text-white hover:text-yellow-400"}`}
          >
            Leaderboard
          </Link>
          <Link
            href="/daily-roi"
            className={`text-sm font-medium ${isActive("/daily-roi") ? "text-yellow-400" : "text-white hover:text-yellow-400"}`}
          >
            Daily ROI
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button className="bg-yellow-400 text-black hover:bg-yellow-500">Dashboard</Button>
          </Link>
          <WalletConnect />
        </div>
      </div>
    </header>
  )
}
