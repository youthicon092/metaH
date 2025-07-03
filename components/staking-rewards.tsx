import { Button } from "@/components/ui/button"

export default function StakingRewards() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-5xl font-bold text-yellow-400 mb-4">Staking Rewards</h2>
        <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
          Start earning passive income with our high-yield staking program
        </p>

        <div className="bg-gray-900/70 rounded-lg border border-gray-800 p-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center">
              <div className="bg-gray-800 p-4 rounded-md mb-4 w-16 h-16 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-yellow-400 w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Daily ROI</h3>
              <p className="text-yellow-400 text-5xl font-bold mb-2">1%</p>
              <p className="text-gray-400">Daily returns</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-gray-800 p-4 rounded-md mb-4 w-16 h-16 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-yellow-400 w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Monthly</h3>
              <p className="text-yellow-400 text-5xl font-bold mb-2">30%</p>
              <p className="text-gray-400">Compound gains</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-gray-800 p-4 rounded-md mb-4 w-16 h-16 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-yellow-400 w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">6 Months</h3>
              <p className="text-yellow-400 text-5xl font-bold mb-2">200%</p>
              <p className="text-gray-400">Double investment</p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="flex items-center">
                <span className="text-yellow-400 mr-2">•</span>
                <p className="text-gray-300 text-sm">Minimum Stake: 5 USDT</p>
              </div>

              <div className="flex items-center">
                <span className="text-yellow-400 mr-2">•</span>
                <p className="text-gray-300 text-sm">Minimum Withdraw: 4 USDT</p>
              </div>

              <div className="flex items-center">
                <span className="text-yellow-400 mr-2">•</span>
                <p className="text-gray-300 text-sm">Daily Rewards Distribution</p>
              </div>

              <div className="flex items-center">
                <span className="text-yellow-400 mr-2">•</span>
                <p className="text-gray-300 text-sm">Compound Interest Available</p>
              </div>
            </div>
          </div>

          <Button className="bg-yellow-400 text-black hover:bg-yellow-500 px-8 py-2 text-lg font-medium">
            Start Staking
          </Button>
        </div>
      </div>
    </section>
  )
}
