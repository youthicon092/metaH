"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/contexts/wallet-context"

export default function NetworkCheckBanner() {
  const { isConnected, isCorrectNetwork, switchToPolygon, networkId } = useWallet()
  const [dismissed, setDismissed] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Get network name for display
  const getNetworkName = (id: number | null) => {
    if (!id) return "Unknown"

    try {
      switch (id) {
        case 1:
          return "Ethereum Mainnet"
        case 3:
          return "Ropsten Testnet"
        case 4:
          return "Rinkeby Testnet"
        case 5:
          return "Goerli Testnet"
        case 42:
          return "Kovan Testnet"
        case 56:
          return "Binance Smart Chain"
        case 97:
          return "BSC Testnet"
        case 137:
          return "Polygon Mainnet"
        case 80001:
          return "Polygon Mumbai"
        default:
          return `Network ID ${id}`
      }
    } catch (err) {
      console.error("Error getting network name:", err)
      return "Unknown Network"
    }
  }

  useEffect(() => {
    try {
      // Only show banner if connected but on wrong network and not dismissed
      setShowBanner(isConnected && !isCorrectNetwork && !dismissed)
    } catch (err) {
      console.error("Error in NetworkCheckBanner:", err)
      setError(err instanceof Error ? err : new Error("Unknown error"))
      setShowBanner(false)
    }
  }, [isConnected, isCorrectNetwork, dismissed])

  // If there's an error, don't show the banner
  if (error || !showBanner) return null

  return (
    <Alert className="rounded-none border-t-0 border-x-0 border-b border-red-600 bg-red-900/20 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-400 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <AlertDescription className="text-sm md:text-base">
            You are connected to {getNetworkName(networkId)}. META HEROIC requires Polygon Network.
          </AlertDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={switchToPolygon}>
            Switch to Polygon
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-gray-400 hover:text-white p-1"
            onClick={() => setDismissed(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </Button>
        </div>
      </div>
    </Alert>
  )
}
