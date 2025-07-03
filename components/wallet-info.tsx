"use client"

import { useWallet } from "@/contexts/wallet-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExternalLink, Copy, CheckCircle } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export default function WalletInfo() {
  const { isConnected, address, networkId, isCorrectNetwork, switchToPolygon, isDemoMode } = useWallet()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

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

  // Get explorer URL based on network
  const getExplorerUrl = (address: string) => {
    if (networkId === 137) {
      return `https://polygonscan.com/address/${address}`
    } else if (networkId === 80001) {
      return `https://mumbai.polygonscan.com/address/${address}`
    } else if (networkId === 1) {
      return `https://etherscan.io/address/${address}`
    } else if (networkId === 56) {
      return `https://bscscan.com/address/${address}`
    } else {
      return `https://etherscan.io/address/${address}`
    }
  }

  // Copy address to clipboard
  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      })

      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
  }

  if (!isConnected) {
    return (
      <Card className="bg-gray-900/50 border border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Wallet Information</CardTitle>
          <CardDescription className="text-gray-400">Connect your wallet to view details</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-yellow-900/20 border-yellow-600">
            <AlertTitle>Not Connected</AlertTitle>
            <AlertDescription>Please connect your wallet to view your wallet information.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900/50 border border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Wallet Information</CardTitle>
        <CardDescription className="text-gray-400">
          {isDemoMode ? "Demo wallet details" : "Your connected wallet details"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isDemoMode && (
          <Alert className="bg-yellow-900/20 border-yellow-600 mb-4">
            <AlertTitle>Demo Mode</AlertTitle>
            <AlertDescription>
              You are currently in demo mode. Connect a real wallet for full functionality.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <div className="text-sm text-gray-400">Wallet Address</div>
          <div className="flex items-center gap-2">
            <div className="bg-gray-800 p-2 rounded-md text-sm font-mono flex-1 truncate">{address}</div>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={copyAddress} title="Copy address">
              {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
            {!isDemoMode && (
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => window.open(getExplorerUrl(address!), "_blank")}
                title="View on explorer"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-gray-400">Network</div>
          <div className="flex items-center gap-2">
            <div
              className={`px-3 py-1 rounded-full text-sm ${
                isCorrectNetwork
                  ? "bg-green-900/30 text-green-400 border border-green-800"
                  : "bg-red-900/30 text-red-400 border border-red-800"
              }`}
            >
              {getNetworkName(networkId)}
            </div>
            {!isCorrectNetwork && !isDemoMode && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                onClick={switchToPolygon}
              >
                Switch to Polygon
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      {isDemoMode && (
        <CardFooter>
          <Button
            variant="outline"
            className="w-full border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
            onClick={() => window.open("https://metamask.io/download/", "_blank")}
          >
            Install MetaMask <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
