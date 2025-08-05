import { describe, it, expect } from 'vitest'
import {
  RefreshRate,
  REFRESH_RATE_ORDER,
  REFRESH_RATE_CONFIGS,
  getRefreshConfig,
  getNextRefreshRate,
  getRefreshInterval,
  getStaleTime,
  isRefreshActive,
  getRefreshQueryKey,
} from '../refreshUtils'

describe('Refresh Utilities', () => {
  describe('REFRESH_RATE_ORDER', () => {
    it('should have correct order', () => {
      expect(REFRESH_RATE_ORDER).toEqual(['disabled', '5s', '30s'])
    })

    it('should include all refresh rates', () => {
      const allRates: RefreshRate[] = ['disabled', '5s', '30s']
      expect(REFRESH_RATE_ORDER).toEqual(expect.arrayContaining(allRates))
      expect(REFRESH_RATE_ORDER).toHaveLength(allRates.length)
    })
  })

  describe('REFRESH_RATE_CONFIGS', () => {
    it('should have configurations for all rates', () => {
      expect(Object.keys(REFRESH_RATE_CONFIGS)).toEqual(expect.arrayContaining(REFRESH_RATE_ORDER))
    })

    it('should have correct disabled config', () => {
      const config = REFRESH_RATE_CONFIGS.disabled
      expect(config.intervalMs).toBe(false)
      expect(config.showOverlay).toBe(false)
      expect(config.staleTimeMs).toBe(5 * 60 * 1000)
    })

    it('should have correct 5s config', () => {
      const config = REFRESH_RATE_CONFIGS['5s']
      expect(config.intervalMs).toBe(5000)
      expect(config.showOverlay).toBe(true)
      expect(config.staleTimeMs).toBe(2000)
    })

    it('should have correct 30s config', () => {
      const config = REFRESH_RATE_CONFIGS['30s']
      expect(config.intervalMs).toBe(30000)
      expect(config.showOverlay).toBe(true)
      expect(config.staleTimeMs).toBe(15000)
    })
  })

  describe('getRefreshConfig', () => {
    it('should return correct config for each rate', () => {
      expect(getRefreshConfig('disabled')).toBe(REFRESH_RATE_CONFIGS.disabled)
      expect(getRefreshConfig('5s')).toBe(REFRESH_RATE_CONFIGS['5s'])
      expect(getRefreshConfig('30s')).toBe(REFRESH_RATE_CONFIGS['30s'])
    })
  })

  describe('getNextRefreshRate', () => {
    it('should cycle correctly: disabled → 5s → 30s → disabled', () => {
      expect(getNextRefreshRate('disabled')).toBe('5s')
      expect(getNextRefreshRate('5s')).toBe('30s')
      expect(getNextRefreshRate('30s')).toBe('disabled')
    })
  })

  describe('getRefreshInterval', () => {
    it('should return correct intervals', () => {
      expect(getRefreshInterval('disabled')).toBe(false)
      expect(getRefreshInterval('5s')).toBe(5000)
      expect(getRefreshInterval('30s')).toBe(30000)
    })
  })

  describe('getStaleTime', () => {
    it('should return correct stale times', () => {
      expect(getStaleTime('disabled')).toBe(5 * 60 * 1000)
      expect(getStaleTime('5s')).toBe(2000)
      expect(getStaleTime('30s')).toBe(15000)
    })
  })

  describe('isRefreshActive', () => {
    it('should return false for disabled', () => {
      expect(isRefreshActive('disabled')).toBe(false)
    })

    it('should return true for active rates', () => {
      expect(isRefreshActive('5s')).toBe(true)
      expect(isRefreshActive('30s')).toBe(true)
    })
  })

  describe('getRefreshQueryKey', () => {
    it('should return unique keys for different rates', () => {
      const disabledKey = getRefreshQueryKey('disabled')
      const fiveSecKey = getRefreshQueryKey('5s')
      const thirtySecKey = getRefreshQueryKey('30s')

      expect(disabledKey).toContain('disabled')
      expect(fiveSecKey).toContain('5s')
      expect(thirtySecKey).toContain('30s')

      // All keys should be different
      expect(disabledKey).not.toBe(fiveSecKey)
      expect(fiveSecKey).not.toBe(thirtySecKey)
      expect(thirtySecKey).not.toBe(disabledKey)
    })

    it('should include timing information for proper deduplication', () => {
      const key = getRefreshQueryKey('5s')
      expect(key).toContain('5000') // interval
      expect(key).toContain('2000') // stale time
    })
  })
})
