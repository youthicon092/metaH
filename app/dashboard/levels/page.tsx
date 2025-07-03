"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { useWallet } from "@/contexts/wallet-context"
import contractService from "@/lib/contract-service"
import { Lock } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { toast } from "@/components/ui/use-toast"

interface Level {
  id: number
  percentage: string
  requiredStake: string
  requiredReferrals: number
  isUnlocked: boolean
}

export default function LevelsPage() {
  const { isConnected, address, userData } = useWallet()
  const [totalMembers, setTotalMembers] = useState("0")
  const [userLevel, setUserLevel] = useState(0)
  const [levels, setLevels] = useState<Level[]>([
    { id: 1, percentage: "12%", requiredStake: "10", requiredReferrals: 0, isUnlocked: false },
    { id: 2, percentage: "8%", requiredStake: "20", requiredReferrals: 5, isUnlocked: false },
    { id: 3, percentage: "6%", requiredStake: "50", requiredReferrals: 15, isUnlocked: false },
    { id: 4, percentage: "4%", requiredStake: "80", requiredReferrals: 25, isUnlocked: false },
    { id: 5, percentage: "3%", requiredStake: "100", requiredReferrals: 50, isUnlocked: false },
    { id: 6, percentage: "3%", requiredStake: "200", requiredReferrals: 100, isUnlocked: false },
  ])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Initialize contract if not already initialized
        if (!contractService.isInitialized && address) {
          await contractService.setupWithAccount(address)
        }

        // Fetch total members - this will try to get from contract first
        const totalMembersCount = await contractService.getTotalMembers()
        setTotalMembers(totalMembersCount.toString())

        // If user is connected, check their level
        if (isConnected && address) {
          // Get fresh user data directly from contract
          const freshUserData = await contractService.getUserData(address)
          const userStarLevel = Number.parseInt(freshUserData.starLevel || "0")
          setUserLevel(userStarLevel)

          // Update levels based on user's current level
          setLevels((prev) =>
            prev.map((level) => ({
              ...level,
              isUnlocked: level.id <= userStarLevel,
            })),
          )
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch data from the blockchain. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [isConnected, address, userData, toast])

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Levels</h1>
          <p className="text-gray-400">View and unlock different levels to earn more rewards</p>
        </div>

        <Card className="bg-gray-900/50 border border-gray-800 p-6 mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Total members</h2>
          <span className="text-5xl font-bold">{totalMembers}</span>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((level) => (
            <Card
              key={level.id}
              className={`bg-white text-black p-6 rounded-lg relative overflow-hidden ${
                level.isUnlocked ? "border-yellow-400 border-2" : "opacity-80"
              }`}
            >
              <div className="absolute top-4 right-4 text-purple-600 font-bold text-xl">{level.percentage}</div>

              {!level.isUnlocked && (
                <div className="absolute top-4 right-4">
                  <Lock className="h-6 w-6 text-gray-500" />
                </div>
              )}

              <div className="flex justify-center mb-4">
                <div className="bg-blue-800 p-4 rounded-lg w-24 h-24 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-12 h-16 bg-purple-600 rounded-md flex items-center justify-center">
                      <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-center mb-4">Level {level.id}</h3>

              <div className="space-y-2 text-sm text-gray-700">
                <p>Required stake: {level.requiredStake} USDT</p>
                <p>Required referrals: {level.requiredReferrals}</p>
              </div>

              {!level.isUnlocked && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">Stake more and invite referrals to unlock this level</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
