// Shared TypeScript type definitions

// Token interface
export interface TokenData {
  symbol: string
  name: string
  icon: string
  usdPrice: number
  balance: number
  decimals: number
  chainId?: string
  contractAddress?: string
}

// API Response types
export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
  timestamp: string
}

// Swap types
export type SwapState = {
  swapping: boolean
  swapComplete: boolean
}

export type SwapAtoms = {
  sourceToken: string
  targetToken: string
  usdAmount: string
  sourceTokenAmount: string
  targetTokenAmount: string
  swapState: SwapState
}

// Button state types
export interface SwapButtonState {
  className: string
  disabled: boolean
  text: string
}