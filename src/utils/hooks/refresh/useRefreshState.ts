import { useState, useCallback } from 'react'
import { RefreshRate, getNextRefreshRate, getRefreshConfig } from '../../refresh/refreshUtils'

export interface UseRefreshStateReturn {
  /** Current refresh rate */
  refreshRate: RefreshRate
  /** Set refresh rate to a specific value */
  setRefreshRate: (rate: RefreshRate) => void
  /** Cycle to the next refresh rate */
  cycleRefreshRate: () => void
  /** Get configuration for current refresh rate */
  config: ReturnType<typeof getRefreshConfig>
}

/**
 * Hook for managing refresh rate state
 * Provides state management and transition logic
 */
export const useRefreshState = (initialRate: RefreshRate = 'disabled'): UseRefreshStateReturn => {
  const [refreshRate, setRefreshRate] = useState<RefreshRate>(initialRate)

  const cycleRefreshRate = useCallback(() => {
    setRefreshRate(current => getNextRefreshRate(current))
  }, [])

  const config = getRefreshConfig(refreshRate)

  return {
    refreshRate,
    setRefreshRate,
    cycleRefreshRate,
    config,
  }
}