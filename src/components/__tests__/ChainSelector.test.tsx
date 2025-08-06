import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChainSelector } from '../ChainSelector'
import { useChain } from '@utils/hooks/chain'
import { useChainLogos } from '@utils/hooks/chain/useChainLogos'
import { useDropdown } from '@utils/hooks/ui/useDropdown'

// Mock hooks
vi.mock('@utils/hooks/chain', () => ({
  useChain: vi.fn(),
}))

vi.mock('@utils/hooks/chain/useChainLogos', () => ({
  useChainLogos: vi.fn(),
}))

vi.mock('@utils/hooks/ui/useDropdown', () => ({
  useDropdown: vi.fn(),
}))

const mockUseChain = useChain as vi.MockedFunction<typeof useChain>
const mockUseChainLogos = useChainLogos as vi.MockedFunction<typeof useChainLogos>
const mockUseDropdown = useDropdown as vi.MockedFunction<typeof useDropdown>

describe('ChainSelector Component', () => {
  const mockSetCurrentChainId = vi.fn()
  const mockToggle = vi.fn()
  const mockClose = vi.fn()

  const defaultChainData = {
    currentChainId: '1',
    setCurrentChainId: mockSetCurrentChainId,
    availableChains: [
      { id: '1', name: 'Ethereum', isSelected: true },
      { id: '137', name: 'Polygon', isSelected: false },
      { id: '42161', name: 'Arbitrum', isSelected: false },
    ],
    getChainName: (chainId: string) => {
      const names: Record<string, string> = {
        '1': 'Ethereum',
        '137': 'Polygon',
        '42161': 'Arbitrum',
      }
      return names[chainId] || 'Unknown'
    },
    isChainSelectionOpen: false,
    setIsChainSelectionOpen: vi.fn(),
    isValidChain: vi.fn(),
  }

  const defaultChainLogos = {
    getChainLogo: (chainId: string) => ({
      chainId,
      name: defaultChainData.getChainName(chainId),
      symbol: 'ETH',
      logoUrl: `https://example.com/${chainId}-logo.png`,
      fallbackLogoUrl: 'https://images.icon-icons.com/1858/PNG/512/iconfinder-cdn-4263517_117865.png',
    }),
    isLoading: false,
    error: null,
  }

  const defaultDropdown = {
    isOpen: false,
    toggle: mockToggle,
    close: mockClose,
    dropdownRef: { current: null },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseChain.mockReturnValue(defaultChainData)
    mockUseChainLogos.mockReturnValue(defaultChainLogos)
    mockUseDropdown.mockReturnValue(defaultDropdown)
  })

  it('should render with tutorial data attribute', () => {
    render(<ChainSelector />)

    const chainSelector = document.querySelector('[data-tutorial="network-switcher"]')
    expect(chainSelector).toBeInTheDocument()
    expect(chainSelector).toHaveAttribute('data-tutorial', 'network-switcher')
  })

  it('should display current chain with logo', () => {
    render(<ChainSelector />)

    expect(screen.getByText('Ethereum')).toBeInTheDocument()

    const chainLogo = screen.getByAltText('Ethereum')
    expect(chainLogo).toBeInTheDocument()
    expect(chainLogo).toHaveAttribute('src', 'https://example.com/1-logo.png')
    expect(chainLogo).toHaveAttribute('data-chain-id', '1')
  })

  it('should open dropdown when button is clicked', () => {
    mockUseDropdown.mockReturnValue({
      ...defaultDropdown,
      isOpen: true,
    })

    render(<ChainSelector />)

    // Check that all chain options are visible
    expect(screen.getAllByText('Ethereum')).toHaveLength(2) // Button + dropdown option
    expect(screen.getByText('Polygon')).toBeInTheDocument()
    expect(screen.getByText('Arbitrum')).toBeInTheDocument()
  })

  it('should handle chain selection', () => {
    mockUseDropdown.mockReturnValue({
      ...defaultDropdown,
      isOpen: true,
    })

    render(<ChainSelector />)

    const polygonButton = screen.getByText('Polygon')
    fireEvent.click(polygonButton)

    expect(mockSetCurrentChainId).toHaveBeenCalledWith('137')
    expect(mockClose).toHaveBeenCalled()
  })

  it('should handle image error with fallback', () => {
    render(<ChainSelector />)

    const chainLogo = screen.getByAltText('Ethereum')
    fireEvent.error(chainLogo)

    expect(chainLogo).toHaveAttribute('src', 'https://images.icon-icons.com/1858/PNG/512/iconfinder-cdn-4263517_117865.png')
  })

  it('should show selected chain with checkmark', () => {
    mockUseDropdown.mockReturnValue({
      ...defaultDropdown,
      isOpen: true,
    })

    render(<ChainSelector />)

    // Check for checkmark in the dropdown
    expect(screen.getByText('✓')).toBeInTheDocument()

    // Polygon should not have checkmark
    const polygonOption = screen.getByText('Polygon').closest('button')
    expect(polygonOption).not.toHaveTextContent('✓')
  })

  it('should show loading indicator when logos are loading', () => {
    mockUseChainLogos.mockReturnValue({
      ...defaultChainLogos,
      isLoading: true,
    })

    mockUseDropdown.mockReturnValue({
      ...defaultDropdown,
      isOpen: true,
    })

    render(<ChainSelector />)

    expect(screen.getByText('Loading chain information...')).toBeInTheDocument()
  })

  it('should use fallback logo when logoUrl is not available', () => {
    const chainsWithoutLogos = {
      ...defaultChainLogos,
      getChainLogo: (chainId: string) => ({
        chainId,
        name: defaultChainData.getChainName(chainId),
        symbol: 'ETH',
        logoUrl: undefined,
        fallbackLogoUrl: 'https://images.icon-icons.com/1858/PNG/512/iconfinder-cdn-4263517_117865.png',
      }),
    }

    mockUseChainLogos.mockReturnValue(chainsWithoutLogos)

    render(<ChainSelector />)

    const chainLogo = screen.getByAltText('Ethereum')
    expect(chainLogo).toHaveAttribute('src', 'https://images.icon-icons.com/1858/PNG/512/iconfinder-cdn-4263517_117865.png')
  })
})