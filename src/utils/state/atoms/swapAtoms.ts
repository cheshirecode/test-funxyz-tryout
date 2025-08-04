// Swap-related atoms with localStorage persistence
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { TokenData, SwapState, SwapAtoms } from '../../types'

// Persisted atoms for swap preferences
export const swapSourceTokenAtom = atomWithStorage('swap-source-token', 'USDC')
export const swapTargetTokenAtom = atomWithStorage('swap-target-token', 'ETH')
export const swapUsdAmountAtom = atomWithStorage('swap-usd-amount', '100')

// Derived atoms for calculated values (these are computed, no need to persist)
export const swapSourceTokenAmountAtom = atom<string>((get) => {
  // This will be calculated in the component where token data is available
  // We keep this as a separate atom for future extensibility
  return '0'
})

export const swapTargetTokenAmountAtom = atom<string>((get) => {
  // This will be calculated in the component where token data is available
  // We keep this as a separate atom for future extensibility
  return '0'
})

// Atom for swap status (transient state, not persisted)
export const swapStateAtom = atom({
  swapping: false,
  swapComplete: false,
})

// Derived atom to check if swap is in progress
export const isSwappingAtom = atom((get) => get(swapStateAtom).swapping)

// Derived atom to check if swap is complete
export const isSwapCompleteAtom = atom((get) => get(swapStateAtom).swapComplete)

// Write-only atom to update swap state
export const setSwapStateAtom = atom(
  null,
  (get, set, update: Partial<{ swapping: boolean; swapComplete: boolean }>) => {
    const current = get(swapStateAtom)
    set(swapStateAtom, { ...current, ...update })
  }
)

// Atom for swapping source and target tokens
export const swapTokenPositionsAtom = atom(
  null,
  (get, set) => {
    const sourceToken = get(swapSourceTokenAtom)
    const targetToken = get(swapTargetTokenAtom)
    set(swapSourceTokenAtom, targetToken)
    set(swapTargetTokenAtom, sourceToken)
  }
)

// Re-export types for backward compatibility
export type { SwapState, SwapAtoms } from '../../types'