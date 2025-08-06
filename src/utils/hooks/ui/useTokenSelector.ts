import { useCallback } from 'react'
import { useDropdown } from './useDropdown'

export interface UseTokenSelectorProps {
  selectedToken: string
  onSelectToken: (token: string) => void
  disabledToken?: string
}

export interface UseTokenSelectorReturn {
  isOpen: boolean
  toggle: () => void
  close: () => void
  dropdownRef: React.RefObject<HTMLDivElement | null>
  handleTokenSelect: (token: string) => void
  isTokenDisabled: (token: string) => boolean
}

/**
 * Hook for managing token selector dropdown logic
 * Combines dropdown functionality with token selection business logic
 */
export function useTokenSelector({
  selectedToken: _selectedToken,
  onSelectToken,
  disabledToken,
}: UseTokenSelectorProps): UseTokenSelectorReturn {
  const { isOpen, toggle, close, dropdownRef } = useDropdown()

  const handleTokenSelect = useCallback(
    (token: string) => {
      if (token !== disabledToken) {
        onSelectToken(token)
        close()
      }
    },
    [onSelectToken, disabledToken, close]
  )

  const isTokenDisabled = useCallback(
    (token: string) => {
      return token === disabledToken
    },
    [disabledToken]
  )

  return {
    isOpen,
    toggle,
    close,
    dropdownRef,
    handleTokenSelect,
    isTokenDisabled,
  }
}
