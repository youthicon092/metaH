"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/contexts/wallet-context"
import Link from "next/link"

export default function DailyRoiPage() {
  const { isConnected } = useWallet()
  const [investmentAmount, setInvestmentAmount] = useState("100")
  const [days, setDays] = useState("30")

  // Calculate ROI
  const calculateROI = () => {
    const amount = Number.parseFloat(investmentAmount) || 0
    const period = Number.parseInt(days) || 0
    const dailyRate = 0.01 // 1% daily

    let total = amount
    const dailyReturns = []

    for (let i = 1; i <= period; i++) {
      const dailyProfit = total * dailyRate
      total += dailyProfit
      dailyReturns.push({
        day: i,
        profit: dailyProfit.toFixed(2),
        total: total.toFixed(2),
      })
    }

    return {
      initialInvestment: amount,
      finalAmount: total.toFixed(2),
      totalProfit: (total - amount).toFixed(2),
      profitPercentage: ((total / amount - 1) * 100).toFixed(2),
      dailyReturns: dailyReturns.slice(0, 10), // Show only first 10 days
    }
  }

  const roi = calculateROI()

  return (
    <main className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-2">Daily ROI Calculator</h1>
        <p className="text-gray-400 text-center mb-8">Calculate your potential earnings with META HEROIC</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">ROI Calculator</CardTitle>
              <CardDescription className="text-gray-400">
                Calculate your potential returns based on investment amount and time period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="investment-amount">Investment Amount (USDT)</Label>
                  <Input
                    id="investment-amount"
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="days">Time Period (Days)</Label>
                  <Input
                    id="days"
                    type="number"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Daily ROI:</span>
                    <span className="text-yellow-400 font-bold">1%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Initial Investment:</span>
                    <span className="text-white font-bold">{roi.initialInvestment} USDT</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Final Amount:</span>
                    <span className="text-white font-bold">{roi.finalAmount} USDT</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Profit:</span>
                    <span className="text-green-400 font-bold">+{roi.totalProfit} USDT</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Profit Percentage:</span>
                    <span className="text-green-400 font-bold">+{roi.profitPercentage}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {isConnected ? (
                <Link href="/dashboard/staking" className="w-full">
                  <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500">Start Staking Now</Button>
                </Link>
              ) : (
                <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500">Connect Wallet to Stake</Button>
              )}
            </CardFooter>
          </Card>

          <Card className="bg-gray-900/50 border border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Daily Returns</CardTitle>
              <CardDescription className="text-gray-400">Projected daily returns for the first 10 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-4 py-3 text-left text-gray-400">Day</th>
                      <th className="px-4 py-3 text-right text-gray-400">Daily Profit</th>
                      <th className="px-4 py-3 text-right text-gray-400">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roi.dailyReturns.map((day) => (
                      <tr key={day.day} className="border-b border-gray-800">
                        <td className="px-4 py-3">{day.day}</td>
                        <td className="px-4 py-3 text-right text-green-400">+{day.profit} USDT</td>
                        <td className="px-4 py-3 text-right font-bold">{day.total} USDT</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-md">
                <h3 className="text-yellow-400 font-bold mb-2">Compound Effect</h3>
                <p className="text-sm text-gray-300">
                  The power of compound interest means your investment grows exponentially over time. Reinvesting your
                  daily returns can significantly increase your overall profits.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
