"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useWallet } from "@/contexts/wallet-context"
import contractService from "@/lib/contract-service"
import DashboardHeader from "@/components/dashboard-header"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export default function AdminPage() {
  const { isConnected, isOwner, address, isPaused, refreshData, isCorrectNetwork, switchToPolygon } = useWallet()
  const router = useRouter()
  const { toast } = useToast()

  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [withdrawAddress, setWithdrawAddress] = useState("")
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [isTogglingPause, setIsTogglingPause] = useState(false)

  // Redirect if not owner
  useEffect(() => {
    if (isConnected && !isOwner) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access the admin panel.",
        variant: "destructive",
      })
      router.push("/dashboard")
    }
  }, [isConnected, isOwner, router, toast])

  if (!isConnected) {
    return (
      <main className="min-h-screen bg-black">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-8">
          <Alert className="bg-yellow-900/20 border-yellow-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-yellow-400"
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
            <AlertTitle>Not Connected</AlertTitle>
            <AlertDescription>Please connect your wallet to access the admin panel.</AlertDescription>
          </Alert>
        </div>
      </main>
    )
  }

  if (!isCorrectNetwork) {
    return (
      <main className="min-h-screen bg-black">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-8">
          <Alert className="bg-red-900/20 border-red-600">
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
            <AlertTitle>Wrong Network</AlertTitle>
            <AlertDescription>
              Please switch to the Polygon network to access the admin panel.
              <Button className="mt-2 bg-red-500 hover:bg-red-600 text-white" onClick={switchToPolygon}>
                Switch to Polygon
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </main>
    )
  }

  // Handle withdraw funds
  const handleWithdrawFunds = async () => {
    if (!withdrawAmount || !withdrawAddress) {
      toast({
        title: "Error",
        description: "Please enter both amount and recipient address.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsWithdrawing(true)
      await contractService.withdrawFunds(withdrawAddress, withdrawAmount)

      toast({
        title: "Success",
        description: `Successfully withdrawn ${withdrawAmount} tokens to ${withdrawAddress.substring(0, 6)}...${withdrawAddress.substring(withdrawAddress.length - 4)}`,
      })

      setWithdrawAmount("")
      setWithdrawAddress("")
      await refreshData()
    } catch (error) {
      console.error("Error withdrawing funds:", error)
      toast({
        title: "Error",
        description: "Failed to withdraw funds. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsWithdrawing(false)
    }
  }

  // Handle toggle pause
  const handleTogglePause = async () => {
    try {
      setIsTogglingPause(true)

      if (isPaused) {
        await contractService.unpause()
        toast({
          title: "Success",
          description: "Contract has been unpaused.",
        })
      } else {
        await contractService.pause()
        toast({
          title: "Success",
          description: "Contract has been paused.",
        })
      }

      await refreshData()
    } catch (error) {
      console.error("Error toggling pause state:", error)
      toast({
        title: "Error",
        description: "Failed to toggle pause state. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsTogglingPause(false)
    }
  }

  if (isConnected && !isOwner) {
    return (
      <main className="min-h-screen bg-black">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-8">
          <Alert className="bg-red-900/20 border-red-600">
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
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>You do not have permission to access the admin panel.</AlertDescription>
          </Alert>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black">
      <DashboardHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-400">Manage your META HEROIC contract settings and funds</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Withdraw Funds</CardTitle>
              <CardDescription className="text-gray-400">
                Transfer tokens from the contract to any address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="withdraw-amount">Amount</Label>
                  <Input
                    id="withdraw-amount"
                    type="number"
                    placeholder="0.0"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="withdraw-address">Recipient Address</Label>
                  <Input
                    id="withdraw-address"
                    placeholder="0x..."
                    value={withdrawAddress}
                    onChange={(e) => setWithdrawAddress(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
                onClick={handleWithdrawFunds}
                disabled={isWithdrawing}
              >
                {isWithdrawing ? "Processing..." : "Withdraw Funds"}
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-gray-900/50 border border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Contract Status</CardTitle>
              <CardDescription className="text-gray-400">Pause or unpause the contract functionality</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-6">
                {isPaused ? (
                  <Alert className="bg-red-900/20 border-red-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="10" y1="15" x2="10" y2="9" />
                      <line x1="14" y1="15" x2="14" y2="9" />
                    </svg>
                    <AlertTitle>Contract Paused</AlertTitle>
                    <AlertDescription>All contract functions are currently paused.</AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="bg-green-900/20 border-green-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-400"
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
                    <AlertTitle>Contract Active</AlertTitle>
                    <AlertDescription>The contract is currently active and functioning normally.</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className={`w-full ${isPaused ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"} text-white`}
                onClick={handleTogglePause}
                disabled={isTogglingPause}
              >
                {isTogglingPause ? "Processing..." : isPaused ? "Unpause Contract" : "Pause Contract"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}
