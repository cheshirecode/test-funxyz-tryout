// Token data service with Funkit API integration
import { useState, useEffect } from 'react'
import { tokenService, defaultTokenData, type TokenData } from '../services/tokenService'

// Export the token service for direct access
export { tokenService, defaultTokenData }
export type { TokenData }

// Export swap atoms for state management
export * from './atoms/swapAtoms'

// Legacy export for backward compatibility
// This will be replaced with real data from Funkit API
export const tokenData = defaultTokenData

// Hook for getting real-time token data
export const useTokenData = () => {
  const [tokens, setTokens] = useState<Record<string, TokenData>>(defaultTokenData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoading(true)
        const realTokens = await tokenService.getTokens()
        setTokens(realTokens)
        setError(null)
      } catch (err) {
        console.error('Error fetching token data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch token data')
        // Fallback to default tokens
        setTokens(defaultTokenData)
      } finally {
        setLoading(false)
      }
    }

    fetchTokens()
  }, [])

  return { tokens, loading, error }
}