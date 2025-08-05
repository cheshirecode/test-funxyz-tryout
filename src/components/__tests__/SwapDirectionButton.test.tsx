import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { SwapDirectionButton } from '../SwapDirectionButton'

const mockOnClick = vi.fn()

describe('SwapDirectionButton Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders button correctly', () => {
    render(<SwapDirectionButton onClick={mockOnClick} />)

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).not.toBeDisabled()
  })

  it('calls onClick when clicked', () => {
    render(<SwapDirectionButton onClick={mockOnClick} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('contains ArrowDownIcon', () => {
    render(<SwapDirectionButton onClick={mockOnClick} />)

    const button = screen.getByRole('button')
    const icon = button.querySelector('svg')

    expect(icon).toBeInTheDocument()
    expect(icon).toHaveClass('text-text-light-secondary')
  })

  it('has proper styling classes', () => {
    render(<SwapDirectionButton onClick={mockOnClick} />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass(
      'p-3',
      'rounded-full',
      'bg-surface-light',
      'border-2',
      'border-neutral-200',
      'min-h-[44px]',
      'min-w-[44px]'
    )
  })

  it('has proper hover classes for accessibility', () => {
    render(<SwapDirectionButton onClick={mockOnClick} />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('hover:border-primary-500', 'hover:bg-primary-50')
  })

  it('has flex centering classes', () => {
    render(<SwapDirectionButton onClick={mockOnClick} />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('flex', 'items-center', 'justify-center')
  })

  it('has transition class for smooth hover effects', () => {
    render(<SwapDirectionButton onClick={mockOnClick} />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('transition-colors')
  })
})
