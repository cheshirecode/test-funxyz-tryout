// Custom hook for swap state management using Jotai atoms
import { useAtom } from 'jotai'
import {
  swapSourceTokenAtom,
  swapTargetTokenAtom,
  swapUsdAmountAtom,
  swapStateAtom,
  setSwapStateAtom,
  swapTokenPositionsAtom,
  swapSourceTokenAmountAtom,
  swapTargetTokenAmountAtom,
  swapExchangeRateAtom,
  tokenDataAtom,
} from '@state/atoms/swapAtoms'

export interface UseSwapStateReturn {
  // Token selection state
  sourceToken: string
  setSourceToken: (token: string) => void
  targetToken: string
  setTargetToken: (token: string) => void

  // Amount state
  usdAmount: string
  setUsdAmount: (amount: string) => void

  // Derived calculations (now from atoms)
  sourceTokenAmount: string
  targetTokenAmount: string
  exchangeRate: number

  // Swap execution state
  swapping: boolean
  swapComplete: boolean
  setSwapState: (state: Partial<{ swapping: boolean; swapComplete: boolean }>) => void

  // Token data management
  setTokenData: (data: Record<string, any>) => void

  // Actions
  swapTokenPositions: () => void
}

/**
 * Custom hook for managing all swap-related state using Jotai atoms
 */
export function useSwapState(): UseSwapStateReturn {
  // Persistent state atoms
  const [sourceToken, setSourceToken] = useAtom(swapSourceTokenAtom)
  const [targetToken, setTargetToken] = useAtom(swapTargetTokenAtom)
  const [usdAmount, setUsdAmount] = useAtom(swapUsdAmountAtom)

  // Derived calculation atoms
  const [sourceTokenAmount] = useAtom(swapSourceTokenAmountAtom)
  const [targetTokenAmount] = useAtom(swapTargetTokenAmountAtom)
  const [exchangeRate] = useAtom(swapExchangeRateAtom)

  // Transient state atoms
  const [swapState] = useAtom(swapStateAtom)
  const [, setSwapStateAction] = useAtom(setSwapStateAtom)
  const [, swapPositions] = useAtom(swapTokenPositionsAtom)

  // Token data management
  const [, setTokenData] = useAtom(tokenDataAtom)

  const { swapping, swapComplete } = swapState

  return {
    // Token selection
    sourceToken,
    setSourceToken,
    targetToken,
    setTargetToken,

    // Amount
    usdAmount,
    setUsdAmount,

    // Derived calculations
    sourceTokenAmount,
    targetTokenAmount,
    exchangeRate,

    // Swap state
    swapping,
    swapComplete,
    setSwapState: setSwapStateAction,

    // Token data management
    setTokenData,

    // Actions
    swapTokenPositions: swapPositions,
  }
}
