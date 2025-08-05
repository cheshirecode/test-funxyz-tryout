import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { AmountInput } from '../AmountInput'

const mockSetUsdAmount = vi.fn()

const defaultProps = {
  usdAmount: '100.50',
  setUsdAmount: mockSetUsdAmount,
}

describe('AmountInput Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly with title and description', () => {
    render(<AmountInput {...defaultProps} />)

    expect(screen.getByText('Enter Amount')).toBeInTheDocument()
    expect(screen.getByText('Specify the USD value to swap')).toBeInTheDocument()
  })

  it('displays the dollar sign', () => {
    render(<AmountInput {...defaultProps} />)

    expect(screen.getByText('$')).toBeInTheDocument()
  })

  it('renders input with correct value', () => {
    render(<AmountInput {...defaultProps} />)

    const input = screen.getByRole('spinbutton')
    expect(input).toHaveValue(100.5)
  })

  it('calls setUsdAmount when input value changes', () => {
    render(<AmountInput {...defaultProps} />)

    const input = screen.getByRole('spinbutton')
    fireEvent.change(input, { target: { value: '250.75' } })

    expect(mockSetUsdAmount).toHaveBeenCalledWith('250.75')
  })

  it('has correct input attributes', () => {
    render(<AmountInput {...defaultProps} />)

    const input = screen.getByRole('spinbutton')
    expect(input).toHaveAttribute('type', 'number')
    expect(input).toHaveAttribute('step', '0.01')
    expect(input).toHaveAttribute('placeholder', '0.00')
  })

  it('has proper styling classes', () => {
    render(<AmountInput {...defaultProps} />)

    const input = screen.getByRole('spinbutton')
    expect(input).toHaveClass(
      'bg-transparent',
      'text-4xl',
      'font-bold',
      'text-center',
      'outline-none'
    )
  })

  it('renders with empty value', () => {
    render(<AmountInput usdAmount='' setUsdAmount={mockSetUsdAmount} />)

    const input = screen.getByRole('spinbutton')
    expect(input).toHaveValue(null)
  })

  it('handles decimal values correctly', () => {
    render(<AmountInput usdAmount='0.37' setUsdAmount={mockSetUsdAmount} />)

    const input = screen.getByRole('spinbutton')
    expect(input).toHaveValue(0.37)

    fireEvent.change(input, { target: { value: '0.99' } })
    expect(mockSetUsdAmount).toHaveBeenCalledWith('0.99')
  })
})
