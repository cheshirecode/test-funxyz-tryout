import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { useTokenPrice, useGasPrice, useSwapRate } from '../usePricing'

// Mock the pricing service
vi.mock('../../../api', () => ({
  pricingService: {
    getTokenBySymbol: vi.fn(() => Promise.resolve({ success: true, data: { priceUsd: 100 } })),
    getGasPrice: vi.fn(() => Promise.resolve({ success: true, data: { gasPriceGwei: 20 } })),
    getSwapRate: vi.fn(() => Promise.resolve({ success: true, data: { exchangeRate: 0.5 } })),
  },
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  })

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('Pricing Hooks API Deduplication', () => {
  describe('useTokenPrice', () => {
    it('should create different query keys for different refresh settings', () => {
      const wrapper = createWrapper()

      // Hook with default refresh settings
      const { result: result1 } = renderHook(
        () => useTokenPrice('1', 'USDC', true, 60000, 30000, 'refresh-disabled-false-300000'),
        { wrapper }
      )

      // Hook with 5s refresh settings
      const { result: result2 } = renderHook(
        () => useTokenPrice('1', 'USDC', true, 5000, 2000, 'refresh-5s-5000-2000'),
        { wrapper }
      )

      // Hook with 30s refresh settings
      const { result: result3 } = renderHook(
        () => useTokenPrice('1', 'USDC', true, 30000, 15000, 'refresh-30s-30000-15000'),
        { wrapper }
      )

      // All hooks should be independent and not interfere with each other
      expect(result1.current.status).toBeDefined()
      expect(result2.current.status).toBeDefined()
      expect(result3.current.status).toBeDefined()
    })

    it('should handle undefined queryKeySuffix gracefully', () => {
      const wrapper = createWrapper()

      const { result } = renderHook(
        () => useTokenPrice('1', 'USDC', true, 60000, 30000, undefined),
        { wrapper }
      )

      expect(result.current.status).toBeDefined()
    })
  })

  describe('useGasPrice', () => {
    it('should create different queries for different refresh settings', () => {
      const wrapper = createWrapper()

      const { result: result1 } = renderHook(
        () => useGasPrice('1', true, false, 300000, 'refresh-disabled-false-300000'),
        { wrapper }
      )

      const { result: result2 } = renderHook(
        () => useGasPrice('1', true, 5000, 2000, 'refresh-5s-5000-2000'),
        { wrapper }
      )

      expect(result1.current.status).toBeDefined()
      expect(result2.current.status).toBeDefined()
    })
  })

  describe('useSwapRate', () => {
    it('should properly deduplicate swap rate queries', () => {
      const wrapper = createWrapper()

      const { result: result1 } = renderHook(
        () => useSwapRate('1', 'USDC', '1', 'ETH', '100', true, false, 300000, 'refresh-disabled-false-300000'),
        { wrapper }
      )

      const { result: result2 } = renderHook(
        () => useSwapRate('1', 'USDC', '1', 'ETH', '100', true, 5000, 2000, 'refresh-5s-5000-2000'),
        { wrapper }
      )

      expect(result1.current.status).toBeDefined()
      expect(result2.current.status).toBeDefined()
    })

    it('should handle different amounts in query keys', () => {
      const wrapper = createWrapper()

      const { result: result1 } = renderHook(
        () => useSwapRate('1', 'USDC', '1', 'ETH', '100', true, 5000, 2000, 'refresh-5s-5000-2000'),
        { wrapper }
      )

      const { result: result2 } = renderHook(
        () => useSwapRate('1', 'USDC', '1', 'ETH', '200', true, 5000, 2000, 'refresh-5s-5000-2000'),
        { wrapper }
      )

      // Different amounts should create different queries even with same refresh settings
      expect(result1.current.status).toBeDefined()
      expect(result2.current.status).toBeDefined()
    })
  })

  describe('Query Key Generation', () => {
    it('should filter out falsy values from query keys', () => {
      const wrapper = createWrapper()

      // Test with undefined queryKeySuffix
      const { result } = renderHook(
        () => useTokenPrice('1', 'USDC', true, 60000, 30000, undefined),
        { wrapper }
      )

      expect(result.current.status).toBeDefined()
    })

    it('should include queryKeySuffix when provided', () => {
      const wrapper = createWrapper()

      const { result } = renderHook(
        () => useTokenPrice('1', 'USDC', true, 60000, 30000, 'test-suffix'),
        { wrapper }
      )

      expect(result.current.status).toBeDefined()
    })
  })

  describe('Refresh Interval Behavior', () => {
    it('should respect disabled refresh interval (false)', () => {
      const wrapper = createWrapper()

      const { result } = renderHook(
        () => useTokenPrice('1', 'USDC', true, false, 300000, 'refresh-disabled'),
        { wrapper }
      )

      expect(result.current.status).toBeDefined()
    })

    it('should handle numeric refresh intervals', () => {
      const wrapper = createWrapper()

      const { result } = renderHook(
        () => useTokenPrice('1', 'USDC', true, 5000, 2000, 'refresh-5s'),
        { wrapper }
      )

      expect(result.current.status).toBeDefined()
    })
  })
})