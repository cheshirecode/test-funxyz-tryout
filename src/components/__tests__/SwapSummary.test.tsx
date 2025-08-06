import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SwapSummary } from '../SwapSummary'
import { useSwapFeature } from '../../features'

// Mock the useSwapFeature hook
vi.mock('../../features', () => ({
  useSwapFeature: vi.fn(),
}))

const mockUseSwapFeature = useSwapFeature as vi.MockedFunction<typeof useSwapFeature>

describe('SwapSummary Component', () => {
  const defaultMockData = {
    sourceToken: 'WBTC',
    targetToken: 'USDT',
    usdAmount: '15.99',
    sourceTokenAmount: '0.000140',
    targetTokenAmount: '15.969219',
    exchangeRate: 114.0,
    swapping: false,
    swapComplete: false,
    tokenData: {
      WBTC: {
        name: 'Wrapped Bitcoin',
        symbol: 'WBTC',
        icon: 'https://example.com/wbtc-icon.png',
        usdPrice: 114000,
      },
      USDT: {
        name: 'Tether USD',
        symbol: 'USDT',
        icon: 'https://example.com/usdt-icon.png',
        usdPrice: 1.0,
      },
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseSwapFeature.mockReturnValue(defaultMockData)
  })

  it('should render swap summary with token information', () => {
    render(<SwapSummary />)

    expect(screen.getByText('Swap Summary')).toBeInTheDocument()
    expect(screen.getByText('WBTC')).toBeInTheDocument()
    expect(screen.getByText('USDT')).toBeInTheDocument()
    expect(screen.getByText('0.000140')).toBeInTheDocument()
    expect(screen.getByText('15.969219')).toBeInTheDocument()
    expect(screen.getByText('$15.99')).toBeInTheDocument()
  })

  it('should display exchange rate', () => {
    render(<SwapSummary />)

    expect(screen.getByText('1 WBTC = 114.000000 USDT')).toBeInTheDocument()
  })

  it('should show swapping state', () => {
    mockUseSwapFeature.mockReturnValue({
      ...defaultMockData,
      swapping: true,
    })

    render(<SwapSummary />)

    expect(screen.getByText('Swapping...')).toBeInTheDocument()
  })

  it('should show swap complete state', () => {
    mockUseSwapFeature.mockReturnValue({
      ...defaultMockData,
      swapComplete: true,
    })

    render(<SwapSummary />)

    expect(screen.getByText('Swap Complete!')).toBeInTheDocument()
  })

  it('should handle image error with fallback', () => {
    render(<SwapSummary />)

    const sourceImage = screen.getByAltText('WBTC') as HTMLImageElement
    const targetImage = screen.getByAltText('USDT') as HTMLImageElement

    // Simulate image load error
    fireEvent.error(sourceImage)
    fireEvent.error(targetImage)

    // Check that the fallback URL is set
    expect(sourceImage.src).toBe('https://images.icon-icons.com/1858/PNG/512/iconfinder-cdn-4263517_117865.png')
    expect(targetImage.src).toBe('https://images.icon-icons.com/1858/PNG/512/iconfinder-cdn-4263517_117865.png')
  })

  it('should handle missing token data gracefully', () => {
    mockUseSwapFeature.mockReturnValue({
      ...defaultMockData,
      tokenData: {},
    })

    render(<SwapSummary />)

    // Should still render without crashing
    expect(screen.getByText('Swap Summary')).toBeInTheDocument()
    expect(screen.getByText('WBTC')).toBeInTheDocument()
    expect(screen.getByText('USDT')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(<SwapSummary className="custom-class" />)

    const container = screen.getByText('Swap Summary').closest('div')
    expect(container).toHaveClass('custom-class')
  })

  it('should display total value correctly', () => {
    render(<SwapSummary />)

    expect(screen.getByText('$15.99')).toBeInTheDocument()
    expect(screen.getByText('Total Value')).toBeInTheDocument()
  })

  it('should handle multiple image errors without infinite loop', () => {
    render(<SwapSummary />)

    const sourceImage = screen.getByAltText('WBTC') as HTMLImageElement

    // Simulate multiple image load errors
    fireEvent.error(sourceImage)
    fireEvent.error(sourceImage)
    fireEvent.error(sourceImage)

    // Should still have the fallback URL
    expect(sourceImage.src).toBe('https://images.icon-icons.com/1858/PNG/512/iconfinder-cdn-4263517_117865.png')
  })

  it('should display fallback icon notice subtext', () => {
    render(<SwapSummary />)

    expect(screen.getByText('* Generic crypto icons may appear due to rate-limiting from cryptologos.cc')).toBeInTheDocument()
  })
})