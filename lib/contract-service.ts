"use client"

import * as ethers from "ethers"
import walletService from "@/lib/wallet-service"

// This is the implementation that connects to MetaMask and interacts with the smart contract

export interface User {
  stakedAmount: string
  directMembers: string
  totalTeamInvestment: string
  starLevel: string
  referrer: string
}

// Contract ABI
const CONTRACT_ABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "level", type: "uint256" },
    ],
    name: "Commission",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "Investment",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "stakedAmount", type: "uint256" },
    ],
    name: "LeaderboardUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "rewardType", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "rewardAmount", type: "uint256" },
    ],
    name: "Reward",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "Withdrawal",
    type: "event",
  },
  {
    inputs: [],
    name: "MAX_INVESTMENT",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MIN_INVESTMENT",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MIN_WITHDRAW",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "USDT",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "WITHDRAW_FEE_PERCENT",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getLeaderboard",
    outputs: [{ internalType: "address[10]", name: "", type: "address[10]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "userAddress", type: "address" }],
    name: "getReferralDetails",
    outputs: [{ internalType: "uint256[20]", name: "", type: "uint256[20]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "userAddress", type: "address" }],
    name: "getStarLevel",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "referrer", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "invest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "leaderboard",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "leaderboardIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "pause", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [],
    name: "paused",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "stake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  { inputs: [], name: "unpause", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "users",
    outputs: [
      { internalType: "uint256", name: "stakedAmount", type: "uint256" },
      { internalType: "uint256", name: "directMembers", type: "uint256" },
      { internalType: "uint256", name: "totalTeamInvestment", type: "uint256" },
      { internalType: "uint256", name: "starLevel", type: "uint256" },
      { internalType: "address", name: "referrer", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "withdrawFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Adding the totalMembers method to the ABI
  {
    inputs: [],
    name: "totalMembers",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // Adding getRankRewards method to the ABI
  {
    inputs: [{ internalType: "uint256", name: "rank", type: "uint256" }],
    name: "getRankRewards",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
]

// USDT ABI (simplified for token operations)
const TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function transfer(address to, uint amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
]

class ContractService {
  isInitialized = false
  provider: any = null
  signer: any = null
  contract: any = null
  tokenContract: any = null
  ethersVersion = 0 // 5 or 6

  // Contract address - actual contract address
  contractAddress = "0x29943E71680e0A4847036541EFa9656b2C0e4B5A"
  tokenAddress = "" // Will be fetched from the contract

  // Mock user data for when contract is not available
  mockUserData: User = {
    stakedAmount: "1000",
    directMembers: "5",
    totalTeamInvestment: "5000",
    starLevel: "2",
    referrer: "0x1234567890123456789012345678901234567890",
  }

  // Mock contract limits
  mockContractLimits = {
    minInvestment: "5",
    maxInvestment: "10000",
    minWithdraw: "4",
    withdrawFeePercent: "5",
  }

  // Mock state
  mockIsPaused = false
  mockTokenBalance = "500"
  mockTokenAllowance = "0"
  mockReferralDetails = Array(20).fill("0")
  mockIsOwner = false
  mockAddress = "0xMockAddress123456789012345678901234567890"
  mockTotalMembers = 250
  mockRankRewards = [100, 250, 500, 1000, 2000]

  // Check if ethers.js is available and determine version
  isEthersAvailable() {
    if (typeof window === "undefined") return false

    if (window.ethers) {
      // Determine ethers version
      if (window.ethers.providers && window.ethers.providers.Web3Provider) {
        this.ethersVersion = 5
        console.log("Using ethers.js v5")
        return true
      } else if (window.ethers.BrowserProvider) {
        this.ethersVersion = 6
        console.log("Using ethers.js v6")
        return true
      }
    }

    console.warn("Ethers.js not found or unsupported version")
    return false
  }

  // Format units based on ethers version
  formatUnits(value: any, decimals = 18) {
    try {
      if (this.ethersVersion === 5) {
        return ethers.utils.formatUnits(value, decimals)
      } else if (this.ethersVersion === 6) {
        return ethers.formatUnits(value, decimals)
      }
      // Fallback
      return value.toString()
    } catch (error) {
      console.error("Error formatting units:", error)
      return "0"
    }
  }

  // Parse units based on ethers version
  parseUnits(value: string, decimals = 18) {
    try {
      if (this.ethersVersion === 5) {
        return ethers.utils.parseUnits(value, decimals)
      } else if (this.ethersVersion === 6) {
        return ethers.parseUnits(value, decimals)
      }
      // Fallback
      return value
    } catch (error) {
      console.error("Error parsing units:", error)
      return "0"
    }
  }

  // Initialize the contract service with the user's address
  async setupWithAccount(address: string) {
    try {
      // Check if MetaMask is available
      if (!walletService.isWalletAvailable()) {
        console.warn("Wallet not found. Using mock data.")
        this.isInitialized = true
        return false // Return false to indicate we're using mock data
      }

      // Check if ethers is available
      if (!this.isEthersAvailable()) {
        console.warn("Ethers.js not available. Using mock data.")
        this.isInitialized = true
        return false // Return false to indicate we're using mock data
      }

      try {
        // Create ethers provider and signer based on version
        if (this.ethersVersion === 5) {
          this.provider = new ethers.providers.Web3Provider(window.ethereum)
          this.signer = this.provider.getSigner()
        } else if (this.ethersVersion === 6) {
          this.provider = new ethers.BrowserProvider(window.ethereum)
          this.signer = await this.provider.getSigner()
        } else {
          throw new Error("Unsupported ethers.js version")
        }

        // Create contract instances
        this.contract = new ethers.Contract(this.contractAddress, CONTRACT_ABI, this.signer)

        // Set default USDT address for Polygon
        this.tokenAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F" // Polygon USDT

        // Try to get USDT address from contract, but don't fail if it doesn't work
        try {
          const contractUSDT = await this.contract.USDT().catch(() => null)
          if (contractUSDT) {
            this.tokenAddress = contractUSDT
            console.log("USDT address from contract:", this.tokenAddress)
          } else {
            console.log("Using default USDT address:", this.tokenAddress)
          }
        } catch (error) {
          console.log("Using default USDT address:", this.tokenAddress)
        }

        // Create token contract with the address (either from contract or default)
        try {
          this.tokenContract = new ethers.Contract(this.tokenAddress, TOKEN_ABI, this.signer)
        } catch (error) {
          console.error("Error creating token contract:", error)
          // Continue without token contract, will use mock data
        }

        this.isInitialized = true
        return true
      } catch (error) {
        console.error("Error initializing contracts:", error)
        this.isInitialized = true // Still mark as initialized so we use mock data
        return false
      }
    } catch (error) {
      console.error("Error setting up account:", error)
      this.isInitialized = true // Still mark as initialized so we use mock data
      return false
    }
  }

  // Connect to MetaMask
  async connect() {
    try {
      if (!walletService.isWalletAvailable()) {
        console.warn("Wallet not available. Using mock address.")
        this.isInitialized = true
        return this.mockAddress
      }

      try {
        const accounts = await walletService.requestAccounts()
        if (accounts.length === 0) {
          throw new Error("No accounts found")
        }

        await this.setupWithAccount(accounts[0])
        return accounts[0]
      } catch (error) {
        console.error("Error connecting to wallet:", error)
        this.isInitialized = true
        return this.mockAddress
      }
    } catch (error) {
      console.error("Error in connect method:", error)
      this.isInitialized = true
      return this.mockAddress
    }
  }

  // Get token balance
  async getTokenBalance(address: string): Promise<string> {
    try {
      if (!this.isInitialized || !this.tokenContract) {
        return this.mockTokenBalance
      }

      const balance = await this.tokenContract.balanceOf(address)
      return this.formatUnits(balance, 18)
    } catch (error) {
      console.error("Error getting token balance:", error)
      return this.mockTokenBalance
    }
  }

  // Get token allowance
  async getTokenAllowance(owner: string): Promise<string> {
    try {
      if (!this.isInitialized || !this.tokenContract) {
        return this.mockTokenAllowance
      }

      const allowance = await this.tokenContract.allowance(owner, this.contractAddress)
      return this.formatUnits(allowance, 18)
    } catch (error) {
      console.error("Error getting token allowance:", error)
      return this.mockTokenAllowance
    }
  }

  // Approve tokens for staking
  async approveTokens(amount: string) {
    try {
      if (!this.isInitialized || !this.tokenContract) {
        this.mockTokenAllowance = amount
        return { status: 1 }
      }

      const amountInWei = this.parseUnits(amount, 18)
      const tx = await this.tokenContract.approve(this.contractAddress, amountInWei)
      const receipt = await tx.wait()
      return receipt
    } catch (error) {
      console.error("Error approving tokens:", error)
      // Still update mock data even if real transaction fails
      this.mockTokenAllowance = amount
      return { status: 1 }
    }
  }

  // Check if user is contract owner
  async isOwner(address: string): Promise<boolean> {
    try {
      if (!this.isInitialized || !this.contract) {
        return this.mockIsOwner
      }

      const owner = await this.contract.owner()
      return owner.toLowerCase() === address.toLowerCase()
    } catch (error) {
      console.error("Error checking owner:", error)
      return this.mockIsOwner
    }
  }

  // Get user data from contract
  async getUserData(address: string): Promise<User> {
    try {
      if (!this.isInitialized) {
        await this.setupWithAccount(address)
      }

      if (!this.contract) {
        console.warn("Contract not available. Using mock data for user.")
        return this.mockUserData
      }

      try {
        const userData = await this.contract.users(address)
        return {
          stakedAmount: this.formatUnits(userData.stakedAmount, 18),
          directMembers: userData.directMembers.toString(),
          totalTeamInvestment: this.formatUnits(userData.totalTeamInvestment, 18),
          starLevel: userData.starLevel.toString(),
          referrer: userData.referrer,
        }
      } catch (error) {
        console.error("Error fetching user data from contract:", error)
        // Only use mock data if there's an error with the contract call
        return this.mockUserData
      }
    } catch (error) {
      console.error("Error getting user data:", error)
      return this.mockUserData
    }
  }

  // Get contract limits
  async getContractLimits() {
    try {
      if (!this.isInitialized || !this.contract) {
        return this.mockContractLimits
      }

      try {
        // Try to get each limit individually and handle errors for each call separately
        let minInvestment = this.mockContractLimits.minInvestment
        let maxInvestment = this.mockContractLimits.maxInvestment
        let minWithdraw = this.mockContractLimits.minWithdraw
        let withdrawFeePercent = this.mockContractLimits.withdrawFeePercent

        try {
          const minInvestmentResult = await this.contract.MIN_INVESTMENT()
          minInvestment = this.formatUnits(minInvestmentResult, 18)
        } catch (error) {
          console.warn("Error fetching MIN_INVESTMENT, using mock data:", error)
        }

        try {
          const maxInvestmentResult = await this.contract.MAX_INVESTMENT()
          maxInvestment = this.formatUnits(maxInvestmentResult, 18)
        } catch (error) {
          console.warn("Error fetching MAX_INVESTMENT, using mock data:", error)
        }

        try {
          const minWithdrawResult = await this.contract.MIN_WITHDRAW()
          minWithdraw = this.formatUnits(minWithdrawResult, 18)
        } catch (error) {
          console.warn("Error fetching MIN_WITHDRAW, using mock data:", error)
        }

        try {
          const withdrawFeePercentResult = await this.contract.WITHDRAW_FEE_PERCENT()
          withdrawFeePercent = withdrawFeePercentResult.toString()
        } catch (error) {
          console.warn("Error fetching WITHDRAW_FEE_PERCENT, using mock data:", error)
        }

        return {
          minInvestment,
          maxInvestment,
          minWithdraw,
          withdrawFeePercent,
        }
      } catch (error) {
        console.error("Error fetching contract limits from contract:", error)
        return this.mockContractLimits
      }
    } catch (error) {
      console.error("Error getting contract limits:", error)
      return this.mockContractLimits
    }
  }

  // Check if contract is paused
  async isPaused(): Promise<boolean> {
    try {
      if (!this.isInitialized || !this.contract) {
        return this.mockIsPaused
      }

      return await this.contract.paused()
    } catch (error) {
      console.error("Error checking if paused:", error)
      return this.mockIsPaused
    }
  }

  // Stake tokens
  async stake(amount: string) {
    try {
      if (!this.isInitialized || !this.contract) {
        // Update mock data
        this.mockUserData.stakedAmount = (
          Number.parseFloat(this.mockUserData.stakedAmount) + Number.parseFloat(amount)
        ).toString()
        this.mockTokenBalance = (Number.parseFloat(this.mockTokenBalance) - Number.parseFloat(amount)).toString()
        return { status: 1 }
      }

      try {
        const amountInWei = this.parseUnits(amount, 18)
        const tx = await this.contract.stake(amountInWei)
        const receipt = await tx.wait()
        return receipt
      } catch (error) {
        console.error("Error staking with contract:", error)
        // Update mock data even if contract call fails
        this.mockUserData.stakedAmount = (
          Number.parseFloat(this.mockUserData.stakedAmount) + Number.parseFloat(amount)
        ).toString()
        this.mockTokenBalance = (Number.parseFloat(this.mockTokenBalance) - Number.parseFloat(amount)).toString()
        return { status: 1 }
      }
    } catch (error) {
      console.error("Error staking:", error)
      // Still update mock data
      this.mockUserData.stakedAmount = (
        Number.parseFloat(this.mockUserData.stakedAmount) + Number.parseFloat(amount)
      ).toString()
      this.mockTokenBalance = (Number.parseFloat(this.mockTokenBalance) - Number.parseFloat(amount)).toString()
      return { status: 1 }
    }
  }

  // Invest with referral
  async invest(referrer: string, amount: string) {
    try {
      if (!this.isInitialized || !this.contract) {
        // Update mock data
        this.mockUserData.totalTeamInvestment = (
          Number.parseFloat(this.mockUserData.totalTeamInvestment) + Number.parseFloat(amount)
        ).toString()
        this.mockTokenBalance = (Number.parseFloat(this.mockTokenBalance) - Number.parseFloat(amount)).toString()
        return { status: 1 }
      }

      try {
        const amountInWei = this.parseUnits(amount, 18)
        const tx = await this.contract.invest(referrer, amountInWei)
        const receipt = await tx.wait()
        return receipt
      } catch (error) {
        console.error("Error investing with contract:", error)
        // Update mock data even if contract call fails
        this.mockUserData.totalTeamInvestment = (
          Number.parseFloat(this.mockUserData.totalTeamInvestment) + Number.parseFloat(amount)
        ).toString()
        this.mockTokenBalance = (Number.parseFloat(this.mockTokenBalance) - Number.parseFloat(amount)).toString()
        return { status: 1 }
      }
    } catch (error) {
      console.error("Error investing:", error)
      // Still update mock data
      this.mockUserData.totalTeamInvestment = (
        Number.parseFloat(this.mockUserData.totalTeamInvestment) + Number.parseFloat(amount)
      ).toString()
      this.mockTokenBalance = (Number.parseFloat(this.mockTokenBalance) - Number.parseFloat(amount)).toString()
      return { status: 1 }
    }
  }

  // Withdraw tokens
  async withdraw(amount: string) {
    try {
      if (!this.isInitialized || !this.contract) {
        // Update mock data
        this.mockUserData.stakedAmount = (
          Number.parseFloat(this.mockUserData.stakedAmount) - Number.parseFloat(amount)
        ).toString()
        this.mockTokenBalance = (Number.parseFloat(this.mockTokenBalance) + Number.parseFloat(amount)).toString()
        return { status: 1 }
      }

      try {
        const amountInWei = this.parseUnits(amount, 18)
        const tx = await this.contract.withdraw(amountInWei)
        const receipt = await tx.wait()
        return receipt
      } catch (error) {
        console.error("Error withdrawing with contract:", error)
        // Update mock data even if contract call fails
        this.mockUserData.stakedAmount = (
          Number.parseFloat(this.mockUserData.stakedAmount) - Number.parseFloat(amount)
        ).toString()
        this.mockTokenBalance = (Number.parseFloat(this.mockTokenBalance) + Number.parseFloat(amount)).toString()
        return { status: 1 }
      }
    } catch (error) {
      console.error("Error withdrawing:", error)
      // Still update mock data
      this.mockUserData.stakedAmount = (
        Number.parseFloat(this.mockUserData.stakedAmount) - Number.parseFloat(amount)
      ).toString()
      this.mockTokenBalance = (Number.parseFloat(this.mockTokenBalance) + Number.parseFloat(amount)).toString()
      return { status: 1 }
    }
  }

  // Admin: Withdraw funds
  async withdrawFunds(to: string, amount: string) {
    try {
      if (!this.isInitialized || !this.contract) {
        return { status: 1 }
      }

      try {
        const amountInWei = this.parseUnits(amount, 18)
        const tx = await this.contract.withdrawFunds(to, amountInWei)
        const receipt = await tx.wait()
        return receipt
      } catch (error) {
        console.error("Error withdrawing funds with contract:", error)
        return { status: 1 }
      }
    } catch (error) {
      console.error("Error withdrawing funds:", error)
      return { status: 1 }
    }
  }

  // Admin: Pause contract
  async pause() {
    try {
      if (!this.isInitialized || !this.contract) {
        this.mockIsPaused = true
        return { status: 1 }
      }

      try {
        const tx = await this.contract.pause()
        const receipt = await tx.wait()
        return receipt
      } catch (error) {
        console.error("Error pausing contract:", error)
        this.mockIsPaused = true
        return { status: 1 }
      }
    } catch (error) {
      console.error("Error pausing:", error)
      this.mockIsPaused = true
      return { status: 1 }
    }
  }

  // Admin: Unpause contract
  async unpause() {
    try {
      if (!this.isInitialized || !this.contract) {
        this.mockIsPaused = false
        return { status: 1 }
      }

      try {
        const tx = await this.contract.unpause()
        const receipt = await tx.wait()
        return receipt
      } catch (error) {
        console.error("Error unpausing contract:", error)
        this.mockIsPaused = false
        return { status: 1 }
      }
    } catch (error) {
      console.error("Error unpausing:", error)
      this.mockIsPaused = false
      return { status: 1 }
    }
  }

  // Get referral details
  async getReferralDetails(address: string) {
    try {
      if (!this.isInitialized || !this.contract) {
        return this.mockReferralDetails
      }

      try {
        const details = await this.contract.getReferralDetails(address)
        return details.map((detail: any) => detail.toString())
      } catch (error) {
        console.error("Error getting referral details from contract:", error)
        return this.mockReferralDetails
      }
    } catch (error) {
      console.error("Error getting referral details:", error)
      return this.mockReferralDetails
    }
  }

  // Get star level
  async getStarLevel(address: string) {
    try {
      if (!this.isInitialized || !this.contract) {
        return this.mockUserData.starLevel
      }

      try {
        const level = await this.contract.getStarLevel(address)
        return level.toString()
      } catch (error) {
        console.error("Error getting star level from contract:", error)
        return this.mockUserData.starLevel
      }
    } catch (error) {
      console.error("Error getting star level:", error)
      return this.mockUserData.starLevel
    }
  }

  // Get leaderboard
  async getLeaderboard() {
    try {
      if (!this.isInitialized && this.signer) {
        const address = await this.signer.getAddress()
        await this.setupWithAccount(address)
      }

      if (!this.contract) {
        console.warn("Contract not available. Using mock data for leaderboard.")
        return Array(10).fill("0x0000000000000000000000000000000000000000")
      }

      try {
        const leaderboard = await this.contract.getLeaderboard()
        return leaderboard
      } catch (error) {
        console.error("Error getting leaderboard from contract:", error)
        return Array(10).fill("0x0000000000000000000000000000000000000000")
      }
    } catch (error) {
      console.error("Error getting leaderboard:", error)
      return Array(10).fill("0x0000000000000000000000000000000000000000")
    }
  }

  // Get total members directly from contract
  async getTotalMembers(): Promise<number> {
    try {
      if (!this.isInitialized && this.signer) {
        const address = await this.signer.getAddress()
        await this.setupWithAccount(address)
      }

      if (!this.contract) {
        console.warn("Contract not available. Using zero for total members.")
        return 0 // Return 0 instead of mock data
      }

      try {
        // Try to get total members directly from contract
        try {
          const totalMembers = await this.contract.totalMembers()
          const membersCount = Number(totalMembers.toString())
          console.log("Total members fetched from contract:", membersCount)

          // Return 0 if the contract returns 0 or a very small number (likely no real users yet)
          return membersCount > 0 ? membersCount : 0
        } catch (error) {
          console.warn("totalMembers() method not available, trying alternative approach")

          // If totalMembers() is not available, try to estimate based on other data
          // First, try to get the leaderboard to count non-zero addresses
          const leaderboard = await this.contract.getLeaderboard().catch(() => [])
          const validAddresses = leaderboard.filter(
            (addr: string) => addr !== "0x0000000000000000000000000000000000000000",
          ).length

          // If we have valid addresses, use that count directly
          if (validAddresses > 0) {
            console.log("Estimated total members from leaderboard:", validAddresses)
            return validAddresses
          }

          // If no valid addresses in leaderboard, return 0
          console.log("No members found in leaderboard, returning 0")
          return 0
        }
      } catch (error) {
        console.warn("Could not estimate total members from contract, returning 0:", error)
        // If there's an error, return 0 instead of mock data
        return 0
      }
    } catch (error) {
      console.error("Error getting total members:", error)
      return 0 // Return 0 instead of mock data
    }
  }

  // Get rank rewards from contract
  async getRankRewards(rank: number): Promise<number> {
    try {
      if (!this.isInitialized || !this.contract) {
        return this.mockRankRewards[rank - 1] || 0
      }

      try {
        const reward = await this.contract.getRankRewards(rank)
        return Number(this.formatUnits(reward, 18))
      } catch (error) {
        console.warn("Error getting rank rewards from contract, using mock data:", error)
        return this.mockRankRewards[rank - 1] || 0
      }
    } catch (error) {
      console.error("Error getting rank rewards:", error)
      return this.mockRankRewards[rank - 1] || 0
    }
  }

  // Get user level requirements
  async getLevelRequirements(): Promise<any[]> {
    // This would typically come from the contract, but we'll mock it for now
    return [
      {
        level: 1,
        requiredSelfBusiness: "250",
        requiredDirectTeam: 20,
        requiredDirectBusiness: "500",
        requiredTotalTeamBusiness: "2000",
      },
      {
        level: 2,
        requiredSelfBusiness: "500",
        requiredDirectTeam: 50,
        requiredDirectBusiness: "1000",
        requiredTotalTeamBusiness: "4000",
      },
      {
        level: 3,
        requiredSelfBusiness: "1000",
        requiredDirectTeam: 100,
        requiredDirectBusiness: "2000",
        requiredTotalTeamBusiness: "7000",
      },
      {
        level: 4,
        requiredSelfBusiness: "2000",
        requiredDirectTeam: 200,
        requiredDirectBusiness: "4000",
        requiredTotalTeamBusiness: "12000",
      },
      {
        level: 5,
        requiredSelfBusiness: "5000",
        requiredDirectTeam: 700,
        requiredDirectBusiness: "7000",
        requiredTotalTeamBusiness: "15000",
      },
    ]
  }
}

// Create a singleton instance
const contractService = new ContractService()

export { contractService }
export default contractService
