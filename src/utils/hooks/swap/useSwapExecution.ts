// Custom hook for swap execution logic
import { useCallback } from 'react'
import { isSwapValid } from '@helpers/validationUtils'
import type { TokenData } from '@types'

export interface UseSwapExecutionProps {
  usdAmount: string
  sourceTokenAmount: string
  sourceToken: string
  tokenData: Record<string, TokenData>
  swapping: boolean
  setSwapState: (state: Partial<{ swapping: boolean; swapComplete: boolean }>) => void
}

export interface UseSwapExecutionReturn {
  executeSwap: () => void
  canExecuteSwap: boolean
}

/**
 * Custom hook for handling swap execution with validation and state management
 */
export function useSwapExecution({
  usdAmount,
  sourceTokenAmount,
  sourceToken,
  tokenData,
  swapping,
  setSwapState,
}: UseSwapExecutionProps): UseSwapExecutionReturn {
  // Check if swap can be executed
  const canExecuteSwap = isSwapValid(usdAmount, sourceTokenAmount, sourceToken, tokenData, swapping)

  // Execute the swap with simulated API call
  const executeSwap = useCallback(() => {
    if (!canExecuteSwap) return

    setSwapState({ swapping: true })

    // Simulate API call with timeout
    setTimeout(() => {
      setSwapState({ swapping: false, swapComplete: true })

      // Reset swap complete status after 3 seconds
      setTimeout(() => {
        setSwapState({ swapComplete: false })
      }, 3000)
    }, 1500)
  }, [canExecuteSwap, setSwapState])

  return {
    executeSwap,
    canExecuteSwap,
  }
}
