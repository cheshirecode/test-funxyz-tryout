import { useAtom } from 'jotai'
import {
  currentChainIdAtom,
  chainSelectionOpenAtom,
  availableChainsAtom,
} from '@state/atoms/chainAtoms'
import { isSupportedChain } from '@helpers/chainUtils'

export interface UseChainReturn {
  // Current chain state
  currentChainId: string
  setCurrentChainId: (chainId: string) => void

  // Chain selection UI
  isChainSelectionOpen: boolean
  setIsChainSelectionOpen: (open: boolean) => void

  // Available chains
  availableChains: Array<{
    id: string
    name: string
    isSelected: boolean
  }>

  // Utility functions
  isValidChain: (chainId: string) => boolean
  getChainName: (chainId: string) => string
}

/**
 * Custom hook for managing chain selection and state
 * Replaces hardcoded chain IDs with dynamic chain management
 */
export function useChain(): UseChainReturn {
  const [currentChainId, setCurrentChainId] = useAtom(currentChainIdAtom)
  const [isChainSelectionOpen, setIsChainSelectionOpen] = useAtom(chainSelectionOpenAtom)
  const [availableChains] = useAtom(availableChainsAtom)

  // Add isSelected property to available chains
  const chainsWithSelection = availableChains.map((chain) => ({
    ...chain,
    isSelected: chain.id === currentChainId,
  }))

  // Utility functions
  const isValidChain = (chainId: string): boolean => {
    return isSupportedChain(chainId)
  }

  const getChainName = (chainId: string): string => {
    const chain = chainsWithSelection.find((c) => c.id === chainId)
    return chain?.name || 'Ethereum'
  }

  return {
    currentChainId,
    setCurrentChainId,
    isChainSelectionOpen,
    setIsChainSelectionOpen,
    availableChains: chainsWithSelection,
    isValidChain,
    getChainName,
  }
}
