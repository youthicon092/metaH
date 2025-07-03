import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function ReferralSection() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="bg-white rounded-lg overflow-hidden">
            <Image src="/images/referral.png" alt="Refer a friend" width={500} height={600} className="w-full h-auto" />
          </div>

          <div>
            <h3 className="text-yellow-400 text-2xl font-bold mb-2">THE</h3>
            <h2 className="text-5xl font-bold mb-8">Referral Program</h2>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-yellow-400 p-2 rounded-md mt-1">
                  <span className="text-black">★</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Global Inclusion</h3>
                  <p className="text-gray-400">
                    Join our worldwide community and earn rewards by inviting others to the META HEROIC ecosystem.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-yellow-400 p-2 rounded-md mt-1">
                  <span className="text-black">⚡</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Referrals and Actions</h3>
                  <p className="text-gray-400">
                    Earn additional rewards through referrals and completing various platform activities.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-yellow-400 p-2 rounded-md mt-1">
                  <span className="text-black">?</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Instant Rewards</h3>
                  <p className="text-gray-400">
                    Get rewarded instantly when your referrals join and stake on the platform.
                  </p>
                </div>
              </div>
            </div>

            <Button className="mt-8 bg-yellow-400 text-black hover:bg-yellow-500 px-8 py-6 text-lg font-medium">
              Start Referring
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
