import { RefreshRate } from '../../refresh/refreshUtils'
import { useRefreshState, UseRefreshStateReturn } from './useRefreshState'
import { useRefreshInterval, UseRefreshIntervalReturn } from './useRefreshInterval'

export interface UseRefreshControlReturn extends
  Pick<UseRefreshStateReturn, 'refreshRate' | 'setRefreshRate' | 'cycleRefreshRate' | 'config'>,
  UseRefreshIntervalReturn {}

/**
 * Combined hook that provides complete refresh control functionality
 * Combines state management and interval logic for convenience
 */
export const useRefreshControl = (initialRate: RefreshRate = 'disabled'): UseRefreshControlReturn => {
  const {
    refreshRate,
    setRefreshRate,
    cycleRefreshRate,
    config,
  } = useRefreshState(initialRate)

  const {
    refreshInterval,
    staleTime,
    queryKeySuffix,
    isActive,
  } = useRefreshInterval(refreshRate)

  return {
    refreshRate,
    setRefreshRate,
    cycleRefreshRate,
    config,
    refreshInterval,
    staleTime,
    queryKeySuffix,
    isActive,
  }
}