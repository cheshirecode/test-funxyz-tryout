import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useImageError, useTokenImageError, useChainImageError } from '../useImageError'

describe('useImageError', () => {
  it('should handle image error with fallback URL', () => {
    const fallbackUrl = 'https://example.com/fallback.png'
    const onError = vi.fn()

    const { result } = renderHook(() =>
      useImageError({ fallbackUrl, onError })
    )

    // Mock image element
    const mockTarget = {
      src: 'https://example.com/broken.png',
    } as HTMLImageElement

    const mockEvent = {
      target: mockTarget,
      nativeEvent: new Event('error'),
    } as React.SyntheticEvent<HTMLImageElement, Event>

    // Call the error handler
    result.current.handleImageError(mockEvent)

    // Should update src to fallback
    expect(mockTarget.src).toBe(fallbackUrl)
    expect(onError).toHaveBeenCalledWith(mockTarget, mockEvent.nativeEvent)
  })

  it('should prevent infinite loop by not updating if already using fallback', () => {
    const fallbackUrl = 'https://example.com/fallback.png'
    const onError = vi.fn()

    const { result } = renderHook(() =>
      useImageError({ fallbackUrl, onError })
    )

    // Mock image element already using fallback
    const mockTarget = {
      src: fallbackUrl,
    } as HTMLImageElement

    const mockEvent = {
      target: mockTarget,
      nativeEvent: new Event('error'),
    } as React.SyntheticEvent<HTMLImageElement, Event>

    // Call the error handler
    result.current.handleImageError(mockEvent)

    // Should not call onError since we're already using fallback
    expect(onError).not.toHaveBeenCalled()
  })
})

describe('useTokenImageError', () => {
  it('should use default fallback URL when none provided', () => {
    const { result } = renderHook(() => useTokenImageError())

    const mockTarget = {
      src: 'https://example.com/broken.png',
    } as HTMLImageElement

    const mockEvent = {
      target: mockTarget,
      nativeEvent: new Event('error'),
    } as React.SyntheticEvent<HTMLImageElement, Event>

    result.current.handleImageError(mockEvent)

    expect(mockTarget.src).toBe('https://images.icon-icons.com/1858/PNG/512/iconfinder-cdn-4263517_117865.png')
  })

  it('should use custom fallback URL when provided', () => {
    const customFallback = 'https://example.com/custom-fallback.png'
    const { result } = renderHook(() => useTokenImageError(customFallback))

    const mockTarget = {
      src: 'https://example.com/broken.png',
    } as HTMLImageElement

    const mockEvent = {
      target: mockTarget,
      nativeEvent: new Event('error'),
    } as React.SyntheticEvent<HTMLImageElement, Event>

    result.current.handleImageError(mockEvent)

    expect(mockTarget.src).toBe(customFallback)
  })
})

describe('useChainImageError', () => {
  it('should handle chain-specific image error', () => {
    const chainId = '1'
    const mockGetChainLogo = vi.fn().mockReturnValue({
      fallbackLogoUrl: 'https://example.com/eth-fallback.png'
    })

    const { result } = renderHook(() =>
      useChainImageError(chainId, mockGetChainLogo)
    )

    const mockTarget = {
      src: 'https://example.com/broken.png',
      getAttribute: vi.fn().mockReturnValue('1'),
    } as unknown as HTMLImageElement

    const mockEvent = {
      target: mockTarget,
      nativeEvent: new Event('error'),
    } as React.SyntheticEvent<HTMLImageElement, Event>

    result.current.handleImageError(mockEvent)

    expect(mockGetChainLogo).toHaveBeenCalledWith('1')
    expect(mockTarget.src).toBe('https://example.com/eth-fallback.png')
  })

  it('should use different chain ID from data attribute', () => {
    const chainId = '1'
    const mockGetChainLogo = vi.fn().mockReturnValue({
      fallbackLogoUrl: 'https://example.com/polygon-fallback.png'
    })

    const { result } = renderHook(() =>
      useChainImageError(chainId, mockGetChainLogo)
    )

    const mockTarget = {
      src: 'https://example.com/broken.png',
      getAttribute: vi.fn().mockReturnValue('137'), // Polygon chain ID
    } as unknown as HTMLImageElement

    const mockEvent = {
      target: mockTarget,
      nativeEvent: new Event('error'),
    } as React.SyntheticEvent<HTMLImageElement, Event>

    result.current.handleImageError(mockEvent)

    expect(mockGetChainLogo).toHaveBeenCalledWith('137')
    expect(mockTarget.src).toBe('https://example.com/polygon-fallback.png')
  })
})