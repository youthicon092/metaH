"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
// Import ethers directly
import * as ethers from "ethers"

declare global {
  interface Window {
    ethers: typeof ethers
  }
}

export default function EthersProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Make ethers available globally
    if (typeof window !== "undefined") {
      try {
        // Assign the imported ethers to window.ethers
        window.ethers = ethers
        console.log("Ethers.js loaded successfully via direct import")
        setIsLoaded(true)
      } catch (error) {
        console.error("Error setting up ethers:", error)
        setHasError(true)
        toast({
          title: "Warning",
          description: "Failed to load blockchain library. The app will work in demo mode.",
          variant: "destructive",
          duration: 5000,
        })
        // Still set as loaded so the app can continue in demo mode
        setIsLoaded(true)
      }
    } else {
      // We're in a server environment, mark as loaded to avoid blocking rendering
      setIsLoaded(true)
    }

    // Set a timeout to ensure we don't block rendering indefinitely
    const timeout = setTimeout(() => {
      if (!isLoaded) {
        console.warn("Ethers loading timed out, continuing in limited mode")
        setIsLoaded(true)
        setHasError(true)
      }
    }, 3000)

    return () => clearTimeout(timeout)
  }, [toast])

  // Show loading state until ethers is set up
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
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

  // If there was an error, show a warning but still render children
  if (hasError) {
    console.warn("Ethers.js had an error, continuing in limited mode")
  }

  return <>{children}</>
}
