import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { QuickSelect } from '../QuickSelect'

const mockTokenData = {
  USDC: {
    icon: 'https://example.com/usdc.png',
    balance: 1000,
  },
  USDT: {
    icon: 'https://example.com/usdt.png',
    balance: 500,
  },
  ETH: {
    icon: 'https://example.com/eth.png',
    balance: 10,
  },
}

const mockGetTokenSelectionState = (token: string) => {
  if (token === 'USDC') {
    return { isSource: true, isTarget: false, isSelected: true }
  }
  if (token === 'USDT') {
    return { isSource: false, isTarget: true, isSelected: true }
  }
  return { isSource: false, isTarget: false, isSelected: false }
}

const mockHandleQuickSelect = vi.fn()

const defaultProps = {
  availableTokens: ['USDC', 'USDT', 'ETH'],
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
    expect(screen.getByText('USDC')).toBeInTheDocument()
    expect(screen.getByText('USDT')).toBeInTheDocument()
    expect(screen.getByText('ETH')).toBeInTheDocument()
  })

  it('displays source and target indicators', () => {
    render(<QuickSelect {...defaultProps} />)

    // USDC should have source indicator (S)
    const usdcButton = screen.getByText('USDC').closest('button')
    expect(usdcButton).toContainHTML('S')

    // USDT should have target indicator (T)
    const usdtButton = screen.getByText('USDT').closest('button')
    expect(usdtButton).toContainHTML('T')
  })

  it('applies correct styling for selected tokens', () => {
    render(<QuickSelect {...defaultProps} />)

    const usdcButton = screen.getByText('USDC').closest('button')
    const ethButton = screen.getByText('ETH').closest('button')

    // Selected token should have border styling
    expect(usdcButton).toHaveClass('border-2', 'border-primary-200')

    // Non-selected token should have different styling
    expect(ethButton).toHaveClass('bg-neutral-100')
  })

  it('calls handleQuickSelect when token button is clicked', () => {
    render(<QuickSelect {...defaultProps} />)

    const ethButton = screen.getByText('ETH').closest('button')
    fireEvent.click(ethButton!)

    expect(mockHandleQuickSelect).toHaveBeenCalledWith('ETH')
  })

  it('renders token icons correctly', () => {
    render(<QuickSelect {...defaultProps} />)

    const usdcIcon = screen.getByAltText('USDC')
    expect(usdcIcon).toHaveAttribute('src', 'https://example.com/usdc.png')
    expect(usdcIcon).toHaveClass('w-6', 'h-6', 'rounded-full')
  })

  it('displays instruction text', () => {
    render(<QuickSelect {...defaultProps} />)

    expect(screen.getByText(/Click to select source token/)).toBeInTheDocument()
    expect(screen.getByText(/Right-click to select target token/)).toBeInTheDocument()
  })

  it('displays legend for source and target indicators', () => {
    render(<QuickSelect {...defaultProps} />)

    expect(screen.getByText('Source')).toBeInTheDocument()
    expect(screen.getByText('Target')).toBeInTheDocument()
  })
})
