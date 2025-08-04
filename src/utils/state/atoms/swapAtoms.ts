// Swap-related atoms with localStorage persistence
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
// Types will be imported when needed

// Persisted atoms for swap preferences
export const swapSourceTokenAtom = atomWithStorage('swap-source-token', 'USDC')
export const swapTargetTokenAtom = atomWithStorage('swap-target-token', 'ETH')
export const swapUsdAmountAtom = atomWithStorage('swap-usd-amount', '100')

// Token data atom (to be set from React Query)
export const tokenDataAtom = atom<Record<string, any>>({})

// Derived atoms for calculated values using proper derivation
export const swapSourceTokenAmountAtom = atom((get) => {
  const usdAmount = get(swapUsdAmountAtom)
  const sourceToken = get(swapSourceTokenAtom)
  const tokenData = get(tokenDataAtom)
  
  if (!usdAmount || isNaN(parseFloat(usdAmount)) || !tokenData || !sourceToken || !tokenData[sourceToken]) {
    return '0'
  }
  
  // Calculate source token amount from USD
  const price = tokenData[sourceToken]?.price || 0
  if (price === 0) return '0'
  
  return (parseFloat(usdAmount) / price).toFixed(6)
})

export const swapTargetTokenAmountAtom = atom((get) => {
  const usdAmount = get(swapUsdAmountAtom)
  const targetToken = get(swapTargetTokenAtom)
  const tokenData = get(tokenDataAtom)
  
  if (!usdAmount || isNaN(parseFloat(usdAmount)) || !tokenData || !targetToken || !tokenData[targetToken]) {
    return '0'
  }
  
  // Calculate target token amount from USD
  const price = tokenData[targetToken]?.price || 0
  if (price === 0) return '0'
  
  return (parseFloat(usdAmount) / price).toFixed(6)
})

// Derived atom for exchange rate
export const swapExchangeRateAtom = atom((get) => {
  const sourceToken = get(swapSourceTokenAtom)
  const targetToken = get(swapTargetTokenAtom)
  const tokenData = get(tokenDataAtom)
  
  if (!tokenData || !sourceToken || !targetToken || !tokenData[sourceToken] || !tokenData[targetToken]) {
    return 0
  }
  
  const sourcePrice = tokenData[sourceToken]?.price || 0
  const targetPrice = tokenData[targetToken]?.price || 0
  
  if (sourcePrice === 0 || targetPrice === 0) return 0
  
  return sourcePrice / targetPrice
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
export const swapTokenPositionsAtom = atom(null, (get, set) => {
  const sourceToken = get(swapSourceTokenAtom)
  const targetToken = get(swapTargetTokenAtom)
  set(swapSourceTokenAtom, targetToken)
  set(swapTargetTokenAtom, sourceToken)
})

// Types can be imported from @types when needed
