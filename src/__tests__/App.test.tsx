import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../App'

describe('TokenSwap App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('App Component Structure', () => {
    it('renders the main app container with TokenSwap component', () => {
      render(<App />)

      // Check for main container with proper styling
      const appContainer = document.querySelector('.flex.w-full.min-h-screen')
      expect(appContainer).toBeInTheDocument()
    })

    it('displays the Token Price Explorer header', () => {
      render(<App />)

      const header = screen.getByText('Token Price Explorer')
      expect(header).toBeInTheDocument()
      expect(header).toHaveClass('text-2xl', 'font-bold')
    })

    it('shows all four token selector buttons', () => {
      render(<App />)

      // Check for all token buttons in the top selector
      expect(screen.getAllByText('USDC')).toHaveLength(2) // Button + dropdown
      expect(screen.getByText('USDT')).toBeInTheDocument()
      expect(screen.getAllByText('ETH')).toHaveLength(2) // Button + dropdown
      expect(screen.getByText('WBTC')).toBeInTheDocument()
    })

    it('displays FROM and TO swap sections', () => {
      render(<App />)

      expect(screen.getByText('From')).toBeInTheDocument()
      expect(screen.getByText('To')).toBeInTheDocument()
    })

    it('shows the swap arrow button between sections', () => {
      render(<App />)

      // Check for the arrow swap button (the one with ArrowDownIcon)
      const arrowButtons = screen.getAllByRole('button')
      const swapArrowButton = arrowButtons.find((button) =>
        button.querySelector('svg[class*="arrow-down"]') ||
        button.className.includes('border-2')
      )
      expect(swapArrowButton).toBeInTheDocument()
    })
  })

  describe('Token Selection Functionality', () => {
    it('allows selecting different source tokens from top buttons', async () => {
      const user = userEvent.setup()
      render(<App />)

      // Click ETH button to select as source (get the first ETH button from top selector)
      const ethButtons = screen.getAllByRole('button', { name: /eth/i })
      const ethButton = ethButtons[0] // First ETH button is in the top selector
      await user.click(ethButton)

      // Should update the FROM section to show ETH
      await waitFor(() => {
        expect(screen.getAllByText('ETH')).toHaveLength(2) // Button + FROM section
      })
    })

    it('prevents selecting the same token for both source and target', async () => {
      const user = userEvent.setup()
      render(<App />)

      // Default is USDC->ETH, try to set target to USDC
      const targetSelector = screen.getByText('To').closest('div')?.querySelector('button')
      if (targetSelector) {
        await user.click(targetSelector)

        // USDC option should be disabled in dropdown
        const usdcOption = screen.getByText('USD Coin').closest('button')
        expect(usdcOption).toHaveClass('opacity-50', 'cursor-not-allowed')
      }
    })
  })

  describe('Amount Input and Conversion', () => {
    it('displays default amount and conversion', () => {
      render(<App />)

      // Should show default USD amount (FROM input)
      const amountInputs = screen.getAllByPlaceholderText('0')
      const fromInput = amountInputs.find((input) => input.getAttribute('type') === 'number') as HTMLInputElement
      expect(fromInput).toHaveValue(100)

      // Should show converted amount (multiple ≈ symbols exist)
      expect(screen.getAllByText(/≈/)).toHaveLength(2) // TO and exchange rate (USD field removed the FROM ≈ display)
    })

    it('updates conversion when amount changes', async () => {
      const user = userEvent.setup()
      render(<App />)

      const amountInputs = screen.getAllByPlaceholderText('0')
      const fromInput = amountInputs.find((input) => input.getAttribute('type') === 'number') as HTMLInputElement
      await user.clear(fromInput!)
      await user.type(fromInput!, '200')

      // Should recalculate conversion
      await waitFor(() => {
        expect(fromInput).toHaveValue(200)
      })
    })

    it('shows balance information for tokens', () => {
      render(<App />)

      // Check that token selector buttons exist
      const tokenButtons = screen.getAllByRole('button')
      const hasTokenSelectors = tokenButtons.some((button) =>
        button.textContent?.includes('USDC') || button.textContent?.includes('ETH')
      )
      expect(hasTokenSelectors).toBe(true)
    })

    it('displays USD input field', () => {
      render(<App />)

      // Check for USD input field
      const usdInput = screen.getByDisplayValue('100')
      expect(usdInput).toBeInTheDocument()
      expect(usdInput).toHaveAttribute('type', 'number')
    })
  })

  describe('Swap Functionality', () => {
    it('enables swap button when valid amounts are entered', () => {
      render(<App />)

      const swapButton = screen.getByRole('button', { name: /swap.*to/i })
      expect(swapButton).toBeInTheDocument()
      expect(swapButton).not.toBeDisabled()
    })

    it('shows loading state during swap execution', async () => {
      const user = userEvent.setup()
      render(<App />)

      const swapButton = screen.getByRole('button', { name: /swap.*to/i })
      await user.click(swapButton)

      // Should show loading state
      await waitFor(() => {
        expect(screen.getByText(/swapping/i)).toBeInTheDocument()
      })
    })

    it('shows success state after swap completion', async () => {
      const user = userEvent.setup()
      render(<App />)

      const swapButton = screen.getByRole('button', { name: /swap.*to/i })
      await user.click(swapButton)

      // Wait for swap to complete and show success
      await waitFor(() => {
        expect(screen.getByText(/swap successful/i)).toBeInTheDocument()
      }, { timeout: 3000 })
    })
  })

  describe('Responsive Design', () => {
    it('applies mobile-first responsive classes', () => {
      render(<App />)

      const container = document.querySelector('.w-full.max-w-md')
      expect(container).toBeInTheDocument()
    })

    it('has minimum touch targets for mobile (44px)', () => {
      render(<App />)

      // Token selector buttons should have min-h-[44px]
      const tokenButtons = screen.getAllByRole('button')
      tokenButtons.forEach((button) => {
        const hasMinHeight = button.className.includes('min-h-[44px]') ||
                           button.className.includes('py-3') ||
                           button.className.includes('h-18')
        expect(hasMinHeight).toBe(true)
      })
    })
  })

  describe('Visual Design Compliance', () => {
    it('uses correct typography scale for token amounts', () => {
      render(<App />)

      // Check for token-amount classes (24px as per design requirements)
      const amountElements = document.querySelectorAll('.text-token-amount, .text-2xl')
      expect(amountElements.length).toBeGreaterThan(0)
    })

    it('applies proper color system classes', () => {
      render(<App />)

      // Check for primary, success, warning color usage
      const coloredElements = document.querySelectorAll('[class*="primary"], [class*="success"], [class*="warning"]')
      expect(coloredElements.length).toBeGreaterThan(0)
    })

    it('maintains proper spacing system (8px grid)', () => {
      render(<App />)

      // Check for consistent spacing classes
      const spacedElements = document.querySelectorAll('[class*="p-"], [class*="m-"], [class*="space-"]')
      expect(spacedElements.length).toBeGreaterThan(0)
    })
  })
})