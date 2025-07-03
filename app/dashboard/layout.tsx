import type React from "react"
import NetworkCheckBanner from "@/components/network-check-banner"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black">
      <NetworkCheckBanner />
      {children}
    </div>
  )
}
