"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import contractService from "@/lib/contract-service"
import { useWallet } from "@/contexts/wallet-context"
import { Trophy, Medal, Award, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface LeaderboardUser {
  address: string
  stakedAmount: string
  formattedAddress: string
  starLevel: string
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalStaked, setTotalStaked] = useState("0")
  const [totalUsers, setTotalUsers] = useState("0")
  const { toast } = useToast()
  const { isConnected, address } = useWallet()

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true)

        // Initialize contract if not already initialized
        if (isConnected && address && !contractService.isInitialized) {
          await contractService.setupWithAccount(address)
        }

        // Fetch leaderboard addresses from contract
        const addresses = await contractService.getLeaderboard()

        // Filter out zero addresses
        const validAddresses = addresses.filter(
          (address: string) => address !== "0x0000000000000000000000000000000000000000",
        )

        // Get user data for each address
        const usersData = await Promise.all(
          validAddresses.map(async (address: string) => {
            const userData = await contractService.getUserData(address)
            return {
              address,
              stakedAmount: userData.stakedAmount,
              formattedAddress: `${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
              starLevel: userData.starLevel,
            }
          }),
        )

        // Sort by staked amount
        const sortedUsers = usersData.sort(
          (a, b) => Number.parseFloat(b.stakedAmount) - Number.parseFloat(a.stakedAmount),
        )

        setLeaderboard(sortedUsers)

        // Calculate total staked
        const total = sortedUsers.reduce((sum, user) => sum + Number.parseFloat(user.stakedAmount), 0)
        setTotalStaked(total.toFixed(2))

        // Set total users
        setTotalUsers(sortedUsers.length.toString())
      } catch (error) {
        console.error("Error fetching leaderboard:", error)
        toast({
          title: "Error",
          description: "Failed to fetch leaderboard data from the blockchain. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()
  }, [isConnected, address, toast])

  return (
    <main className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        {/* Add back button */}
        <div className="mb-4">
          <Link href="/dashboard" className="inline-flex items-center text-yellow-400 hover:text-yellow-500">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-center mb-2">Leaderboard</h1>
        <p className="text-gray-400 text-center mb-8">Top stakers in META HEROIC</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-400">Total Stakers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-400">{totalUsers}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-400">Total Staked</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-400">{totalStaked} USDT</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-400">Average Stake</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-400">
                {totalUsers !== "0" ? (Number.parseFloat(totalStaked) / Number.parseInt(totalUsers)).toFixed(2) : "0"}{" "}
                USDT
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-900/50 border border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Top Stakers</CardTitle>
            <CardDescription className="text-gray-400">Users with the highest staked amounts</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="bg-gray-800/50 border border-gray-700 animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-6 bg-gray-700 rounded mb-4 w-1/3"></div>
                        <div className="h-4 bg-gray-700 rounded mb-2 w-full"></div>
                        <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No stakers found. Be the first to stake!</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {leaderboard.map((user, index) => (
                  <Card
                    key={user.address}
                    className={`${
                      index === 0
                        ? "bg-yellow-900/20 border-yellow-600"
                        : index === 1
                          ? "bg-gray-300/10 border-gray-500"
                          : index === 2
                            ? "bg-yellow-700/10 border-yellow-700"
                            : "bg-gray-800/50 border-gray-700"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        {index === 0 ? (
                          <Trophy className="h-8 w-8 text-yellow-400" />
                        ) : index === 1 ? (
                          <Medal className="h-8 w-8 text-gray-300" />
                        ) : index === 2 ? (
                          <Award className="h-8 w-8 text-yellow-700" />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                            <span className="text-white font-bold">{index + 1}</span>
                          </div>
                        )}
                        <div className="bg-blue-600 px-3 py-1 rounded-full">
                          <span className="text-white font-medium">Level {user.starLevel}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold mb-2">{user.formattedAddress}</h3>
                      <p className="text-gray-400">
                        Staked: <span className="text-yellow-400 font-bold">{user.stakedAmount} USDT</span>
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
