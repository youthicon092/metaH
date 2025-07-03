"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <header className="border-b border-gray-800 bg-black">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold">META HEROIC</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium hover:text-yellow-400">
            What is META HEROIC
          </Link>
          <Link href="/leaderboard" className="text-sm font-medium hover:text-yellow-400">
            Leaderboard
          </Link>
          <Link href="/daily-roi" className="text-sm font-medium hover:text-yellow-400">
            Daily ROI
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button className="bg-yellow-400 text-black hover:bg-yellow-500">Dashboard</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
