// Custom hook for token data fetching and management
import { useQuery } from '@tanstack/react-query'
import { tokenService, defaultTokenData, type TokenData } from '../../tokenData'

export interface UseTokenDataReturn {
  tokenData: Record<string, TokenData>
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

/**
 * Custom hook for fetching and managing token data
 */
export function useTokenData(): UseTokenDataReturn {
  const {
    data: tokenData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['tokens'],
    queryFn: () => tokenService.getTokens(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    initialData: defaultTokenData
  })

  // Ensure tokenData is always available with fallback
  const safeTokenData = tokenData || defaultTokenData

  return {
    tokenData: safeTokenData,
    isLoading,
    error: error as Error | null,
    refetch
  }
}