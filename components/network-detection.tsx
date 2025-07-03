"use client"

import { useEffect } from "react"
import { useWallet } from "@/contexts/wallet-context"
import { useToast } from "@/components/ui/use-toast"

// This component doesn't render anything visible
// It just handles network detection and switching logic
export default function NetworkDetection() {
  const { isConnected, isCorrectNetwork, switchToPolygon, networkId } = useWallet()
  const { toast } = useToast()

  // Get network name for display
  const getNetworkName = (id: number | null) => {
    if (!id) return "Unknown"

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
  }

  useEffect(() => {
    // Check if connected but on wrong network
    if (isConnected && !isCorrectNetwork) {
      // Show toast notification
      toast({
        title: "Wrong Network Detected",
        description: `You are connected to ${getNetworkName(networkId)}. META HEROIC requires Polygon Network.`,
        variant: "destructive",
        duration: 10000, // Show for 10 seconds
        action: (
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
            onClick={switchToPolygon}
          >
            Switch to Polygon
          </button>
        ),
      })
    }
  }, [isConnected, isCorrectNetwork, networkId])

  // This component doesn't render anything visible
  return null
}
