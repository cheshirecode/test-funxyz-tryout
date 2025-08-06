import { useCallback } from 'react'

export interface UseImageErrorOptions {
  fallbackUrl: string
  onError?: (element: HTMLImageElement, error: Event) => void
}

export interface UseImageErrorReturn {
  handleImageError: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void
}

/**
 * Hook for handling image loading errors with fallback functionality
 * Prevents infinite loops by checking if fallback is already applied
 */
export function useImageError({ fallbackUrl, onError }: UseImageErrorOptions): UseImageErrorReturn {
  const handleImageError = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const target = event.target as HTMLImageElement

      // Prevent infinite loop by checking if we're already using the fallback
      if (target.src !== fallbackUrl) {
        target.src = fallbackUrl

        // Optional callback for additional error handling
        if (onError) {
          onError(target, event.nativeEvent)
        }
      }
    },
    [fallbackUrl, onError]
  )

  return { handleImageError }
}

/**
 * Specialized hook for token icon error handling
 */
export function useTokenImageError(fallbackUrl?: string) {
  const defaultFallback =
    'https://images.icon-icons.com/1858/PNG/512/iconfinder-cdn-4263517_117865.png'

  return useImageError({
    fallbackUrl: fallbackUrl || defaultFallback,
  })
}

/**
 * Specialized hook for chain icon error handling with chain-specific logic
 */
export function useChainImageError(
  chainId: string,
  getChainLogo: (chainId: string) => { fallbackLogoUrl: string }
) {
  const handleImageError = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const target = event.target as HTMLImageElement
      const targetChainId = target.getAttribute('data-chain-id') || chainId

      if (targetChainId) {
        const chainLogo = getChainLogo(targetChainId)
        if (target.src !== chainLogo.fallbackLogoUrl) {
          target.src = chainLogo.fallbackLogoUrl
        }
      }
    },
    [chainId, getChainLogo]
  )

  return { handleImageError }
}
