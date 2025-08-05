import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { SwapButton } from '../SwapButton'

const mockOnClick = vi.fn()

const defaultProps = {
  onClick: mockOnClick,
  disabled: false,
  isSwapping: false,
  swapComplete: false,
  buttonText: 'Swap USDT to USDC',
  className: 'bg-primary-600 text-white hover:bg-primary-700',
}

describe('SwapButton Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders button with correct text when in normal state', () => {
    render(<SwapButton {...defaultProps} />)

    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('Swap USDT to USDC')
    expect(button).not.toBeDisabled()
  })

  it('calls onClick when clicked', () => {
    render(<SwapButton {...defaultProps} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('renders disabled state correctly', () => {
    render(<SwapButton {...defaultProps} disabled={true} />)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('renders swapping state with spinner and text', () => {
    render(<SwapButton {...defaultProps} isSwapping={true} />)

    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('Swapping...')
    expect(button).toBeDisabled()

    // Check for spinner SVG
    const spinner = button.querySelector('svg.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('renders swap complete state with checkmark', () => {
    render(<SwapButton {...defaultProps} swapComplete={true} />)

    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('Swap Successful')

    // Check for checkmark SVG
    const checkmark = button.querySelector('svg')
    expect(checkmark).toBeInTheDocument()
    // Verify it's a checkmark by checking the path
    expect(checkmark).toContainHTML('M5 13l4 4L19 7')
  })

  it('applies correct CSS classes', () => {
    render(<SwapButton {...defaultProps} />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass(
      'w-full',
      'py-4',
      'px-4',
      'rounded-xl',
      'font-medium',
      'bg-primary-600',
      'text-white'
    )
  })

  it('prioritizes swapping state over swap complete state', () => {
    render(<SwapButton {...defaultProps} isSwapping={true} swapComplete={true} />)

    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('Swapping...')
    expect(button).not.toHaveTextContent('Swap Successful')
  })

  it('prioritizes swap complete state over normal text', () => {
    render(<SwapButton {...defaultProps} swapComplete={true} />)

    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('Swap Successful')
    expect(button).not.toHaveTextContent('Swap USDT to USDC')
  })

  it('does not call onClick when disabled', () => {
    render(<SwapButton {...defaultProps} disabled={true} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockOnClick).not.toHaveBeenCalled()
  })
})
