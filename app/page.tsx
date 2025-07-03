"use client"

import type React from "react"

import { Suspense } from "react"
import GlobalNav from "@/components/global-nav"
import HeroSection from "@/components/hero-section"
import NumbersSection from "@/components/numbers-section"
import ReferralSection from "@/components/referral-section"
import StakingRewards from "@/components/staking-rewards"
import RoiStructure from "@/components/roi-structure"
import Roadmap from "@/components/roadmap"
import TermsSection from "@/components/terms-section"
import Footer from "@/components/footer"
import NetworkCheckBanner from "@/components/network-check-banner"

// Error boundary fallback component
function ErrorFallback({ error }: { error?: Error }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4 text-center">
      <h2 className="mb-4 text-2xl font-bold text-yellow-400">Something went wrong</h2>
      <p className="mb-6 text-gray-400">We're experiencing some technical difficulties. Please try again later.</p>
      <button
        onClick={() => window.location.reload()}
        className="rounded bg-yellow-400 px-4 py-2 text-black hover:bg-yellow-500"
      >
        Refresh Page
      </button>
    </div>
  )
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black">
      <div className="text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto h-12 w-12 animate-spin text-yellow-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="2" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="22" />
          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
          <line x1="2" y1="12" x2="6" y2="12" />
          <line x1="18" y1="12" x2="22" y2="12" />
          <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
          <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
        </svg>
        <p className="mt-4 text-lg text-gray-400">Loading META HEROIC...</p>
      </div>
    </div>
  )
}

// Wrap each section in error boundaries
function SafeSection({ children }: { children: React.ReactNode }) {
  try {
    return <>{children}</>
  } catch (error) {
    console.error("Section error:", error)
    return null // Skip rendering this section if it errors
  }
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Suspense fallback={<LoadingFallback />}>
        <SafeSection>
          <NetworkCheckBanner />
        </SafeSection>
        <SafeSection>
          <GlobalNav />
        </SafeSection>
        <SafeSection>
          <HeroSection />
        </SafeSection>
        <SafeSection>
          <NumbersSection />
        </SafeSection>
        <SafeSection>
          <ReferralSection />
        </SafeSection>
        <SafeSection>
          <StakingRewards />
        </SafeSection>
        <SafeSection>
          <RoiStructure />
        </SafeSection>
        <SafeSection>
          <Roadmap />
        </SafeSection>
        <SafeSection>
          <TermsSection />
        </SafeSection>
        <SafeSection>
          <Footer />
        </SafeSection>
      </Suspense>
    </main>
  )
}
