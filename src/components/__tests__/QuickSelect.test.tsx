import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { QuickSelect } from '../QuickSelect'

const mockTokenData = {
  WBTC: {
    icon: 'https://example.com/wbtc.png',
    balance: 0.01,
    contractAddress: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    chainId: 1,
  },
  USDT: {
    icon: 'https://example.com/usdt.png',
    balance: 500,
    contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    chainId: 1,
  },
  USDC: {
    icon: 'https://example.com/usdc.png',
    balance: 1000,
    contractAddress: '0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8C',
    chainId: 1,
  },
  ETH: {
    icon: 'https://example.com/eth.png',
    balance: 2.5,
    contractAddress: '0x0000000000000000000000000000000000000000',
    chainId: 1,
  },
}

const mockGetTokenSelectionState = vi.fn((token: string) => ({
  isSource: token === 'WBTC',
  isTarget: token === 'USDT',
  isSelected: token === 'WBTC' || token === 'USDT',
}))

const mockHandleQuickSelect = vi.fn()

const defaultProps = {
  availableTokens: ['WBTC', 'USDT', 'USDC', 'ETH'],
  getTokenSelectionState: mockGetTokenSelectionState,
  handleQuickSelect: mockHandleQuickSelect,
  tokenData: mockTokenData,
}

describe('QuickSelect Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly with token buttons', () => {
    render(<QuickSelect {...defaultProps} />)

    expect(screen.getByText('Quick Select')).toBeInTheDocument()
    expect(screen.getByText('WBTC')).toBeInTheDocument()
    expect(screen.getByText('USDT')).toBeInTheDocument()
    expect(screen.getByText('USDC')).toBeInTheDocument()
    expect(screen.getByText('ETH')).toBeInTheDocument()
  })

  it('displays source and target indicators', () => {
    render(<QuickSelect {...defaultProps} />)

    expect(screen.getByText('Source')).toBeInTheDocument()
    expect(screen.getByText('Target')).toBeInTheDocument()
  })

  it('applies correct styling for selected tokens', () => {
    render(<QuickSelect {...defaultProps} />)

    const wbtcButton = screen.getByText('WBTC').closest('button')
    const usdtButton = screen.getByText('USDT').closest('button')

    expect(wbtcButton).toHaveClass('bg-surface-light', 'dark:bg-surface-dark')
    expect(usdtButton).toHaveClass('bg-surface-light', 'dark:bg-surface-dark')
  })

  it('calls handleQuickSelect when token button is clicked', () => {
    render(<QuickSelect {...defaultProps} />)

    const wbtcButton = screen.getByText('WBTC').closest('button')
    fireEvent.click(wbtcButton!)

    expect(mockHandleQuickSelect).toHaveBeenCalledWith('WBTC')
  })

  it('renders token icons correctly', () => {
    render(<QuickSelect {...defaultProps} />)

    const wbtcIcon = screen.getByAltText('WBTC')
    expect(wbtcIcon).toHaveAttribute('src', 'https://example.com/wbtc.png')
    expect(wbtcIcon).toHaveClass('w-5', 'h-5', 'sm:w-6', 'sm:h-6', 'rounded-full')

    const usdcIcon = screen.getByAltText('USDC')
    expect(usdcIcon).toHaveAttribute('src', 'https://example.com/usdc.png')
    expect(usdcIcon).toHaveClass('w-5', 'h-5', 'sm:w-6', 'sm:h-6', 'rounded-full')
  })

  it('displays instruction text', () => {
    render(<QuickSelect {...defaultProps} />)

    expect(screen.getByText(/Click to select source token/)).toBeInTheDocument()
    expect(screen.getByText(/Right-click to select target token/)).toBeInTheDocument()
    expect(screen.getByText(/Click again to swap source\/target/)).toBeInTheDocument()
  })

  it('displays legend for source and target indicators', () => {
    render(<QuickSelect {...defaultProps} />)

    // Find the indicator divs by their specific classes
    const sourceIndicator = document.querySelector('.bg-primary-500.rounded-full')
    const targetIndicator = document.querySelector('.bg-success-500.rounded-full')

    expect(sourceIndicator).toBeInTheDocument()
    expect(targetIndicator).toBeInTheDocument()
    expect(screen.getByText('Source')).toBeInTheDocument()
    expect(screen.getByText('Target')).toBeInTheDocument()
  })
})
