"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useWallet } from "@/contexts/wallet-context"
import contractService from "@/lib/contract-service"
import DashboardLayout from "@/components/dashboard-layout"
import { Trophy, Medal, Award } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface LeaderboardUser {
  address: string
  stakedAmount: string
  formattedAddress: string
  starLevel: string
}

export default function Dashboard() {
  const { isConnected, address, userData, refreshData } = useWallet()
  const [totalMembers, setTotalMembers] = useState("0")
  const [totalStaked, setTotalStaked] = useState("0")
  const [isLoading, setIsLoading] = useState(true)
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])

  // Improve the dashboard data fetching to ensure all data comes from the contract
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)

        // Initialize contract if not already initialized
        if (!contractService.isInitialized && address) {
          await contractService.setupWithAccount(address)
        }

        // Fetch total members directly from contract with retries
        try {
          console.log("Fetching total members from contract...")
          let attempts = 0
          let totalMembersCount

          // Try up to 3 times to get the data from the contract
          while (attempts < 3) {
            try {
              totalMembersCount = await contractService.getTotalMembers()
              console.log("Total members fetched successfully:", totalMembersCount)
              break
            } catch (retryError) {
              attempts++
              console.warn(`Attempt ${attempts} failed, retrying...`)
              // Short delay before retry
              await new Promise((resolve) => setTimeout(resolve, 500))
            }
          }

          if (totalMembersCount !== undefined) {
            // Always use the value from the contract, which will be 0 if no users have invested
            setTotalMembers(totalMembersCount.toString())
          } else {
            // If we couldn't get a value after retries, use 0
            setTotalMembers("0")
          }
        } catch (error) {
          console.error("Error fetching total members:", error)
          // Use 0 as the default value if there's an error
          setTotalMembers("0")
        }

        // Fetch leaderboard data - this will try to get from contract first
        try {
          console.log("Fetching leaderboard data...")
          const leaderboardAddresses = await contractService.getLeaderboard()

          // Filter out zero addresses
          const validAddresses = leaderboardAddresses.filter(
            (addr: string) => addr !== "0x0000000000000000000000000000000000000000",
          )

          console.log(`Found ${validAddresses.length} valid addresses in leaderboard`)

          // Get user data for each address - this will try to get from contract first
          const usersData = await Promise.all(
            validAddresses.map(async (address: string) => {
              try {
                console.log(`Fetching data for address: ${address}`)
                const userData = await contractService.getUserData(address)
                return {
                  address,
                  stakedAmount: userData.stakedAmount,
                  formattedAddress: `${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
                  starLevel: userData.starLevel,
                }
              } catch (error) {
                console.warn(`Error fetching user data for ${address}, skipping:`, error)
                return null
              }
            }),
          )

          // Filter out null values from failed user data fetches
          const validUsersData = usersData.filter(Boolean)
          console.log(`Successfully fetched data for ${validUsersData.length} users`)

          // Sort by staked amount
          const sortedUsers = validUsersData.sort(
            (a, b) => Number.parseFloat(b.stakedAmount) - Number.parseFloat(a.stakedAmount),
          )

          setLeaderboard(sortedUsers)

          // Calculate total staked
          const total = sortedUsers.reduce((sum, user) => sum + Number.parseFloat(user.stakedAmount), 0)
          setTotalStaked(total.toFixed(2))
          console.log(`Total staked amount: ${total.toFixed(2)}`)
        } catch (error) {
          console.error("Error fetching leaderboard:", error)
          toast({
            title: "Data Error",
            description: "Could not fetch leaderboard data from contract.",
            variant: "destructive",
          })
          setLeaderboard([])
          setTotalStaked("0")
        }

        // Refresh user data to ensure it's up to date
        if (isConnected && address) {
          try {
            console.log("Refreshing user data...")
            const freshUserData = await contractService.getUserData(address)
            console.log("User data refreshed successfully")

            // This will update the userData in the wallet context
            if (refreshData) {
              await refreshData().catch((err) => {
                console.error("Error refreshing data:", err)
                toast({
                  title: "Warning",
                  description: "Some data may not be up to date. Using cached data.",
                  variant: "destructive",
                })
              })
            }
          } catch (error) {
            console.error("Error refreshing user data:", error)
            toast({
              title: "Data Error",
              description: "Could not refresh user data from contract.",
              variant: "destructive",
            })
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch data from the blockchain. Using simulated data instead.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [isConnected, address, refreshData, toast])

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">Welcome to your META HEROIC dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-400">My Stake</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-400">{userData?.stakedAmount || "0"} USDT</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-400">My Level</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-400">L{userData?.starLevel || "1"}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-400">Total Members</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-400">{isLoading ? "..." : totalMembers}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-400">Total Staked</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-400">{isLoading ? "..." : totalStaked} USDT</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Daily Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Daily ROI</span>
                  <span className="font-medium text-yellow-400">1%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Your Daily Rewards</span>
                  <span className="font-medium text-white">
                    {(Number.parseFloat(userData?.stakedAmount || "0") * 0.01).toFixed(2)} USDT
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Monthly Projection</span>
                  <span className="font-medium text-white">
                    {(Number.parseFloat(userData?.stakedAmount || "0") * 0.01 * 30).toFixed(2)} USDT
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Referral Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Direct Referrals</span>
                  <span className="font-medium text-white">{userData?.directMembers || "0"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Team Investment</span>
                  <span className="font-medium text-white">{userData?.totalTeamInvestment || "0"} USDT</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Referral Earnings</span>
                  <span className="font-medium text-white">
                    {(Number.parseFloat(userData?.totalTeamInvestment || "0") * 0.05).toFixed(2)} USDT
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard Section */}
        <Card className="bg-gray-900/50 border border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Leaderboard</CardTitle>
            <CardDescription className="text-gray-400">Top stakers in META HEROIC</CardDescription>
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
                {leaderboard.slice(0, 6).map((user, index) => (
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
    </DashboardLayout>
  )
}
