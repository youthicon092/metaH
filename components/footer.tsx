import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-yellow-400 text-xl font-bold mb-4">META HEROIC</h3>
            <p className="text-gray-400 text-sm">Building the future of crypto staking</p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-yellow-400 text-sm">
                  Stake
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-yellow-400 text-sm">
                  Learn
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-yellow-400 text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Community</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-yellow-400 text-sm">
                  Discord
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-yellow-400 text-sm">
                  Twitter
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-yellow-400 text-sm">
                  Telegram
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Subscribe</h4>
            <div className="flex">
              <Input type="email" placeholder="Enter your email" className="bg-gray-900 border-gray-700 text-white" />
              <Button className="ml-2 bg-yellow-400 text-black hover:bg-yellow-500">Join</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-gray-500 text-sm">© 2024 META HEROIC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
