import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SwapConfirmationDialog } from '../SwapConfirmationDialog'
import type { TokenData } from '@types'

const mockTokenData: Record<string, TokenData> = {
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    icon: '/icons/usdc.png',
    usdPrice: 1.0,
    balance: 1000,
    decimals: 6,
  },
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    icon: '/icons/eth.png',
    usdPrice: 2000,
    balance: 5,
    decimals: 18,
  },
}

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  onConfirm: vi.fn(),
  usdAmount: '100',
  sourceToken: 'USDC',
  targetToken: 'ETH',
  sourceTokenAmount: '100.000000',
  targetTokenAmount: '0.050000',
  tokenData: mockTokenData,
  exchangeRate: 0.0005,
  gasPrice: {
    success: true,
    data: {
      estimatedCosts: {
        tokenSwap: {
          costEth: 0.0025,
        },
      },
    },
  },
  isLoading: false,
}

describe('SwapConfirmationDialog', () => {
  it('should not render when isOpen is false', () => {
    render(<SwapConfirmationDialog {...defaultProps} isOpen={false} />)
    expect(screen.queryByText('Confirm Swap')).not.toBeInTheDocument()
  })

  it('should render dialog when isOpen is true', () => {
    render(<SwapConfirmationDialog {...defaultProps} />)
    expect(screen.getAllByText('Confirm Swap')).toHaveLength(2) // Header and button
  })

  it('should display USD amount correctly', () => {
    render(<SwapConfirmationDialog {...defaultProps} />)
    expect(screen.getAllByText('$100')).toHaveLength(2) // Header amount and fee summary
    expect(screen.getByText('Total Swap Amount')).toBeInTheDocument()
  })

  it('should display source token information', () => {
    render(<SwapConfirmationDialog {...defaultProps} />)
    expect(screen.getByText('USD Coin')).toBeInTheDocument()
    expect(screen.getByText('USDC')).toBeInTheDocument()
    expect(screen.getByText('100.000000')).toBeInTheDocument()
  })

  it('should display target token information', () => {
    render(<SwapConfirmationDialog {...defaultProps} />)
    expect(screen.getByText('Ethereum')).toBeInTheDocument()
    expect(screen.getByText('ETH')).toBeInTheDocument()
    expect(screen.getByText('0.050000')).toBeInTheDocument()
  })

  it('should display exchange rate when provided', () => {
    render(<SwapConfirmationDialog {...defaultProps} />)
    expect(screen.getByText('Exchange Rate')).toBeInTheDocument()
    expect(screen.getByText('1 USDC = 0.000500 ETH')).toBeInTheDocument()
  })

  it('should display fee summary', () => {
    render(<SwapConfirmationDialog {...defaultProps} />)
    expect(screen.getByText('Swap Amount')).toBeInTheDocument()
    expect(screen.getAllByText('$100')).toHaveLength(2) // Header and fee summary
    expect(screen.getByText('Estimated Gas Fee')).toBeInTheDocument()
    // Gas fee: 0.0025 ETH * $2000/ETH = $5.00
    expect(screen.getByText('$5.0000')).toBeInTheDocument()
    expect(screen.getByText('Total Cost')).toBeInTheDocument()
    // Total: $100 + $5.00 = $105.00
    expect(screen.getByText('$105.0000')).toBeInTheDocument()
  })

  it('should call onClose when cancel button is clicked', () => {
    const onClose = vi.fn()
    render(<SwapConfirmationDialog {...defaultProps} onClose={onClose} />)

    fireEvent.click(screen.getByText('Cancel'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when X button is clicked', () => {
    const onClose = vi.fn()
    render(<SwapConfirmationDialog {...defaultProps} onClose={onClose} />)

    // Use a more specific selector for the X button (first button is the close button)
    const buttons = screen.getAllByRole('button')
    const closeButton = buttons[0] // X button is first
    fireEvent.click(closeButton)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should call onConfirm when confirm button is clicked', () => {
    const onConfirm = vi.fn()
    render(<SwapConfirmationDialog {...defaultProps} onConfirm={onConfirm} />)

    // Use getAllByText to get the button specifically, not the header
    const confirmButtons = screen.getAllByText('Confirm Swap')
    const confirmButton = confirmButtons.find((el) => el.tagName === 'BUTTON')
    fireEvent.click(confirmButton!)
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('should disable confirm button when loading', () => {
    render(<SwapConfirmationDialog {...defaultProps} isLoading={true} />)

    const confirmButton = screen.getByText('Processing...')
    expect(confirmButton).toBeDisabled()
  })

  it('should use default gas fee when none provided', () => {
    render(<SwapConfirmationDialog {...defaultProps} gasPrice={undefined} />)

    // Default gas: 0.00005 ETH * $2000/ETH = $0.10
    expect(screen.getByText('$0.1000')).toBeInTheDocument()
    // Total: $100 + $0.10 = $100.10
    expect(screen.getByText('$100.1000')).toBeInTheDocument()
  })

  it('should handle missing token data gracefully', () => {
    const propsWithMissingToken = {
      ...defaultProps,
      tokenData: { USDC: mockTokenData.USDC }, // Missing ETH
    }

    render(<SwapConfirmationDialog {...propsWithMissingToken} />)

    // Should still render the dialog without errors
    expect(screen.getAllByText('Confirm Swap')).toHaveLength(2) // Header and button
    expect(screen.getAllByText('ETH')).toHaveLength(2) // Symbol and exchange rate (no name when missing data)
  })

  it('should calculate USD values correctly for tokens', () => {
    render(<SwapConfirmationDialog {...defaultProps} />)

    // Source token: 100 USDC * $1.0 = $100.00
    // Target token: 0.05 ETH * $2000 = $100.00
    // Both should be $100.00
    expect(screen.getAllByText('$100.00')).toHaveLength(2)
  })

  it('should not show exchange rate when rate is 0', () => {
    render(<SwapConfirmationDialog {...defaultProps} exchangeRate={0} />)

    expect(screen.queryByText('Exchange Rate')).not.toBeInTheDocument()
  })

  it('should display fallback icon notice subtext', () => {
    render(<SwapConfirmationDialog {...defaultProps} />)

    expect(screen.getByText('* Generic crypto icons may appear due to rate-limiting from cryptologos.cc')).toBeInTheDocument()
  })
})
