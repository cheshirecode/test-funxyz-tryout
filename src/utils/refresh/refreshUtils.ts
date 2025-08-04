/**
 * Utility functions for refresh rate management
 */

export type RefreshRate = 'disabled' | '5s' | '30s'

export interface RefreshRateConfig {
  label: string
  color: string
  bgColor: string
  showOverlay: boolean
  intervalMs: number | false
  staleTimeMs: number
}

/**
 * Ordered list of refresh rates for cycling
 */
export const REFRESH_RATE_ORDER: RefreshRate[] = ['disabled', '5s', '30s']

/**
 * Configuration for each refresh rate including visual and timing properties
 */
export const REFRESH_RATE_CONFIGS: Record<RefreshRate, RefreshRateConfig> = {
  disabled: {
    label: 'Auto-refresh disabled',
    color: 'text-gray-400 dark:text-gray-500',
    bgColor: 'bg-gray-100 dark:bg-gray-700',
    showOverlay: false,
    intervalMs: false,
    staleTimeMs: 5 * 60 * 1000, // 5 minutes
  },
  '5s': {
    label: 'Auto-refresh every 5 seconds',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-800',
    showOverlay: true,
    intervalMs: 5 * 1000,
    staleTimeMs: 2 * 1000,
  },
  '30s': {
    label: 'Auto-refresh every 30 seconds',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-800',
    showOverlay: true,
    intervalMs: 30 * 1000,
    staleTimeMs: 15 * 1000,
  },
}

/**
 * Get the configuration for a refresh rate
 */
export const getRefreshConfig = (rate: RefreshRate): RefreshRateConfig => {
  return REFRESH_RATE_CONFIGS[rate]
}

/**
 * Get the next refresh rate in the cycle
 */
export const getNextRefreshRate = (currentRate: RefreshRate): RefreshRate => {
  const currentIndex = REFRESH_RATE_ORDER.indexOf(currentRate)
  const nextIndex = (currentIndex + 1) % REFRESH_RATE_ORDER.length
  return REFRESH_RATE_ORDER[nextIndex]
}

/**
 * Get refresh interval in milliseconds (or false for disabled)
 */
export const getRefreshInterval = (rate: RefreshRate): number | false => {
  return getRefreshConfig(rate).intervalMs
}

/**
 * Get stale time in milliseconds
 */
export const getStaleTime = (rate: RefreshRate): number => {
  return getRefreshConfig(rate).staleTimeMs
}

/**
 * Check if refresh rate is active (not disabled)
 */
export const isRefreshActive = (rate: RefreshRate): boolean => {
  return rate !== 'disabled'
}

/**
 * Get a unique query key suffix for React Query deduplication
 * This ensures queries with different refresh settings are properly cached separately
 */
export const getRefreshQueryKey = (rate: RefreshRate): string => {
  const config = getRefreshConfig(rate)
  return `refresh-${rate}-${config.intervalMs}-${config.staleTimeMs}`
}