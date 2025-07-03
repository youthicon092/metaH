"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useWallet } from "@/contexts/wallet-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExternalLink } from "lucide-react"

export default function WalletConnect() {
  const {
    isConnected,
    isConnecting,
    address,
    formattedAddress,
    connect,
    disconnect,
    isCorrectNetwork,
    switchToPolygon,
    networkId,
    isMetaMaskInstalled,
  } = useWallet()

  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Update the handleConnect function to be simpler and more robust
  const handleConnect = async () => {
    try {
      setError(null)

      // Check if MetaMask is installed
      if (!isMetaMaskInstalled) {
        setError("MetaMask not detected. Please install MetaMask to continue.")
        return
      }

      await connect()
      setOpen(false)
    } catch (error: any) {
      console.error(`Error connecting wallet:`, error)

      // Don't show error for user rejection as we already handle it in the context
      if (!error.message?.includes("User rejected") && error.code !== 4001) {
        setError(error.message || "Failed to connect wallet")
      }
    }
  }

  const handleSwitchNetwork = async () => {
    try {
      await switchToPolygon()
    } catch (error) {
      console.error("Error switching network:", error)
    }
  }

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

  return (
    <>
      {!isConnected ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-500 hover:bg-green-600 text-white">Connect Wallet</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800">
            <DialogHeader>
              <DialogTitle className="text-white">Connect your wallet</DialogTitle>
              <DialogDescription className="text-gray-400">Connect to META HEROIC with MetaMask</DialogDescription>
            </DialogHeader>

            {error && (
              <Alert className="bg-red-900/20 border-red-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-red-400"
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
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error}
                  {!isMetaMaskInstalled && (
                    <Button
                      variant="link"
                      className="text-yellow-400 p-0 h-auto mt-2 flex items-center"
                      onClick={() => window.open("https://metamask.io/download/", "_blank")}
                    >
                      Install MetaMask <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col items-center justify-center py-6">
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-32 w-full border-gray-700 hover:border-yellow-400 hover:bg-gray-800 text-white"
                onClick={handleConnect}
                disabled={isConnecting || !isMetaMaskInstalled}
              >
                {isConnecting ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 animate-spin mb-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="2" x2="12" y2="6" />
                    <line x1="12" y1="18" x2="12" y2="22" />
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                    <line x1="2" y1="12" x2="6" y2="12" />
                    <line x1="18" y1="12" x2="22" y2="12" />
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                  </svg>
                ) : (
                  <Image src="/images/metamask.png" alt="MetaMask" width={60} height={60} className="mb-2" />
                )}
                <span>{isConnecting ? "Connecting..." : "Connect with MetaMask"}</span>
              </Button>

              {!isMetaMaskInstalled && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-400 mb-2">MetaMask not detected</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                    onClick={() => window.open("https://metamask.io/download/", "_blank")}
                  >
                    Install MetaMask <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      ) : !isCorrectNetwork ? (
        <div className="flex items-center gap-2 flex-wrap">
          <Alert className="bg-red-900/20 border-red-600 py-1 px-3 mr-2 hidden md:flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-red-400 mr-2"
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
            <AlertDescription className="text-sm">
              Connected to {getNetworkName(networkId)}. Please switch to Polygon.
            </AlertDescription>
          </Alert>
          <Button
            variant="destructive"
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={handleSwitchNetwork}
          >
            Switch to Polygon
          </Button>
          <Button
            variant="outline"
            className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
            onClick={disconnect}
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Alert className="bg-green-900/20 border-green-600 py-1 px-3 mr-2 hidden md:flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-green-400 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <AlertDescription className="text-sm">Connected to Polygon Network</AlertDescription>
          </Alert>
          <Button
            variant="outline"
            className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
            onClick={disconnect}
          >
            {formattedAddress ||
              (address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : "")}
          </Button>
        </div>
      )}
    </>
  )
}
