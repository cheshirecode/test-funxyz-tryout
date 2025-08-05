import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ContractInfo } from '../ContractInfo'

// Mock the clipboard API
const mockWriteText = vi.fn()
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
})

// Mock window.open
const mockOpen = vi.fn()
Object.assign(window, {
  open: mockOpen,
})

describe('ContractInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should not render when contractAddress is not provided', () => {
      const { container } = render(<ContractInfo symbol='ETH' />)
      expect(container.firstChild).toBeNull()
    })

    it('should render contract info when contractAddress is provided', () => {
      render(
        <ContractInfo contractAddress='0x1234567890123456789012345678901234567890' symbol='ETH' />
      )

      expect(screen.getByText('ETH')).toBeInTheDocument() // Chain badge
      expect(screen.getByText('0x1234...7890')).toBeInTheDocument() // Formatted address
      expect(screen.getByText('Explorer')).toBeInTheDocument() // Explorer button
    })

    it('should display correct chain name for different chains', () => {
      const { rerender } = render(
        <ContractInfo
          contractAddress='0x1234567890123456789012345678901234567890'
          chainId='137'
          symbol='USDC'
        />
      )

      expect(screen.getByText('MATIC')).toBeInTheDocument()

      rerender(
        <ContractInfo
          contractAddress='0x1234567890123456789012345678901234567890'
          chainId='56'
          symbol='USDC'
        />
      )

      expect(screen.getByText('BSC')).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      const { container } = render(
        <ContractInfo
          contractAddress='0x1234567890123456789012345678901234567890'
          symbol='ETH'
          className='custom-class'
        />
      )

      expect(container.firstChild).toHaveClass('custom-class')
    })
  })

  describe('copy functionality', () => {
    it('should copy address to clipboard when copy button is clicked', async () => {
      mockWriteText.mockResolvedValue(undefined)

      render(
        <ContractInfo contractAddress='0x1234567890123456789012345678901234567890' symbol='ETH' />
      )

      const copyButton = screen.getByTitle('Copy ETH contract address')
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalledWith('0x1234567890123456789012345678901234567890')
      })
    })

    it('should show check icon when copied successfully', async () => {
      mockWriteText.mockResolvedValue(undefined)

      render(
        <ContractInfo contractAddress='0x1234567890123456789012345678901234567890' symbol='ETH' />
      )

      const copyButton = screen.getByTitle('Copy ETH contract address')
      fireEvent.click(copyButton)

      await waitFor(() => {
        // Check icon should be present (using the Check component from lucide-react)
        const checkIcon = copyButton.querySelector('svg')
        expect(checkIcon).toBeInTheDocument()
      })
    })

    it('should handle copy errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockWriteText.mockRejectedValue(new Error('Clipboard not available'))

      render(
        <ContractInfo contractAddress='0x1234567890123456789012345678901234567890' symbol='ETH' />
      )

      const copyButton = screen.getByTitle('Copy ETH contract address')
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled()
      })

      consoleErrorSpy.mockRestore()
    })
  })

  describe('explorer functionality', () => {
    it('should open explorer URL when explorer button is clicked', () => {
      render(
        <ContractInfo
          contractAddress='0x1234567890123456789012345678901234567890'
          symbol='ETH'
          chainId='1'
        />
      )

      const explorerButton = screen.getByTitle('View ETH on blockchain explorer')
      fireEvent.click(explorerButton)

      expect(mockOpen).toHaveBeenCalledWith(
        'https://etherscan.io/address/0x1234567890123456789012345678901234567890',
        '_blank',
        'noopener,noreferrer'
      )
    })

    it('should use correct explorer for different chains', () => {
      render(
        <ContractInfo
          contractAddress='0x1234567890123456789012345678901234567890'
          symbol='USDC'
          chainId='137'
        />
      )

      const explorerButton = screen.getByTitle('View USDC on blockchain explorer')
      fireEvent.click(explorerButton)

      expect(mockOpen).toHaveBeenCalledWith(
        'https://polygonscan.com/address/0x1234567890123456789012345678901234567890',
        '_blank',
        'noopener,noreferrer'
      )
    })

    it('should handle zero address (ETH) by redirecting to WETH contract', () => {
      render(
        <ContractInfo
          contractAddress='0x0000000000000000000000000000000000000000'
          symbol='ETH'
          chainId='1'
        />
      )

      const explorerButton = screen.getByTitle('View ETH on blockchain explorer')
      fireEvent.click(explorerButton)

      expect(mockOpen).toHaveBeenCalledWith(
        'https://etherscan.io/address/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '_blank',
        'noopener,noreferrer'
      )
    })
  })

  describe('accessibility', () => {
    it('should have proper button types', () => {
      render(
        <ContractInfo contractAddress='0x1234567890123456789012345678901234567890' symbol='ETH' />
      )

      const copyButton = screen.getByTitle('Copy ETH contract address')
      const explorerButton = screen.getByTitle('View ETH on blockchain explorer')

      expect(copyButton).toHaveAttribute('type', 'button')
      expect(explorerButton).toHaveAttribute('type', 'button')
    })

    it('should have descriptive titles for buttons', () => {
      render(
        <ContractInfo contractAddress='0x1234567890123456789012345678901234567890' symbol='USDC' />
      )

      expect(screen.getByTitle('Copy USDC contract address')).toBeInTheDocument()
      expect(screen.getByTitle('View USDC on blockchain explorer')).toBeInTheDocument()
    })
  })

  describe('responsive behavior', () => {
    it('should hide explorer text on small screens', () => {
      render(
        <ContractInfo contractAddress='0x1234567890123456789012345678901234567890' symbol='ETH' />
      )

      const explorerText = screen.getByText('Explorer')
      expect(explorerText).toHaveClass('hidden', 'sm:inline')
    })
  })
})
