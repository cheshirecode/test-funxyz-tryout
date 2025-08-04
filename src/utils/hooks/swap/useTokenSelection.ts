// Custom hook for token selection logic
import { useCallback } from 'react'
import { getAvailableTokens } from '@helpers/tokenUtils'

export interface UseTokenSelectionProps {
  sourceToken: string
  targetToken: string
  setSourceToken: (token: string) => void
  setTargetToken: (token: string) => void
}

export interface UseTokenSelectionReturn {
  availableTokens: string[]
  handleQuickSelect: (token: string) => void
  getTokenSelectionState: (token: string) => {
    isSource: boolean
    isTarget: boolean
    isSelected: boolean
  }
}

/**
 * Custom hook for managing token selection logic and quick selection
 */
export function useTokenSelection({
  sourceToken,
  targetToken,
  setSourceToken,
  setTargetToken,
}: UseTokenSelectionProps): UseTokenSelectionReturn {
  const availableTokens = getAvailableTokens()

  // Handle quick select token logic
  const handleQuickSelect = useCallback(
    (token: string) => {
      const isSource = sourceToken === token
      const isTarget = targetToken === token

      if (isSource) {
        // If clicking source token, swap the positions
        setSourceToken(targetToken)
        setTargetToken(token)
      } else if (isTarget) {
        // If clicking target token, swap the positions
        setTargetToken(sourceToken)
        setSourceToken(token)
      } else {
        // If clicking unselected token, make it the source
        setSourceToken(token)
      }
    },
    [sourceToken, targetToken, setSourceToken, setTargetToken]
  )

  // Get token selection state for UI rendering
  const getTokenSelectionState = useCallback(
    (token: string) => {
      const isSource = sourceToken === token
      const isTarget = targetToken === token
      const isSelected = isSource || isTarget

      return {
        isSource,
        isTarget,
        isSelected,
      }
    },
    [sourceToken, targetToken]
  )

  return {
    availableTokens,
    handleQuickSelect,
    getTokenSelectionState,
  }
}
