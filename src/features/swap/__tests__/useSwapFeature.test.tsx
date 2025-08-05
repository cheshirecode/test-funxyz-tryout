import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSwapFeature } from '../useSwapFeature'

// Mock the dependencies
vi.mock('@utils/hooks/data/useTokenData', () => ({
  useTokenData: () => ({
    tokenData: {
      ETH: { symbol: 'ETH', usdPrice: 3500, icon: 'eth-icon.png' },
      USDC: { symbol: 'USDC', usdPrice: 1, icon: 'usdc-icon.png' },
    },
    isLoading: false,
  }),
}))

vi.mock('@utils/hooks/swap/useSwapState', () => ({
  useSwapState: () => ({
    sourceToken: 'ETH',
    setSourceToken: vi.fn(),
    targetToken: 'USDC',
    setTargetToken: vi.fn(),
    usdAmount: '100',
    setUsdAmount: vi.fn(),
    sourceTokenAmount: '0.028',
    targetTokenAmount: '100',
    exchangeRate: 3500,
    swapping: false,
    swapComplete: false,
    showConfirmation: false,
    setSwapState: vi.fn(),
    setTokenData: vi.fn(),
    swapTokenPositions: vi.fn(),
  }),
}))

vi.mock('@utils/hooks/swap/useSwapExecution', () => ({
  useSwapExecution: () => ({
    executeSwap: vi.fn(),
    canExecuteSwap: true,
  }),
}))

vi.mock('@utils/hooks/swap/useTokenSelection', () => ({
  useTokenSelection: () => ({
    availableTokens: ['ETH', 'USDC', 'USDT'],
    handleQuickSelect: vi.fn(),
    getTokenSelectionState: vi.fn(() => ({
      isSource: false,
      isTarget: false,
      isSelected: false,
    })),
  }),
}))

vi.mock('@utils/hooks/refresh/useRefreshControl', () => ({
  useRefreshControl: () => ({
    refreshRate: 'disabled',
    setRefreshRate: vi.fn(),
    refreshInterval: false,
    staleTime: 300000,
    queryKeySuffix: 'disabled',
  }),
}))

vi.mock('@utils/hooks/pricing/usePricing', () => ({
  useTokenPrice: () => ({
    data: { priceUsd: 3500, decimals: 18, name: 'Ethereum' },
    isLoading: false,
  }),
  useGasPrice: () => ({
    data: { gasPrice: 20 },
    isLoading: false,
  }),
  useSwapRate: () => ({
    data: { rate: 3500 },
    isLoading: false,
  }),
}))

vi.mock('@helpers/buttonStateUtils', () => ({
  getSwapButtonState: () => ({
    disabled: false,
    text: 'Swap',
    className: 'bg-primary-500',
  }),
}))

describe('useSwapFeature', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return all expected properties', () => {
    const { result } = renderHook(() => useSwapFeature())

    // Check that all expected properties are returned
    expect(result.current).toHaveProperty('tokenData')
    expect(result.current).toHaveProperty('tokensLoading')
    expect(result.current).toHaveProperty('sourceToken')
    expect(result.current).toHaveProperty('targetToken')
    expect(result.current).toHaveProperty('usdAmount')
    expect(result.current).toHaveProperty('swapping')
    expect(result.current).toHaveProperty('swapComplete')
    expect(result.current).toHaveProperty('showConfirmation')
    expect(result.current).toHaveProperty('canExecuteSwap')
    expect(result.current).toHaveProperty('availableTokens')
    expect(result.current).toHaveProperty('handleQuickSelect')
    expect(result.current).toHaveProperty('getTokenSelectionState')
    expect(result.current).toHaveProperty('swapTokenPositions')
    expect(result.current).toHaveProperty('handleSwapClick')
    expect(result.current).toHaveProperty('handleConfirmationCancel')
    expect(result.current).toHaveProperty('handleConfirmationConfirm')
    expect(result.current).toHaveProperty('buttonState')
  })

  it('should provide correct initial values', () => {
    const { result } = renderHook(() => useSwapFeature())

    expect(result.current.sourceToken).toBe('ETH')
    expect(result.current.targetToken).toBe('USDC')
    expect(result.current.usdAmount).toBe('100')
    expect(result.current.sourceTokenAmount).toBe('0.028')
    expect(result.current.targetTokenAmount).toBe('100')
    expect(result.current.exchangeRate).toBe(3500)
    expect(result.current.swapping).toBe(false)
    expect(result.current.swapComplete).toBe(false)
    expect(result.current.showConfirmation).toBe(false)
    expect(result.current.canExecuteSwap).toBe(true)
    expect(result.current.availableTokens).toEqual(['ETH', 'USDC', 'USDT'])
  })

  it('should provide button state', () => {
    const { result } = renderHook(() => useSwapFeature())

    expect(result.current.buttonState).toEqual({
      disabled: false,
      text: 'Swap',
      className: 'bg-primary-500',
    })
  })

  it('should provide confirmation dialog handlers', () => {
    const { result } = renderHook(() => useSwapFeature())

    expect(typeof result.current.handleSwapClick).toBe('function')
    expect(typeof result.current.handleConfirmationCancel).toBe('function')
    expect(typeof result.current.handleConfirmationConfirm).toBe('function')
  })

  it('should provide token selection handlers', () => {
    const { result } = renderHook(() => useSwapFeature())

    expect(typeof result.current.handleQuickSelect).toBe('function')
    expect(typeof result.current.getTokenSelectionState).toBe('function')
    expect(typeof result.current.swapTokenPositions).toBe('function')
  })
})
