// Constants for network configuration
export const POLYGON_CHAIN_ID = 137 // Mainnet
export const POLYGON_TESTNET_CHAIN_ID = 80001 // Mumbai Testnet
export const TARGET_CHAIN_ID = POLYGON_CHAIN_ID // Change to POLYGON_TESTNET_CHAIN_ID if using testnet

export interface WalletProvider {
  isMetaMask?: boolean
  isTrust?: boolean
  request: (request: { method: string; params?: any[] }) => Promise<any>
  on: (eventName: string, callback: (...args: any[]) => void) => void
  removeListener: (eventName: string, callback: (...args: any[]) => void) => void
  selectedAddress?: string
  chainId?: string
}

class WalletService {
  // Check if we're in a browser environment
  private isBrowser(): boolean {
    return typeof window !== "undefined"
  }

  // Get the ethereum provider (MetaMask or other compatible wallets)
  getProvider(): WalletProvider | null {
    if (!this.isBrowser()) return null

    // Check for ethereum provider injected by MetaMask or other wallets
    return (window.ethereum as WalletProvider) || null
  }

  // Check if MetaMask is installed
  isMetaMaskInstalled(): boolean {
    const provider = this.getProvider()
    return Boolean(provider && provider.isMetaMask)
  }

  // Check if any wallet is available
  isWalletAvailable(): boolean {
    return Boolean(this.getProvider())
  }

  // Get current chain ID
  async getChainId(): Promise<number | null> {
    try {
      const provider = this.getProvider()
      if (!provider) return null

      const chainId = await provider.request({ method: "eth_chainId" })
      return Number.parseInt(chainId, 16)
    } catch (error) {
      console.error("Error getting chain ID:", error)
      return null
    }
  }

  // Check if connected to the correct network
  async isCorrectNetwork(): Promise<boolean> {
    const chainId = await this.getChainId()
    return chainId === TARGET_CHAIN_ID
  }

  // Request account access
  async requestAccounts(): Promise<string[]> {
    try {
      const provider = this.getProvider()
      if (!provider) {
        throw new Error("No wallet provider found")
      }

      const accounts = await provider.request({ method: "eth_requestAccounts" })
      return accounts
    } catch (error: any) {
      // Handle specific MetaMask errors
      if (error.code === 4001) {
        throw new Error("User rejected the connection request")
      }

      throw error
    }
  }

  // Get connected accounts without prompting
  async getAccounts(): Promise<string[]> {
    try {
      const provider = this.getProvider()
      if (!provider) return []

      const accounts = await provider.request({ method: "eth_accounts" })
      return accounts
    } catch (error) {
      console.error("Error getting accounts:", error)
      return []
    }
  }

  // Switch to Polygon network
  async switchToPolygon(): Promise<boolean> {
    try {
      const provider = this.getProvider()
      if (!provider) {
        throw new Error("No wallet provider found")
      }

      // Try to switch to Polygon network
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${TARGET_CHAIN_ID.toString(16)}` }],
      })

      return true
    } catch (error: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (error.code === 4902) {
        try {
          const provider = this.getProvider()
          if (!provider) throw new Error("No wallet provider found")

          await provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${TARGET_CHAIN_ID.toString(16)}`,
                chainName: TARGET_CHAIN_ID === POLYGON_CHAIN_ID ? "Polygon Mainnet" : "Polygon Mumbai Testnet",
                nativeCurrency: {
                  name: "MATIC",
                  symbol: "MATIC",
                  decimals: 18,
                },
                rpcUrls: [
                  TARGET_CHAIN_ID === POLYGON_CHAIN_ID
                    ? "https://polygon-rpc.com"
                    : "https://rpc-mumbai.maticvigil.com",
                ],
                blockExplorerUrls: [
                  TARGET_CHAIN_ID === POLYGON_CHAIN_ID ? "https://polygonscan.com" : "https://mumbai.polygonscan.com",
                ],
              },
            ],
          })

          return true
        } catch (addError) {
          console.error("Error adding Polygon network:", addError)
          return false
        }
      }

      console.error("Error switching network:", error)
      return false
    }
  }

  // Add event listener for account changes
  onAccountsChanged(callback: (accounts: string[]) => void): () => void {
    const provider = this.getProvider()
    if (!provider) return () => {}

    const wrappedCallback = (accounts: string[]) => {
      callback(accounts)
    }

    provider.on("accountsChanged", wrappedCallback)

    // Return cleanup function
    return () => {
      provider.removeListener("accountsChanged", wrappedCallback)
    }
  }

  // Add event listener for chain changes
  onChainChanged(callback: (chainId: string) => void): () => void {
    const provider = this.getProvider()
    if (!provider) return () => {}

    const wrappedCallback = (chainId: string) => {
      callback(chainId)
    }

    provider.on("chainChanged", wrappedCallback)

    // Return cleanup function
    return () => {
      provider.removeListener("chainChanged", wrappedCallback)
    }
  }

  // Add event listener for disconnect events
  onDisconnect(callback: (error: { code: number; message: string }) => void): () => void {
    const provider = this.getProvider()
    if (!provider) return () => {}

    const wrappedCallback = (error: { code: number; message: string }) => {
      callback(error)
    }

    provider.on("disconnect", wrappedCallback)

    // Return cleanup function
    return () => {
      provider.removeListener("disconnect", wrappedCallback)
    }
  }

  // Format address for display
  formatAddress(address: string): string {
    if (!address) return ""
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }
}

// Create a singleton instance
const walletService = new WalletService()

export default walletService
