import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TokenSwap } from '../TokenSwap'

// Mock all the complex dependencies
vi.mock('../../features', () => ({
  useSwapFeature: vi.fn(() => ({
    tokenData: {},
    tokensLoading: false,
    sourceToken: 'WBTC',
    setSourceToken: vi.fn(),
    targetToken: 'USDT',
    setTargetToken: vi.fn(),
    usdAmount: '15.99',
    setUsdAmount: vi.fn(),
    sourceTokenAmount: '0.000140',
    targetTokenAmount: '15.969219',
    exchangeRate: 113969.160894,
    swapping: false,
    swapComplete: false,
    showConfirmation: false,
    sourceTokenPrice: { success: true, data: { priceUsd: 114117.47 } },
    targetTokenPrice: { success: true, data: { priceUsd: 1.0 } },
    gasPrice: { success: true, data: { gasPriceGwei: 20, estimatedCosts: { tokenSwap: { costEth: 0.000102 } } } },
    realSwapRate: { success: true, data: { exchangeRate: 113969.160894 } },
    sourcePriceLoading: false,
    targetPriceLoading: false,
    gasPriceLoading: false,
    swapRateLoading: false,
    refreshRate: 'manual',
    setRefreshRate: vi.fn(),
    canExecuteSwap: true,
    availableTokens: ['WBTC', 'USDT', 'USDC', 'ETH'],
    handleQuickSelect: vi.fn(),
    getTokenSelectionState: vi.fn(() => ({ isSource: false, isTarget: false, isSelected: false })),
    swapTokenPositions: vi.fn(),
    handleSwapClick: vi.fn(),
    handleConfirmationCancel: vi.fn(),
    handleConfirmationConfirm: vi.fn(),
    buttonState: { disabled: false, text: 'Swap WBTC to USDT', className: 'bg-primary-500' },
  })),
}))

// Mock the refresh utilities
vi.mock('../../utils/refresh', () => ({
  RefreshRate: 'manual',
  getRefreshConfig: vi.fn(() => ({
    label: 'Manual refresh',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    showOverlay: false,
    intervalMs: false,
    staleTimeMs: 300000,
  })),
  getNextRefreshRate: vi.fn(() => 'manual'),
}))

// Mock the helpers
vi.mock('@helpers', () => ({
  getBalanceTextStyle: vi.fn(() => 'text-text-light-muted'),
  formatTokenBalance: vi.fn(() => '0.00'),
  handleTokenIconError: vi.fn(),
}))

describe.skip('Responsive Layout for 375px Viewport - Legacy Tests (Skipped)', () => {
  it('should have responsive container width for 375px viewport', () => {
    render(<TokenSwap />)

    const container = screen.getByText('Token Price Explorer').closest('div')?.parentElement
    expect(container).toHaveClass('max-w-sm', 'sm:max-w-md')
  })

  it('should have responsive padding for small screens', () => {
    render(<TokenSwap />)

    const container = screen.getByText('Token Price Explorer').closest('div')?.parentElement
    expect(container).toHaveClass('p-3', 'sm:p-6')
  })

  it('should have responsive header text sizing', () => {
    render(<TokenSwap />)

    const header = screen.getByText('Token Price Explorer')
    expect(header).toHaveClass('text-xl', 'sm:text-2xl')
  })

  it('should have responsive spacing in components', () => {
    render(<TokenSwap />)

    // Check that spacing is responsive
    const elements = document.querySelectorAll('[class*="mb-"], [class*="p-"]')
    let hasResponsiveSpacing = false

    elements.forEach((element) => {
      const className = element.className
      if (className.includes('sm:') && (className.includes('mb-') || className.includes('p-'))) {
        hasResponsiveSpacing = true
      }
    })

    expect(hasResponsiveSpacing).toBe(true)
  })

  it('should have scrollbar-hide utility for horizontal scrolling', () => {
    render(<TokenSwap />)

    // Check that QuickSelect has scrollbar-hide class
    const quickSelectContainer = screen.getByText('Quick Select').closest('div')?.parentElement
    const scrollContainer = quickSelectContainer?.querySelector('.overflow-x-auto')
    expect(scrollContainer).toHaveClass('scrollbar-hide')
  })
})