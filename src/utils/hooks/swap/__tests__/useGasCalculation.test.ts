import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useGasCalculation } from '../useGasCalculation'

describe('useGasCalculation', () => {
  const mockTokenData = {
    ETH: { usdPrice: 3500 },
    USDC: { usdPrice: 1.0 },
    WBTC: { usdPrice: 62000 },
  }

  it('should calculate gas costs correctly with valid gas price data', () => {
    const gasPrice = {
      success: true,
      data: {
        gasPriceGwei: 20,
        estimatedCosts: {
          tokenSwap: {
            costEth: 0.001,
          },
        },
      },
    }

    const { result } = renderHook(() =>
      useGasCalculation({
        gasPrice,
        tokenData: mockTokenData,
        sourceToken: 'USDC',
        targetToken: 'WBTC',
        usdAmount: '100',
      })
    )

    expect(result.current.gasCostEth).toBe(0.001)
    expect(result.current.ethPrice).toBe(3500)
    expect(result.current.estimatedGasFeeUsd).toBe(3.5) // 0.001 * 3500
    expect(result.current.totalCostUsd).toBe(103.5) // 100 + 3.5
  })

  it('should use default gas cost when gas price data is missing', () => {
    const { result } = renderHook(() =>
      useGasCalculation({
        gasPrice: undefined,
        tokenData: mockTokenData,
        sourceToken: 'USDC',
        targetToken: 'WBTC',
        usdAmount: '50',
      })
    )

    expect(result.current.gasCostEth).toBe(0.00005) // Default value
    expect(result.current.estimatedGasFeeUsd).toBeCloseTo(0.175) // 0.00005 * 3500
    expect(result.current.totalCostUsd).toBeCloseTo(50.175)
  })

  it('should use ETH price from source token when source is ETH', () => {
    const tokenDataWithDifferentEthPrice = {
      ETH: { usdPrice: 4000 },
      USDC: { usdPrice: 1.0 },
    }

    const { result } = renderHook(() =>
      useGasCalculation({
        gasPrice: undefined,
        tokenData: tokenDataWithDifferentEthPrice,
        sourceToken: 'ETH',
        targetToken: 'USDC',
        usdAmount: '100',
      })
    )

    expect(result.current.ethPrice).toBe(4000)
    expect(result.current.estimatedGasFeeUsd).toBe(0.2) // 0.00005 * 4000
  })

  it('should use ETH price from target token when target is ETH', () => {
    const tokenDataWithDifferentEthPrice = {
      ETH: { usdPrice: 4000 },
      USDC: { usdPrice: 1.0 },
    }

    const { result } = renderHook(() =>
      useGasCalculation({
        gasPrice: undefined,
        tokenData: tokenDataWithDifferentEthPrice,
        sourceToken: 'USDC',
        targetToken: 'ETH',
        usdAmount: '100',
      })
    )

    expect(result.current.ethPrice).toBe(4000)
  })

  it('should use default ETH price when ETH data is not available', () => {
    const tokenDataWithoutEth = {
      USDC: { usdPrice: 1.0 },
      WBTC: { usdPrice: 62000 },
    }

    const { result } = renderHook(() =>
      useGasCalculation({
        gasPrice: undefined,
        tokenData: tokenDataWithoutEth,
        sourceToken: 'USDC',
        targetToken: 'WBTC',
        usdAmount: '100',
      })
    )

    expect(result.current.ethPrice).toBe(3500) // Default ETH price
    expect(result.current.estimatedGasFeeUsd).toBeCloseTo(0.175) // 0.00005 * 3500
  })

  it('should handle empty or invalid USD amount', () => {
    const { result } = renderHook(() =>
      useGasCalculation({
        gasPrice: undefined,
        tokenData: mockTokenData,
        sourceToken: 'USDC',
        targetToken: 'WBTC',
        usdAmount: '',
      })
    )

    expect(result.current.totalCostUsd).toBeCloseTo(0.175) // Only gas fee, no swap amount
  })

  it('should recalculate when dependencies change', () => {
    const gasPrice = {
      success: true,
      data: {
        gasPriceGwei: 20,
        estimatedCosts: {
          tokenSwap: {
            costEth: 0.001,
          },
        },
      },
    }

    const { result, rerender } = renderHook(
      ({ usdAmount }) =>
        useGasCalculation({
          gasPrice,
          tokenData: mockTokenData,
          sourceToken: 'USDC',
          targetToken: 'WBTC',
          usdAmount,
        }),
      { initialProps: { usdAmount: '100' } }
    )

    expect(result.current.totalCostUsd).toBe(103.5)

    // Change USD amount
    rerender({ usdAmount: '200' })

    expect(result.current.totalCostUsd).toBe(203.5) // 200 + 3.5
  })
})