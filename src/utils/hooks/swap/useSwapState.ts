// Custom hook for swap state management using Jotai atoms
import { useAtom } from 'jotai'
import {
  swapSourceTokenAtom,
  swapTargetTokenAtom,
  swapUsdAmountAtom,
  swapStateAtom,
  setSwapStateAtom,
  swapTokenPositionsAtom
} from '../../atoms/swapAtoms'

export interface UseSwapStateReturn {
  // Token selection state
  sourceToken: string
  setSourceToken: (token: string) => void
  targetToken: string
  setTargetToken: (token: string) => void

  // Amount state
  usdAmount: string
  setUsdAmount: (amount: string) => void

  // Swap execution state
  swapping: boolean
  swapComplete: boolean
  setSwapState: (state: Partial<{ swapping: boolean; swapComplete: boolean }>) => void

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

  // Transient state atoms
  const [swapState] = useAtom(swapStateAtom)
  const [, setSwapStateAction] = useAtom(setSwapStateAtom)
  const [, swapPositions] = useAtom(swapTokenPositionsAtom)

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

    // Swap state
    swapping,
    swapComplete,
    setSwapState: setSwapStateAction,

    // Actions
    swapTokenPositions: swapPositions
  }
}