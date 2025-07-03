import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-4">
              <span className="text-yellow-400">Revolutionizing</span>
              <br />
              Crypto Staking
            </h1>
            <p className="text-gray-300 mb-8 max-w-lg">
              Join the next generation of staking platform with enhanced rewards and security
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-yellow-400 text-black hover:bg-yellow-500 px-8 py-6 text-lg font-medium">
                Stake Now
              </Button>
              <Button
                variant="outline"
                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-6 text-lg font-medium"
              >
                Learn More
              </Button>
            </div>
          </div>

          <div className="bg-black/50 rounded-lg border border-gray-800 p-6">
            <h2 className="text-2xl font-bold mb-6">Staking Statistics</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 p-4 rounded-md">
                <p className="text-gray-400 text-sm mb-1">Total Staked</p>
                <p className="text-yellow-400 text-2xl font-bold">$0</p>
              </div>

              <div className="bg-gray-900 p-4 rounded-md">
                <p className="text-gray-400 text-sm mb-1">Minimum Stake</p>
                <p className="text-yellow-400 text-2xl font-bold">$5</p>
              </div>

              <div className="bg-gray-900 p-4 rounded-md">
                <p className="text-gray-400 text-sm mb-1">Total Users</p>
                <p className="text-yellow-400 text-2xl font-bold">0</p>
              </div>

              <div className="bg-gray-900 p-4 rounded-md">
                <p className="text-gray-400 text-sm mb-1">Payment</p>
                <p className="text-yellow-400 text-2xl font-bold">Instant</p>
              </div>
            </div>

            <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500 mt-6 py-6 text-lg font-medium">
              Start Staking
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
