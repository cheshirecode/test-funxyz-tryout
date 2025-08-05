import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { AmountInput } from '../AmountInput'

describe('AmountInput Component', () => {
  const mockSetUsdAmount = vi.fn()

  beforeEach(() => {
    mockSetUsdAmount.mockClear()
  })

  it('renders correctly with title and description', () => {
    render(<AmountInput usdAmount='100' setUsdAmount={mockSetUsdAmount} />)

    expect(screen.getByText('Enter Amount')).toBeInTheDocument()
    expect(screen.getByText('Specify the USD value to swap')).toBeInTheDocument()
  })

  it('displays the dollar sign', () => {
    render(<AmountInput usdAmount='100' setUsdAmount={mockSetUsdAmount} />)

    const dollarSign = screen.getByText('$')
    expect(dollarSign).toBeInTheDocument()
  })

  it('renders input with correct value', () => {
    render(<AmountInput usdAmount='100' setUsdAmount={mockSetUsdAmount} />)

    const input = screen.getByRole('spinbutton')
    expect(input).toHaveValue(100)
  })

  it('calls setUsdAmount when input value changes', () => {
    render(<AmountInput usdAmount='100' setUsdAmount={mockSetUsdAmount} />)

    const input = screen.getByRole('spinbutton')
    input.value = '200'
    input.dispatchEvent(new Event('input', { bubbles: true }))

    expect(mockSetUsdAmount).toHaveBeenCalledWith('200')
  })

  it('has correct input attributes', () => {
    render(<AmountInput usdAmount='100' setUsdAmount={mockSetUsdAmount} />)

    const input = screen.getByRole('spinbutton')
    expect(input).toHaveAttribute('type', 'number')
    expect(input).toHaveAttribute('placeholder', '0.00')
    expect(input).toHaveAttribute('step', '0.01')
  })

  it('has proper styling classes', () => {
    render(<AmountInput usdAmount='100' setUsdAmount={mockSetUsdAmount} />)

    const input = screen.getByRole('spinbutton')
    expect(input).toHaveClass(
      'bg-transparent',
      'text-3xl',
      'sm:text-4xl',
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
    render(<AmountInput usdAmount='100.50' setUsdAmount={mockSetUsdAmount} />)

    const input = screen.getByRole('spinbutton')
    expect(input).toHaveValue(100.5)
  })
})
