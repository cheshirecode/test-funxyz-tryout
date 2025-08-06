// Chain-related atoms with localStorage persistence
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { getSupportedChainIds, isSupportedChain } from '@helpers/chainUtils'

// Persisted atom for selected chain ID
export const selectedChainIdAtom = atomWithStorage('selected-chain-id', '1')

// Derived atom to ensure selected chain is always valid
export const currentChainIdAtom = atom(
  (get) => {
    const selectedChainId = get(selectedChainIdAtom)
    return isSupportedChain(selectedChainId) ? selectedChainId : '1'
  },
  (get, set, newChainId: string) => {
    if (isSupportedChain(newChainId)) {
      set(selectedChainIdAtom, newChainId)
    }
  }
)

// Atom for chain selection UI state
export const chainSelectionOpenAtom = atom(false)

// Atom for available chains (can be extended for dynamic chain discovery)
export const availableChainsAtom = atom(() => {
  return getSupportedChainIds().map((chainId) => ({
    id: chainId,
    name: getChainName(chainId),
    isSelected: false, // Will be computed in components
  }))
})

// Helper function to get chain name (imported from chainUtils)
function getChainName(chainId: string): string {
  const chainNames: Record<string, string> = {
    '1': 'Ethereum',
    '137': 'Polygon',
    '56': 'BSC',
    '43114': 'Avalanche',
    '42161': 'Arbitrum',
    '10': 'Optimism',
    '8453': 'Base',
  }
  return chainNames[chainId] || 'Ethereum'
}
