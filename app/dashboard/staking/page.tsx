"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import DashboardHeader from "@/components/dashboard-header"
import { useWallet } from "@/contexts/wallet-context"
import contractService from "@/lib/contract-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Add imports for Link and ArrowLeft icon
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function StakingPage() {
  const { isConnected, address, userData, contractLimits, isPaused, refreshData, isCorrectNetwork, switchToPolygon } =
    useWallet()
  const { toast } = useToast()

  const [stakeAmount, setStakeAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [isStaking, setIsStaking] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [calculatorAmount, setCalculatorAmount] = useState("100")
  const [calculatedRewards, setCalculatedRewards] = useState({
    daily: "0",
    weekly: "0",
    monthly: "0",
  })
  const [tokenBalance, setTokenBalance] = useState("0")
  const [tokenAllowance, setTokenAllowance] = useState("0")
  const [needsApproval, setNeedsApproval] = useState(false)

  // Calculate rewards when calculator amount changes
  useEffect(() => {
    const amount = Number.parseFloat(calculatorAmount) || 0
    setCalculatedRewards({
      daily: (amount * 0.01).toFixed(2),
      weekly: (amount * 0.01 * 7).toFixed(2),
      monthly: (amount * 0.01 * 30).toFixed(2),
    })
  }, [calculatorAmount])

  // Fetch token balance and allowance
  useEffect(() => {
    const fetchTokenData = async () => {
      if (isConnected && address) {
        try {
          const balance = await contractService.getTokenBalance(address)
          setTokenBalance(balance)

          const allowance = await contractService.getTokenAllowance(address)
          setTokenAllowance(allowance)
        } catch (error) {
          console.error("Error fetching token data:", error)
        }
      }
    }

    fetchTokenData()
    // Refresh every 30 seconds
    const interval = setInterval(fetchTokenData, 30000)
    return () => clearInterval(interval)
  }, [isConnected, address])

  // Check if approval is needed when stake amount changes
  useEffect(() => {
    if (stakeAmount && tokenAllowance) {
      setNeedsApproval(Number.parseFloat(stakeAmount) > Number.parseFloat(tokenAllowance))
    } else {
      setNeedsApproval(false)
    }
  }, [stakeAmount, tokenAllowance])

  // Handle token approval
  const handleApprove = async () => {
    if (!stakeAmount) {
      toast({
        title: "Error",
        description: "Please enter an amount to stake.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsApproving(true)
      await contractService.approveTokens(stakeAmount)

      toast({
        title: "Success",
        description: `Successfully approved tokens for staking.`,
      })

      // Refresh allowance
      if (address) {
        const allowance = await contractService.getTokenAllowance(address)
        setTokenAllowance(allowance)
        setNeedsApproval(false)
      }
    } catch (error: any) {
      console.error("Error approving tokens:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to approve tokens. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsApproving(false)
    }
  }

  // Handle stake
  const handleStake = async () => {
    if (!stakeAmount) {
      toast({
        title: "Error",
        description: "Please enter an amount to stake.",
        variant: "destructive",
      })
      return
    }

    // Check if amount is valid
    if (Number.parseFloat(stakeAmount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive",
      })
      return
    }

    // Check if user has enough balance
    if (Number.parseFloat(stakeAmount) > Number.parseFloat(tokenBalance)) {
      toast({
        title: "Error",
        description: `Insufficient token balance. You have ${tokenBalance} tokens.`,
        variant: "destructive",
      })
      return
    }

    // Check if approval is needed
    if (needsApproval) {
      toast({
        title: "Approval Required",
        description: "Please approve tokens before staking.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsStaking(true)
      await contractService.stake(stakeAmount)

      toast({
        title: "Success",
        description: `Successfully staked ${stakeAmount} tokens.`,
      })

      setStakeAmount("")
      await refreshData()

      // Refresh token balance
      if (address) {
        const balance = await contractService.getTokenBalance(address)
        setTokenBalance(balance)
      }
    } catch (error: any) {
      console.error("Error staking:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to stake tokens. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsStaking(false)
    }
  }

  // Handle withdraw
  const handleWithdraw = async () => {
    if (!withdrawAmount) {
      toast({
        title: "Error",
        description: "Please enter an amount to withdraw.",
        variant: "destructive",
      })
      return
    }

    // Check if amount is valid
    if (Number.parseFloat(withdrawAmount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive",
      })
      return
    }

    // Check if user has enough staked
    if (userData && Number.parseFloat(withdrawAmount) > Number.parseFloat(userData.stakedAmount)) {
      toast({
        title: "Error",
        description: `Insufficient staked amount. You have ${userData.stakedAmount} tokens staked.`,
        variant: "destructive",
      })
      return
    }

    try {
      setIsWithdrawing(true)
      await contractService.withdraw(withdrawAmount)

      toast({
        title: "Success",
        description: `Successfully withdrawn ${withdrawAmount} tokens.`,
      })

      setWithdrawAmount("")
      await refreshData()

      // Refresh token balance
      if (address) {
        const balance = await contractService.getTokenBalance(address)
        setTokenBalance(balance)
      }
    } catch (error: any) {
      console.error("Error withdrawing:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to withdraw tokens. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsWithdrawing(false)
    }
  }

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
            <AlertDescription>Please connect your wallet to access staking features.</AlertDescription>
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
              Please switch to the Polygon network to use staking features.
              <Button className="mt-2 bg-red-500 hover:bg-red-600 text-white" onClick={switchToPolygon}>
                Switch to Polygon
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black">
      <DashboardHeader />

      {/* Add the back button at the top of the page, right after the header section */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link href="/dashboard" className="inline-flex items-center text-yellow-400 hover:text-yellow-500">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Staking</h1>
          <p className="text-gray-400">Stake your tokens and earn rewards</p>
        </div>

        {isPaused && (
          <Alert className="mb-6 bg-red-900/20 border-red-600">
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
            <AlertTitle>Contract Paused</AlertTitle>
            <AlertDescription>The contract is currently paused. Staking functions are unavailable.</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Staking Overview</CardTitle>
              <CardDescription className="text-gray-400">Your current staking status and rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Current Stake</span>
                  <span className="font-medium text-white">{userData?.stakedAmount || "0"} Tokens</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Token Balance</span>
                  <span className="font-medium text-white">{tokenBalance} Tokens</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Daily ROI</span>
                  <span className="font-medium text-yellow-400">1%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Daily Rewards</span>
                  <span className="font-medium text-white">
                    {(Number.parseFloat(userData?.stakedAmount || "0") * 0.01).toFixed(2)} Tokens
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Monthly Return</span>
                  <span className="font-medium text-white">
                    {(Number.parseFloat(userData?.stakedAmount || "0") * 0.01 * 30).toFixed(2)} Tokens
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">User Level</span>
                  <span className="font-medium text-white">L{userData?.starLevel || "1"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Rewards Calculator</CardTitle>
              <CardDescription className="text-gray-400">Estimate your potential earnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="calc-amount">Stake Amount</Label>
                  <Input
                    id="calc-amount"
                    type="number"
                    placeholder="0.0"
                    value={calculatorAmount}
                    onChange={(e) => setCalculatorAmount(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="bg-gray-800 p-3 rounded-md text-center">
                    <p className="text-xs text-gray-400 mb-1">Daily</p>
                    <p className="text-yellow-400 font-bold">{calculatedRewards.daily}</p>
                  </div>
                  <div className="bg-gray-800 p-3 rounded-md text-center">
                    <p className="text-xs text-gray-400 mb-1">Weekly</p>
                    <p className="text-yellow-400 font-bold">{calculatedRewards.weekly}</p>
                  </div>
                  <div className="bg-gray-800 p-3 rounded-md text-center">
                    <p className="text-xs text-gray-400 mb-1">Monthly</p>
                    <p className="text-yellow-400 font-bold">{calculatedRewards.monthly}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="stake" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="stake">Stake Tokens</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw Tokens</TabsTrigger>
          </TabsList>

          <TabsContent value="stake">
            <Card className="bg-gray-900/50 border border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Stake Tokens</CardTitle>
                <CardDescription className="text-gray-400">Stake your tokens to earn daily rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="stake-amount">Amount</Label>
                    <Input
                      id="stake-amount"
                      type="number"
                      placeholder="0.0"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      disabled={isPaused || isStaking || isApproving}
                    />
                    {contractLimits && (
                      <p className="text-xs text-gray-400">
                        Min: {contractLimits.minInvestment} | Max: {contractLimits.maxInvestment} | Balance:{" "}
                        {tokenBalance}
                      </p>
                    )}
                  </div>

                  <Alert className="bg-yellow-900/10 border-yellow-600/30">
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
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    <AlertDescription className="text-gray-400 text-sm">
                      Staking locks your tokens in the contract. You'll earn 1% daily rewards on your staked amount.
                      {needsApproval && (
                        <div className="mt-2 text-yellow-400">
                          You need to approve tokens before staking. Click the "Approve Tokens" button first.
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                {needsApproval ? (
                  <Button
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={handleApprove}
                    disabled={isApproving || isPaused || !stakeAmount || Number.parseFloat(stakeAmount) <= 0}
                  >
                    {isApproving ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-2 h-4 w-4 animate-spin"
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
                        Approving...
                      </>
                    ) : (
                      "Approve Tokens"
                    )}
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
                    onClick={handleStake}
                    disabled={isStaking || isPaused || !stakeAmount || Number.parseFloat(stakeAmount) <= 0}
                  >
                    {isStaking ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-2 h-4 w-4 animate-spin"
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
                        Staking...
                      </>
                    ) : (
                      "Stake Now"
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="withdraw">
            <Card className="bg-gray-900/50 border border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Withdraw Tokens</CardTitle>
                <CardDescription className="text-gray-400">Withdraw your staked tokens and rewards</CardDescription>
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
                      disabled={isPaused || isWithdrawing}
                    />
                    {contractLimits && (
                      <p className="text-xs text-gray-400">
                        Min: {contractLimits.minWithdraw} | Fee: {contractLimits.withdrawFeePercent}%
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-800 rounded-md">
                    <span className="text-gray-400">Available to withdraw:</span>
                    <span className="font-medium text-white">{userData?.stakedAmount || "0"} Tokens</span>
                  </div>

                  <Alert className="bg-yellow-900/10 border-yellow-600/30">
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
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    <AlertDescription className="text-gray-400 text-sm">
                      Withdrawals are subject to a {contractLimits?.withdrawFeePercent || "0"}% fee. Minimum withdrawal
                      amount is {contractLimits?.minWithdraw || "0"} tokens.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
                  onClick={handleWithdraw}
                  disabled={isWithdrawing || isPaused || !withdrawAmount || Number.parseFloat(withdrawAmount) <= 0}
                >
                  {isWithdrawing ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2 h-4 w-4 animate-spin"
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
                      Withdrawing...
                    </>
                  ) : (
                    "Withdraw Now"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
