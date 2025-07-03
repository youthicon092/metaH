"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import contractService, { type User } from "@/lib/contract-service"
import walletService, { TARGET_CHAIN_ID } from "@/lib/wallet-service"
import { useToast } from "@/components/ui/use-toast"

// Update the WalletContextType interface to include network information
interface WalletContextType {
  isConnected: boolean
  isConnecting: boolean
  isLoadingData: boolean
  address: string | null
  isOwner: boolean
  userData: User | null
  contractLimits: {
    minInvestment: string
    maxInvestment: string
    minWithdraw: string
    withdrawFeePercent: string
  } | null
  isPaused: boolean
  networkId: number | null
  isCorrectNetwork: boolean
  switchToPolygon: () => Promise<void>
  connect: () => Promise<void>
  disconnect: () => void
  refreshData: () => Promise<void>
  isDemoMode: boolean
  isMetaMaskInstalled: boolean
  formattedAddress: string | null
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

// Update the WalletProvider component to include network detection and switching
export function WalletProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [formattedAddress, setFormattedAddress] = useState<string | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [userData, setUserData] = useState<User | null>(null)
  const [contractLimits, setContractLimits] = useState(null)
  const [isPaused, setIsPaused] = useState(false)
  const [networkId, setNetworkId] = useState<number | null>(null)
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false)

  // Check if MetaMask is installed on component mount
  useEffect(() => {
    setIsMetaMaskInstalled(walletService.isMetaMaskInstalled())
  }, [])

  // Update the checkNetwork function to use our wallet service
  const checkNetwork = async () => {
    try {
      const chainId = await walletService.getChainId()
      setNetworkId(chainId)

      const isCorrect = chainId === TARGET_CHAIN_ID
      setIsCorrectNetwork(isCorrect)

      // If connected but on wrong network, show a toast notification
      if (isConnected && address && !isCorrect && chainId !== null) {
        toast({
          title: "Wrong Network Detected",
          description: "Please switch to Polygon network to use META HEROIC.",
          variant: "destructive",
        })
      }

      return isCorrect
    } catch (error) {
      console.error("Error checking network:", error)
      setNetworkId(null)
      setIsCorrectNetwork(false)
      return false
    }
  }

  // Enhance the switchToPolygon function to use our wallet service
  const switchToPolygon = async () => {
    try {
      const success = await walletService.switchToPolygon()

      if (success) {
        toast({
          title: "Network Switched",
          description: "Successfully switched to Polygon network.",
        })

        // Check network after switching
        await checkNetwork()

        // Refresh data if connected
        if (isConnected && address) {
          await refreshData()
        }
      } else {
        toast({
          title: "Network Error",
          description: "Failed to switch to Polygon network. Please try again.",
          variant: "destructive",
        })
      }

      return success
    } catch (error) {
      console.error("Error in switchToPolygon:", error)
      toast({
        title: "Network Error",
        description: "Failed to switch to Polygon network. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  // Connect to MetaMask using our wallet service
  const connect = async () => {
    try {
      setIsConnecting(true)

      // Check if MetaMask is installed
      if (!walletService.isMetaMaskInstalled()) {
        console.log("Running in demo mode - no MetaMask")
        setIsDemoMode(true)

        // Get mock address from contract service
        const mockAddress = await contractService.connect()
        setAddress(mockAddress)
        setFormattedAddress(walletService.formatAddress(mockAddress))
        setIsConnected(true)

        toast({
          title: "Demo Mode Active",
          description: "Connected with a demo wallet. Some features will use simulated data.",
          duration: 5000,
        })

        // Set mock data
        setIsOwner(false)
        const data = await contractService.getUserData(mockAddress)
        setUserData(data)
        const limits = await contractService.getContractLimits()
        setContractLimits(limits)
        const paused = await contractService.isPaused()
        setIsPaused(paused)

        return mockAddress
      }

      // Request accounts from MetaMask
      const accounts = await walletService.requestAccounts()

      if (accounts.length === 0) {
        throw new Error("No accounts found. Please make sure your wallet is unlocked.")
      }

      const connectedAddress = accounts[0]
      setAddress(connectedAddress)
      setFormattedAddress(walletService.formatAddress(connectedAddress))
      setIsConnected(true)
      setIsDemoMode(false)

      toast({
        title: "Wallet Connected",
        description: `Connected to ${walletService.formatAddress(connectedAddress)}`,
      })

      // Check network
      await checkNetwork()

      // Initialize contract service
      try {
        await contractService.setupWithAccount(connectedAddress)
      } catch (error) {
        console.error("Error initializing contract service:", error)
        // Don't fail the connection process, just show a warning
        toast({
          title: "Warning",
          description: "Connected with limited functionality. Some features may use simulated data.",
          duration: 5000,
        })
      }

      // Check if user is owner
      const ownerStatus = await contractService.isOwner(connectedAddress)
      setIsOwner(ownerStatus)

      // Get user data
      const data = await contractService.getUserData(connectedAddress)
      setUserData(data)

      // Get contract limits
      const limits = await contractService.getContractLimits()
      setContractLimits(limits)

      // Check if contract is paused
      const paused = await contractService.isPaused()
      setIsPaused(paused)

      return connectedAddress
    } catch (error: any) {
      console.error("Error connecting wallet:", error)

      // Handle user rejection separately
      if (error.message?.includes("User rejected") || error.code === 4001) {
        toast({
          title: "Connection Cancelled",
          description: "You rejected the connection request.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Connection Error",
          description: error.message || "Failed to connect wallet. Please try again.",
          variant: "destructive",
        })
      }

      throw error
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setIsConnected(false)
    setAddress(null)
    setFormattedAddress(null)
    setIsOwner(false)
    setUserData(null)
    setIsDemoMode(false)

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    })
  }

  // Improve the refreshData function to ensure all data is fetched from the contract
  // Update the refreshData function to ensure it's getting data from the contract
  const refreshData = async () => {
    if (!isConnected || !address) return

    try {
      setIsLoadingData(true)
      // Check network first
      await checkNetwork()

      // Initialize contract service if not already initialized
      if (!contractService.isInitialized) {
        console.log("Initializing contract service...")
        const success = await contractService.setupWithAccount(address)
        if (!success) {
          console.warn("Contract initialization failed, some data may be simulated")
          toast({
            title: "Warning",
            description: "Could not connect to blockchain. Some data may be simulated.",
            variant: "destructive",
          })
        } else {
          console.log("Contract service initialized successfully")
        }
      }

      // Get user data with retry mechanism
      try {
        console.log("Fetching user data from contract...")
        let userData = null
        let attempts = 0

        while (attempts < 3 && !userData) {
          try {
            userData = await contractService.getUserData(address)
            console.log("User data fetched successfully:", userData)
            setUserData(userData)
            break
          } catch (retryError) {
            attempts++
            console.warn(`Attempt ${attempts} to fetch user data failed, retrying...`)
            await new Promise((resolve) => setTimeout(resolve, 500))
          }
        }

        if (!userData) {
          throw new Error("Failed to fetch user data after multiple attempts")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast({
          title: "Warning",
          description: "Failed to fetch user data. Using cached data.",
          variant: "destructive",
        })
      }

      // Get contract limits with retry mechanism
      try {
        console.log("Fetching contract limits...")
        let contractLimits = null
        let attempts = 0

        while (attempts < 3 && !contractLimits) {
          try {
            contractLimits = await contractService.getContractLimits()
            console.log("Contract limits fetched successfully:", contractLimits)
            setContractLimits(contractLimits)
            break
          } catch (retryError) {
            attempts++
            console.warn(`Attempt ${attempts} to fetch contract limits failed, retrying...`)
            await new Promise((resolve) => setTimeout(resolve, 500))
          }
        }

        if (!contractLimits) {
          throw new Error("Failed to fetch contract limits after multiple attempts")
        }
      } catch (error) {
        console.error("Error fetching contract limits:", error)
        toast({
          title: "Warning",
          description: "Failed to fetch contract limits. Using default values.",
          variant: "destructive",
        })
      }

      // Check if contract is paused
      try {
        console.log("Checking if contract is paused...")
        const paused = await contractService.isPaused()
        console.log("Contract paused status:", paused)
        setIsPaused(paused)
      } catch (error) {
        console.error("Error checking if contract is paused:", error)
        toast({
          title: "Warning",
          description: "Could not determine if contract is paused. Assuming not paused.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Error refreshing data:", error)
      toast({
        title: "Data Error",
        description: error.message || "Failed to fetch data from the contract. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingData(false)
    }
  }

  // Set up event listeners for wallet changes
  useEffect(() => {
    // Only run this effect on the client side
    if (typeof window === "undefined") return

    // Set up listeners for account and chain changes
    const accountsChangedCleanup = walletService.onAccountsChanged((accounts) => {
      if (accounts.length === 0) {
        // User disconnected
        disconnect()
      } else if (accounts[0] !== address) {
        // Account changed
        setAddress(accounts[0])
        setFormattedAddress(walletService.formatAddress(accounts[0]))

        toast({
          title: "Account Changed",
          description: `Switched to ${walletService.formatAddress(accounts[0])}`,
        })

        refreshData()
      }
    })

    const chainChangedCleanup = walletService.onChainChanged((chainId) => {
      // Handle chain change
      const networkIdDecimal = Number.parseInt(chainId, 16)
      setNetworkId(networkIdDecimal)
      setIsCorrectNetwork(networkIdDecimal === TARGET_CHAIN_ID)

      toast({
        title: "Network Changed",
        description:
          networkIdDecimal === TARGET_CHAIN_ID
            ? "Connected to Polygon network."
            : "Connected to a different network. Some features may not work.",
        variant: networkIdDecimal === TARGET_CHAIN_ID ? "default" : "destructive",
      })

      // Refresh data if connected
      if (isConnected && address) {
        refreshData()
      }
    })

    const disconnectCleanup = walletService.onDisconnect((error) => {
      disconnect()
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet connection was terminated.",
      })
    })

    // Initial network check
    checkNetwork()

    // Cleanup function
    return () => {
      accountsChangedCleanup()
      chainChangedCleanup()
      disconnectCleanup()
    }
  }, [address, isConnected])

  // Check for existing connection on page load
  useEffect(() => {
    const checkExistingConnection = async () => {
      try {
        // Check if we're in a browser environment first
        if (typeof window === "undefined") return

        // Check if wallet service is available
        if (!walletService.isWalletAvailable()) {
          console.log("No wallet provider available")
          return
        }

        const accounts = await walletService.getAccounts().catch((err) => {
          console.warn("Error getting accounts, may not be connected:", err)
          return []
        })

        if (accounts.length > 0) {
          setAddress(accounts[0])
          setFormattedAddress(walletService.formatAddress(accounts[0]))
          setIsConnected(true)

          // Try to set up contract but don't fail if it doesn't work
          try {
            await contractService.setupWithAccount(accounts[0])
            await refreshData()
          } catch (setupError) {
            console.warn("Could not set up contract service, continuing in limited mode:", setupError)
            // Still consider the user connected even if contract setup fails
          }
        }
      } catch (error) {
        console.error("Error checking existing connection:", error)
        // Don't rethrow - we want the app to continue working even if wallet connection fails
      }
    }

    // Wrap in try-catch to prevent any errors from breaking the app
    try {
      checkExistingConnection()
    } catch (error) {
      console.error("Fatal error in wallet connection check:", error)
    }
  }, [])

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        isConnecting,
        isLoadingData,
        address,
        formattedAddress,
        isOwner,
        userData,
        contractLimits,
        isPaused,
        networkId,
        isCorrectNetwork,
        switchToPolygon,
        connect,
        disconnect,
        refreshData,
        isDemoMode,
        isMetaMaskInstalled,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
