import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useRefreshControl } from '../useRefreshControl'
import { RefreshRate } from '../../../refresh/refreshUtils'

describe('useRefreshControl Hook', () => {
  it('should initialize with default disabled state', () => {
    const { result } = renderHook(() => useRefreshControl())

    expect(result.current.refreshRate).toBe('disabled')
    expect(result.current.refreshInterval).toBe(false)
    expect(result.current.staleTime).toBe(5 * 60 * 1000)
    expect(result.current.isActive).toBe(false)
  })

  it('should initialize with custom initial rate', () => {
    const { result } = renderHook(() => useRefreshControl('5s'))

    expect(result.current.refreshRate).toBe('5s')
    expect(result.current.refreshInterval).toBe(5000)
    expect(result.current.staleTime).toBe(2000)
    expect(result.current.isActive).toBe(true)
  })

  it('should cycle through refresh rates correctly', () => {
    const { result } = renderHook(() => useRefreshControl())

    // Initial state: disabled
    expect(result.current.refreshRate).toBe('disabled')

    // Cycle to 5s
    act(() => {
      result.current.cycleRefreshRate()
    })
    expect(result.current.refreshRate).toBe('5s')
    expect(result.current.refreshInterval).toBe(5000)
    expect(result.current.isActive).toBe(true)

    // Cycle to 30s
    act(() => {
      result.current.cycleRefreshRate()
    })
    expect(result.current.refreshRate).toBe('30s')
    expect(result.current.refreshInterval).toBe(30000)
    expect(result.current.isActive).toBe(true)

    // Cycle back to disabled
    act(() => {
      result.current.cycleRefreshRate()
    })
    expect(result.current.refreshRate).toBe('disabled')
    expect(result.current.refreshInterval).toBe(false)
    expect(result.current.isActive).toBe(false)
  })

  it('should set specific refresh rate', () => {
    const { result } = renderHook(() => useRefreshControl())

    act(() => {
      result.current.setRefreshRate('30s')
    })

    expect(result.current.refreshRate).toBe('30s')
    expect(result.current.refreshInterval).toBe(30000)
    expect(result.current.staleTime).toBe(15000)
    expect(result.current.isActive).toBe(true)
  })

  it('should provide correct config for current rate', () => {
    const { result } = renderHook(() => useRefreshControl('5s'))

    expect(result.current.config.label).toBe('Auto-refresh every 5 seconds')
    expect(result.current.config.showOverlay).toBe(true)
    expect(result.current.config.intervalMs).toBe(5000)
  })

  it('should generate unique query keys for deduplication', () => {
    const { result } = renderHook(() => useRefreshControl())

    const disabledKey = result.current.queryKeySuffix

    act(() => {
      result.current.setRefreshRate('5s')
    })
    const fiveSecKey = result.current.queryKeySuffix

    act(() => {
      result.current.setRefreshRate('30s')
    })
    const thirtySecKey = result.current.queryKeySuffix

    // All keys should be different for proper React Query deduplication
    expect(disabledKey).not.toBe(fiveSecKey)
    expect(fiveSecKey).not.toBe(thirtySecKey)
    expect(thirtySecKey).not.toBe(disabledKey)
  })

  it('should update all derived values when refresh rate changes', () => {
    const { result } = renderHook(() => useRefreshControl())

    // Test each state transition
    const testCases: Array<{
      rate: RefreshRate
      expectedInterval: number | false
      expectedStaleTime: number
      expectedActive: boolean
    }> = [
      {
        rate: 'disabled',
        expectedInterval: false,
        expectedStaleTime: 300000,
        expectedActive: false,
      },
      { rate: '5s', expectedInterval: 5000, expectedStaleTime: 2000, expectedActive: true },
      { rate: '30s', expectedInterval: 30000, expectedStaleTime: 15000, expectedActive: true },
    ]

    testCases.forEach(({ rate, expectedInterval, expectedStaleTime, expectedActive }) => {
      act(() => {
        result.current.setRefreshRate(rate)
      })

      expect(result.current.refreshRate).toBe(rate)
      expect(result.current.refreshInterval).toBe(expectedInterval)
      expect(result.current.staleTime).toBe(expectedStaleTime)
      expect(result.current.isActive).toBe(expectedActive)
    })
  })
})
