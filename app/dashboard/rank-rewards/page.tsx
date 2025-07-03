"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useWallet } from "@/contexts/wallet-context"
import contractService from "@/lib/contract-service"
import DashboardLayout from "@/components/dashboard-layout"
import { Lock, Star, Check, ArrowLeft } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface RankReward {
  rank: number
  stars: number
  reward: number
  isUnlocked: boolean
  requiredSelfBusiness: string
  requiredDirectTeam: number
  requiredDirectBusiness: string
  requiredTotalTeamBusiness: string
  requirementsMet: {
    selfBusiness: boolean
    directTeam: boolean
    directBusiness: boolean
    totalTeamBusiness: boolean
  }
}

export default function RankRewardsPage() {
  const { isConnected, address, userData, isCorrectNetwork, switchToPolygon } = useWallet()
  const [isLoading, setIsLoading] = useState(true)
  const [userLevel, setUserLevel] = useState(1)
  const [rankRewards, setRankRewards] = useState<RankReward[]>([])

  useEffect(() => {
    const fetchRankRewards = async () => {
      try {
        setIsLoading(true)

        // Initialize contract if not already initialized
        if (!contractService.isInitialized && address) {
          await contractService.setupWithAccount(address)
        }

        // Get user's current level
        let currentLevel = 1
        if (isConnected && address) {
          try {
            const userData = await contractService.getUserData(address)
            currentLevel = Number(userData.starLevel) || 1
            setUserLevel(currentLevel)
          } catch (error) {
            console.error("Error fetching user level:", error)
          }
        }

        // Get level requirements
        const levelRequirements = await contractService.getLevelRequirements()

        // Get user data to check requirements
        const userSelfBusiness = userData?.stakedAmount ? Number.parseFloat(userData.stakedAmount) : 0
        const userDirectTeam = userData?.directMembers ? Number.parseInt(userData.directMembers) : 0
        const userDirectBusiness = 0 // We don't have this data, so assume 0
        const userTotalTeamBusiness = userData?.totalTeamInvestment
          ? Number.parseFloat(userData.totalTeamInvestment)
          : 0

        // Fetch rank rewards for each level with the updated requirements
        const rewards = [
          {
            rank: 1,
            stars: 1,
            reward: 100,
            isUnlocked: false, // Set to false by default, will check requirements
            requiredSelfBusiness: "250",
            requiredDirectTeam: 20,
            requiredDirectBusiness: "500",
            requiredTotalTeamBusiness: "2000",
            requirementsMet: {
              selfBusiness: userSelfBusiness >= 250,
              directTeam: userDirectTeam >= 20,
              directBusiness: userDirectBusiness >= 500,
              totalTeamBusiness: userTotalTeamBusiness >= 2000,
            },
          },
          {
            rank: 2,
            stars: 2,
            reward: 250,
            isUnlocked: false,
            requiredSelfBusiness: "500",
            requiredDirectTeam: 50,
            requiredDirectBusiness: "1000",
            requiredTotalTeamBusiness: "4000",
            requirementsMet: {
              selfBusiness: userSelfBusiness >= 500,
              directTeam: userDirectTeam >= 50,
              directBusiness: userDirectBusiness >= 1000,
              totalTeamBusiness: userTotalTeamBusiness >= 4000,
            },
          },
          {
            rank: 3,
            stars: 3,
            reward: 500,
            isUnlocked: false,
            requiredSelfBusiness: "1000",
            requiredDirectTeam: 100,
            requiredDirectBusiness: "2000",
            requiredTotalTeamBusiness: "7000",
            requirementsMet: {
              selfBusiness: userSelfBusiness >= 1000,
              directTeam: userDirectTeam >= 100,
              directBusiness: userDirectBusiness >= 2000,
              totalTeamBusiness: userTotalTeamBusiness >= 7000,
            },
          },
          {
            rank: 4,
            stars: 4,
            reward: 1000,
            isUnlocked: false,
            requiredSelfBusiness: "2000",
            requiredDirectTeam: 200,
            requiredDirectBusiness: "4000",
            requiredTotalTeamBusiness: "12000",
            requirementsMet: {
              selfBusiness: userSelfBusiness >= 2000,
              directTeam: userDirectTeam >= 200,
              directBusiness: userDirectBusiness >= 4000,
              totalTeamBusiness: userTotalTeamBusiness >= 12000,
            },
          },
          {
            rank: 5,
            stars: 5,
            reward: 2000,
            isUnlocked: false,
            requiredSelfBusiness: "5000",
            requiredDirectTeam: 700,
            requiredDirectBusiness: "7000",
            requiredTotalTeamBusiness: "15000",
            requirementsMet: {
              selfBusiness: userSelfBusiness >= 5000,
              directTeam: userDirectTeam >= 700,
              directBusiness: userDirectBusiness >= 7000,
              totalTeamBusiness: userTotalTeamBusiness >= 15000,
            },
          },
        ]

        // Update isUnlocked based on all requirements being met
        const updatedRewards = rewards.map((reward) => {
          const allRequirementsMet =
            reward.requirementsMet.selfBusiness &&
            reward.requirementsMet.directTeam &&
            reward.requirementsMet.directBusiness &&
            reward.requirementsMet.totalTeamBusiness

          return {
            ...reward,
            isUnlocked: allRequirementsMet,
          }
        })

        setRankRewards(updatedRewards)
      } catch (error) {
        console.error("Error fetching rank rewards:", error)
        toast({
          title: "Error",
          description: "Failed to fetch rank rewards data. Using simulated data instead.",
          variant: "destructive",
        })

        // Set default rewards if there's an error
        const defaultRewards = [
          {
            rank: 1,
            stars: 1,
            reward: 100,
            isUnlocked: false,
            requiredSelfBusiness: "250",
            requiredDirectTeam: 20,
            requiredDirectBusiness: "500",
            requiredTotalTeamBusiness: "2000",
            requirementsMet: {
              selfBusiness: false,
              directTeam: false,
              directBusiness: false,
              totalTeamBusiness: false,
            },
          },
          {
            rank: 2,
            stars: 2,
            reward: 250,
            isUnlocked: false,
            requiredSelfBusiness: "500",
            requiredDirectTeam: 50,
            requiredDirectBusiness: "1000",
            requiredTotalTeamBusiness: "4000",
            requirementsMet: {
              selfBusiness: false,
              directTeam: false,
              directBusiness: false,
              totalTeamBusiness: false,
            },
          },
          {
            rank: 3,
            stars: 3,
            reward: 500,
            isUnlocked: false,
            requiredSelfBusiness: "1000",
            requiredDirectTeam: 100,
            requiredDirectBusiness: "2000",
            requiredTotalTeamBusiness: "7000",
            requirementsMet: {
              selfBusiness: false,
              directTeam: false,
              directBusiness: false,
              totalTeamBusiness: false,
            },
          },
          {
            rank: 4,
            stars: 4,
            reward: 1000,
            isUnlocked: false,
            requiredSelfBusiness: "2000",
            requiredDirectTeam: 200,
            requiredDirectBusiness: "4000",
            requiredTotalTeamBusiness: "12000",
            requirementsMet: {
              selfBusiness: false,
              directTeam: false,
              directBusiness: false,
              totalTeamBusiness: false,
            },
          },
          {
            rank: 5,
            stars: 5,
            reward: 2000,
            isUnlocked: false,
            requiredSelfBusiness: "5000",
            requiredDirectTeam: 700,
            requiredDirectBusiness: "7000",
            requiredTotalTeamBusiness: "15000",
            requirementsMet: {
              selfBusiness: false,
              directTeam: false,
              directBusiness: false,
              totalTeamBusiness: false,
            },
          },
        ]
        setRankRewards(defaultRewards)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRankRewards()
  }, [isConnected, address, userLevel, toast, userData])

  if (!isConnected) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <Alert className="bg-yellow-900/20 border-yellow-600">
            <AlertDescription>Please connect your wallet to view rank rewards.</AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    )
  }

  if (!isCorrectNetwork) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <Alert className="bg-red-900/20 border-red-600">
            <AlertDescription>
              Please switch to the Polygon network to view rank rewards.
              <Button className="mt-2 bg-red-500 hover:bg-red-600 text-white" onClick={switchToPolygon}>
                Switch to Polygon
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4">
        {/* Add back button */}
        <div className="mb-4">
          <Link href="/dashboard" className="inline-flex items-center text-yellow-400 hover:text-yellow-500">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Rank Rewards</h1>
          <p className="text-gray-400">Unlock rewards by achieving higher ranks</p>
        </div>

        <Card className="bg-gray-900/50 border border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Your Current Rank</CardTitle>
            <CardDescription className="text-gray-400">
              You are currently at Level {userLevel}. Stake more and refer others to increase your rank.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 mx-1 flex items-center justify-center rounded-full ${
                      i < userLevel ? "bg-yellow-400 text-black" : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    <Star className="h-5 w-5" />
                  </div>
                ))}
              <span className="ml-4 text-white font-medium">Level {userLevel}</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {isLoading
            ? Array(5)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="bg-gray-800/50 border border-gray-700 animate-pulse">
                    <CardContent className="p-6 h-64">
                      <div className="h-8 bg-gray-700 rounded mb-4 w-1/2"></div>
                      <div className="h-16 bg-gray-700 rounded mb-4 w-full"></div>
                      <div className="h-4 bg-gray-700 rounded mb-2 w-full"></div>
                      <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))
            : rankRewards.map((reward) => (
                <Card
                  key={reward.rank}
                  className={`relative overflow-hidden ${
                    reward.isUnlocked
                      ? "bg-gradient-to-br from-yellow-900/30 to-yellow-600/10 border-yellow-600"
                      : "bg-gray-900/50 border-gray-800"
                  }`}
                >
                  {!reward.isUnlocked && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                      <Lock className="h-12 w-12 text-gray-400" />
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="mr-2">Rank {reward.rank}</span>
                      <div className="flex">
                        {Array(reward.stars)
                          .fill(0)
                          .map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${reward.isUnlocked ? "text-yellow-400" : "text-gray-600"}`}
                            />
                          ))}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6 flex justify-center">
                      <div
                        className={`w-24 h-24 rounded-full flex items-center justify-center ${
                          reward.isUnlocked ? "bg-yellow-400 text-black" : "bg-gray-800 text-gray-400"
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl font-bold">{reward.reward}</div>
                          <div className="text-xs">USDT</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Self Business:</span>
                        <span className={reward.requirementsMet?.selfBusiness ? "text-green-400" : "text-white"}>
                          {reward.requiredSelfBusiness} USDT
                          {reward.requirementsMet?.selfBusiness && <Check className="inline ml-1 h-4 w-4" />}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Direct Team:</span>
                        <span className={reward.requirementsMet?.directTeam ? "text-green-400" : "text-white"}>
                          {reward.requiredDirectTeam}
                          {reward.requirementsMet?.directTeam && <Check className="inline ml-1 h-4 w-4" />}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Direct Business:</span>
                        <span className={reward.requirementsMet?.directBusiness ? "text-green-400" : "text-white"}>
                          {reward.requiredDirectBusiness} USDT
                          {reward.requirementsMet?.directBusiness && <Check className="inline ml-1 h-4 w-4" />}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Team Business:</span>
                        <span className={reward.requirementsMet?.totalTeamBusiness ? "text-green-400" : "text-white"}>
                          {reward.requiredTotalTeamBusiness} USDT
                          {reward.requirementsMet?.totalTeamBusiness && <Check className="inline ml-1 h-4 w-4" />}
                        </span>
                      </div>
                    </div>

                    {reward.isUnlocked && (
                      <div className="mt-4 bg-green-900/20 border border-green-600/30 rounded-md p-2 text-center">
                        <span className="text-green-400 text-sm flex items-center justify-center">
                          <Check className="mr-1 h-4 w-4" /> Unlocked
                        </span>
                      </div>
                    )}

                    {!reward.isUnlocked && (
                      <div className="mt-4 bg-red-900/20 border border-red-600/30 rounded-md p-2 text-center">
                        <span className="text-red-400 text-sm flex items-center justify-center">
                          <Lock className="mr-1 h-4 w-4" /> Complete all requirements to unlock
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
