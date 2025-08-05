import { useMemo } from 'react'
import {
  RefreshRate,
  getRefreshInterval,
  getStaleTime,
  getRefreshQueryKey,
} from '../../refresh/refreshUtils'

export interface UseRefreshIntervalReturn {
  /** Refresh interval in milliseconds (false for disabled) */
  refreshInterval: number | false
  /** Stale time in milliseconds */
  staleTime: number
  /** Unique query key for React Query deduplication */
  queryKeySuffix: string
  /** Whether refresh is currently active */
  isActive: boolean
}

/**
 * Hook for managing refresh intervals and React Query settings
 * Provides timing configurations and query deduplication keys
 */
export const useRefreshInterval = (refreshRate: RefreshRate): UseRefreshIntervalReturn => {
  const refreshInterval = useMemo(() => getRefreshInterval(refreshRate), [refreshRate])
  const staleTime = useMemo(() => getStaleTime(refreshRate), [refreshRate])
  const queryKeySuffix = useMemo(() => getRefreshQueryKey(refreshRate), [refreshRate])
  const isActive = useMemo(() => refreshInterval !== false, [refreshInterval])

  return {
    refreshInterval,
    staleTime,
    queryKeySuffix,
    isActive,
  }
}
